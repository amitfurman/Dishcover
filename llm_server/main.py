from flask import Flask, request, jsonify
import json
import faiss
import pandas as pd
from sentence_transformers import SentenceTransformer
import numpy as np
from pymongo import MongoClient
from bson.binary import Binary
import pickle
from dotenv import load_dotenv
from bson import ObjectId
import os
from transformers import pipeline
from colorama import Fore, Style, init

# Initialize colorama for color support
init(autoreset=True)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# MongoDB setup
MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME = "dishcover_db"
EMBEDDING_COLLECTION = "restaurants_embeddings"
MAX_RESTAURANT_SUGGESTIONS = 50

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[EMBEDDING_COLLECTION]

# Budget mapping for matching
BUDGET_MAPPING = {
    '$': 1, '$ - $$': 2, '$ -$$': 2, '$$': 3, '$$ - $$$': 4, '$$$$': 5
}

# Constants for score weightings
SEMANTIC_WEIGHT = 59
TYPE_WEIGHT = 15
BUDGET_WEIGHT = 10
DIETARY_WEIGHT = 4
ACCESSIBILITY_WEIGHT = 4
FIXED_MAX_REVIEW_WEIGHT = 10

def print_info(message):
    print(Fore.CYAN + message)

def print_success(message):
    print(Fore.GREEN + message)

def print_warning(message):
    print(Fore.YELLOW + message)

def print_error(message):
    print(Fore.RED + message)

# Serialize and deserialize embeddings for storage in the database
def serialize_embedding(embedding):
    print_info("Serializing embedding")
    return Binary(pickle.dumps(embedding, protocol=2))

def deserialize_embedding(binary):
    return pickle.loads(binary)

# Helper function to match budget levels
def calculate_budget_match(user_budget, restaurant_budget):
    print_info(f"Calculating budget match between user: {user_budget} and restaurant: {restaurant_budget}")
    user_budget_level = BUDGET_MAPPING.get(user_budget, 0)
    restaurant_budget_level = BUDGET_MAPPING.get(restaurant_budget, 0)
    budget_match_score = 1 - abs(user_budget_level - restaurant_budget_level) / 5  # Normalized to [0, 1]
    print_success(f"Budget match score: {budget_match_score}")
    return budget_match_score

# Load and preprocess restaurant data
def preprocess_data(restaurant_data):
    print_info("Preprocessing restaurant data")
    df = pd.DataFrame(restaurant_data)
    df['description'] = df['description'].fillna('')
    df['_id'] = df['_id'].apply(lambda x: x['$oid'] if isinstance(x, dict) and '$oid' in x else x)

    # Fill NaNs for boolean fields to ensure compatibility
    df['rating'] = df['rating'].fillna(0)
    df['priceLevel'] = df['priceLevel'].fillna('')
    df['isVeganFriendly'] = df['isVeganFriendly'].fillna(False)
    df['isWheelchairAccessible'] = df['isWheelchairAccessible'].fillna(False)
    df['isGlutenFree'] = df['isGlutenFree'].fillna(False)

    # Extract restaurant scores or set defaults
    for criterion in ['foodQuality', 'cleanliness', 'serviceQuality', 'atmosphereQuality']:
        df[criterion] = df.apply(lambda row: row.get('restaurantScores', {}).get(criterion, 3), axis=1)

    print_success("Data preprocessed successfully")
    return df

# Retrieve embeddings from the database or generate them if they don't exist
def get_or_generate_embeddings(df, model_name='sentence-transformers/all-MiniLM-L6-v2'):
    print_info("Loading sentence transformer model")
    model = SentenceTransformer(model_name)
    embeddings = []

    for _, row in df.iterrows():
        restaurant_id = row['_id']
        result = collection.find_one({"restaurant_id": restaurant_id})

        reviews = row.get('reviews', [])
        review_comments = ' '.join([review['comments'] for review in reviews]) if reviews else ''

        if result:
            embedding = deserialize_embedding(result['embedding'])
        else:
            text_representation = f"{row['name']} {row['description']} {row['city']} {row['type']} {review_comments}"
            embedding = model.encode(text_representation)
            collection.insert_one({ "restaurant_id": restaurant_id,"embedding": serialize_embedding(embedding)})

        embeddings.append(embedding)
    print_success("Embeddings retrieved")
    return np.array(embeddings), model

def calculate_user_preferences_from_reviews(reviews):
    print_info("Calculating user preferences from reviews")
    # Initialize totals and counts
    totals = {'food': 0, 'cleanliness': 0, 'service': 0, 'atmosphere': 0}
    counts = {'food': 0, 'cleanliness': 0, 'service': 0, 'atmosphere': 0}

    # Accumulate totals and counts for non-null scores
    for review in reviews:
        for criterion in totals.keys():
            score_key = f"{criterion}Score"
            if score_key in review and review[score_key] is not None:
                totals[criterion] += review[score_key]
                counts[criterion] += 1

    # Calculate averages and ensure no division by zero
    averages = {criterion: (totals[criterion] / counts[criterion] if counts[criterion] > 0 else 0) for criterion in totals.keys()}
    total_counts = sum(counts.values())

    # Calculate weights based on averages
    weights = {criterion: (averages[criterion] / total_counts if total_counts > 0 else 0) for criterion in averages.keys()}

    # Filter out criteria with zero weight and normalize the remaining weights
    valid_weights = {k: v for k, v in weights.items() if v > 0}
    valid_total = sum(valid_weights.values())

    # Normalize weights so they sum to 1
    normalized_weights = {k: v / valid_total for k, v in valid_weights.items()} if valid_total > 0 else {}
    print_success("User preferences calculated successfully")
    return normalized_weights

def calculate_matching_score(restaurant, user_query, restaurant_embedding, user_reviews_embedding, review_weights):
    print_info(f"Calculating matching score for restaurant: {restaurant['_id']}")
    # Initialize scores
    total_score, max_score = 0, 0

    # Semantic similarity
    if np.linalg.norm(user_reviews_embedding) > 0 and np.linalg.norm(restaurant_embedding) > 0:
        similarity = np.dot(user_reviews_embedding, restaurant_embedding) / (
                np.linalg.norm(user_reviews_embedding) * np.linalg.norm(restaurant_embedding))
        print_info(f"Calculated similarity: {similarity}")
        similarity_boost = 0.4 if similarity < 1 else 0
        semantic_similarity_score  = (similarity + similarity_boost) * SEMANTIC_WEIGHT
        print_info(f"Semantic similarity score : {semantic_similarity_score}")

        # Update total and max score
        total_score += semantic_similarity_score
        max_score += SEMANTIC_WEIGHT

    # Match on 'types' --> cuisines
    preferred_types = set(user_query.get('types', []))
    restaurant_types = set(restaurant.get('type', []))
    if preferred_types:
        type_match = len(preferred_types.intersection(restaurant_types)) / len(preferred_types)
        total_score += type_match * TYPE_WEIGHT
        max_score += TYPE_WEIGHT

    # Match on budget
    user_budget = user_query.get('budget')
    restaurant_budget = restaurant.get('priceLevel')
    if user_budget and restaurant_budget:
        budget_match = calculate_budget_match(user_budget, restaurant_budget)
        total_score += budget_match * BUDGET_WEIGHT
        max_score += BUDGET_WEIGHT
    else:
        print_warning("No preferred types found in user query.")

    # Dietary restrictions
    total_score, max_score = handle_dietary_restrictions(user_query, restaurant, total_score, max_score)

    # Accessibility
    total_score, max_score = handle_accessibility(user_query, restaurant, total_score, max_score)

    # Review Scores
    total_score, max_score = handle_review_scores(restaurant, review_weights, total_score, max_score)

    # Normalize the score
    normalized_score = (total_score / max_score) * 100 if max_score > 0 else 0
    print(f"Raw Total Score: {total_score}")
    print(f"Max Possible Score: {max_score}")
    print(f"Normalized Score: {normalized_score}")

    # Ensure score is not NaN and capped at 100
    if np.isnan(normalized_score):
        print_error("Normalized score is NaN, returning score as 0.")
        return 0
    return min(normalized_score, 100)

def handle_dietary_restrictions(user_query, restaurant, total_score, max_score):
    dietary = user_query.get('dietary', {})
    if dietary.get('vegan'):
        max_score += DIETARY_WEIGHT
        if restaurant.get('isVeganFriendly', False):
            total_score += DIETARY_WEIGHT

    if dietary.get('gluten_free'):
        max_score += DIETARY_WEIGHT
        if restaurant.get('isGlutenFree', False):
            total_score += DIETARY_WEIGHT

    return total_score, max_score

def handle_accessibility(user_query, restaurant, total_score, max_score):
    accessibility_query = user_query.get('accessibility', {})
    if accessibility_query.get('wheelchair_accessible'):
        max_score += ACCESSIBILITY_WEIGHT
        if restaurant.get('isWheelchairAccessible', False):
            total_score += ACCESSIBILITY_WEIGHT
    return total_score, max_score

def handle_review_scores(restaurant, review_weights, total_score, max_score):
    max_score += FIXED_MAX_REVIEW_WEIGHT
    user_reviews_provided = any([review_weights.get(criterion, 0) > 0 for criterion in ['food', 'cleanliness', 'service', 'atmosphere']])

    if user_reviews_provided:
        max_review_score = sum([review_weights.get(criterion, 0) * 5 for criterion in ['food', 'cleanliness', 'service', 'atmosphere']])
        review_score = sum([review_weights.get(criterion, 0) * restaurant.get(f"{criterion}Quality", 0) for criterion in ['food', 'cleanliness', 'service', 'atmosphere']])
        normalized_review_score = (review_score / max_review_score) * FIXED_MAX_REVIEW_WEIGHT if max_review_score > 0 else 0
        total_score += min(normalized_review_score, FIXED_MAX_REVIEW_WEIGHT)

    return total_score, max_score

# Get recommendations based on user preferences and past reviews
def get_recommendations(user_query, embeddings, df, model):
    print_info("Starting to get recommendations based on user query and restaurant data")
    user_preferences = user_query['filters']
    selected_district = user_preferences['district']

    # Filter restaurants by the selected district, including "Tel Aviv District" if "Central District" is selected
    df_filtered = df[df['district'].isin([selected_district, "Tel Aviv District"])] if selected_district == "Central District" else df[df['district'] == selected_district]

    embeddings_filtered = embeddings[df_filtered.index]

    # Encode user preferences into an embedding
    preference_text = f"{user_preferences['types']} {user_preferences['budget']} {user_preferences['atmosphere']}"
    user_embedding = model.encode(preference_text)
    user_embedding = np.array(user_embedding, dtype=np.float32)  # Ensure correct type

    # Encode user's reviews into an embedding
    reviews_text = " ".join([review['comments'] for review in user_query['reviews']]) if user_query['reviews'] else ""
    user_reviews_embedding = model.encode(reviews_text) if reviews_text else np.zeros(
        model.get_sentence_embedding_dimension(), dtype=np.float32)

    # Calculate review weights based on the user's review scores
    review_weights = calculate_user_preferences_from_reviews(user_query['reviews'])

    # Initialize FAISS index and search for similar restaurants
    index = faiss.IndexFlatL2(embeddings_filtered.shape[1])
    embeddings_filtered = np.array(embeddings_filtered, dtype=np.float32)
    index.add(embeddings_filtered)

    # Define the number of restaurants to return (using the constant MAX_RESTAURANT_SUGGESTIONS)
    k = min(MAX_RESTAURANT_SUGGESTIONS, len(embeddings_filtered))
    distances, indices = index.search(np.array([user_embedding]), k=k)

    results = []
    for i in range(len(indices[0])):
        idx = indices[0][i]
        restaurant = df_filtered.iloc[idx]

        # Calculate matching score, taking review weights into account
        score = calculate_matching_score(restaurant, user_preferences, embeddings_filtered[idx], user_reviews_embedding, review_weights )

        # Convert the restaurant record (pandas Series) to dictionary and add the score
        restaurant_json = restaurant.to_dict()

        # Convert ObjectId to string if it exists
        if isinstance(restaurant_json.get('_id'), ObjectId):
            restaurant_json['_id'] = str(restaurant_json['_id'])

        print_success(f"Score for restaurant {restaurant['_id']}: {score}")
        restaurant_json['score'] = round(score, 2)

        # Append the modified restaurant data to results
        results.append(restaurant_json)

    print_info(f"Returning top {MAX_RESTAURANT_SUGGESTIONS} recommendations")
    return results

# Load a pre-trained model for text generation, such as GPT-2 or a similar model
def load_generation_model(model_name="gpt2"):
    return pipeline("text-generation", model=model_name)

# Generate explanations for the top restaurants
def explain_top_restaurant_matches(user_embedding, top_restaurants_embeddings, df_top_restaurants, model, top_k=5):
    # Load the generation model
    text_generator = load_generation_model()

    explanations = []

    # For each top restaurant, generate an explanation
    for i, restaurant_embedding in enumerate(top_restaurants_embeddings[:top_k]):
        restaurant = df_top_restaurants.iloc[i]

        # Calculate similarity between the user and the restaurant embeddings
        similarity = np.dot(user_embedding, restaurant_embedding) / (
                    np.linalg.norm(user_embedding) * np.linalg.norm(restaurant_embedding))

        # Prepare the context (user preferences and restaurant features)
        context = f"User preferences: {user_embedding.tolist()} \n" \
                  f"Restaurant: {restaurant['name']} with attributes: {restaurant.to_dict()} \n" \
                  f"Similarity score: {similarity:.2f}"

        # Generate an explanation based on the context
        explanation = text_generator(context, max_length=100, num_return_sequences=1)[0]['generated_text']

        explanations.append({
            "restaurant_id": str(restaurant['_id']),
            "restaurant_name": restaurant['name'],
            "explanation": explanation,
            "similarity_score": round(similarity, 2)
        })

    return explanations


@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        print_info("Received a request to /recommend endpoint")

        data = request.get_json()
        user_query = json.loads(data['user_query_json'])
        print_info(f"Parsed user query: {user_query}")

        # Load or generate embeddings
        restaurant_collection = db['vw_restauranta_no_null']  # Accessing the view
        restaurant_data = list(restaurant_collection.find({}))  # Fetch all restaurants
        df = preprocess_data(restaurant_data)

        # Generate or retrieve embeddings
        embeddings, model = get_or_generate_embeddings(df)

        recommendations = get_recommendations(user_query, embeddings, df, model)
        recommendations_sorted = sorted(recommendations, key=lambda x: x['score'], reverse=True)
        print_success("Recommendations generated and sorted by score")

        # Format recommendations for logging (top 10)
        formatted_recommendations = "\n".join(
            f"{i + 1}. {rec['name']} - Score: {rec['score']}" for i, rec in enumerate(recommendations_sorted[:10]))
        print("Generated recommendations:\n")
        print_info("Generated top 10 recommendations:\n" + formatted_recommendations)


        # # Get the embeddings of the top restaurants
        # df['_id'] = df['_id'].astype(str)
        # top_restaurants_embeddings = []
        # for rec in recommendations[:10]:  # Top 10
        #     try:
        #         restaurant_id = str(rec['_id'])
        #         index = df[df['_id'] == restaurant_id].index
        #         if len(index) == 0:
        #             print(f"Warning: Restaurant ID {restaurant_id} not found in DataFrame.")
        #             continue
        #         top_restaurants_embeddings.append(embeddings[index[0]])
        #     except Exception as e:
        #         print(f"Error retrieving embedding for restaurant ID {rec['_id']}: {e}")
        #
        # # Generate explanations for the top 5 matches
        # user_embedding = model.encode(f"{user_query['filters']['types']} {user_query['filters']['budget']} {user_query['filters']['atmosphere']}")
        # explanations = explain_top_restaurant_matches(user_embedding, top_restaurants_embeddings, df[df['_id'].isin([rec['_id'] for rec in recommendations[:5]])], model)

        # Print explanations to console
        # for explanation in explanations:
        #     print(f"Restaurant: {explanation['restaurant_name']}")
        #     print(f"Explanation: {explanation['explanation']}")
        #     print(f"Similarity Score: {explanation['similarity_score']}\n")

        print_success("Recommendations generated successfully")
        return jsonify(recommendations)

    except Exception as e:
        print_error(f"Error occurred in /recommend: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    try:
        port = 5000
        print(f"Starting server... Listening on http://127.0.0.1:{port}")
        app.run(port=port)
    except KeyboardInterrupt:
        print_warning("Server shutdown initiated")
    finally:
        print_error("Flask server terminated")
