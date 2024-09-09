# Dishcover

Dishcover is a personalized restaurant recommendation app that helps users find the perfect dining spots based on their preferences, past experiences, and current mood. The app leverages AI and machine learning to continuously refine recommendations, making dining out easier and more enjoyable.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [External Dependencies](#external-dependencies)
- [Acknowledgments](#acknowledgments)
- [Poster](#project-poster)
- [Demo](#demo)
- [Screenshots](#screenshots)
  
## Features

- **Personalized Recommendations:** The app provides a personalized feed of restaurant recommendations tailored to the user's preferences and history.
- **Wishlist Management:** Users can add desired restaurants to a wishlist and manage their dining spots from their profile.
- **Review and Feedback:** After visiting a recommended restaurant, users can leave reviews and ratings to refine future suggestions.
- **AI-Powered Suggestions:** AI delivers restaurant suggestions with a matching percentage that aligns with the user's tastes and preferences.
  

## Installation

### Backend Setup (Node.js)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/dishcover.git
   ```

2. **Navigate to the backend directory:**
   ```bash
   cd dishcover/Backend
   ```

3. **Install backend dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `backend` directory and add the required environment variables (e.g., database URL, API keys).

5. **Run the backend server:**
   ```bash
   npm start
   ```

   The backend will typically run on `http://localhost:3000` or a port specified in your environment variables.

### Frontend Setup (React Native)

1. **Navigate to the frontend directory:**
   ```bash
   cd ../Frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend` directory and configure it with the backend server URL and other necessary variables.

4. **Run the frontend application:**
   ```bash
   npm start
   ```

5. **Access the app:**
   Open the app on your mobile device using Expo Go or a simulator/emulator.

### Python Server Setup (AI-Powered Recommendations)

1. **Navigate to the Python server directory:**
   ```bash
   cd ../PythonServer
   ```

2. **Ensure `virtualenv` is installed (if not already):**
   ```bash
   pip install virtualenv
   ```

3. **Create a virtual environment using `venv`:**
   ```bash
   python -m venv venv
   ```

4. **Activate the virtual environment:**

   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

5. **Install Python dependencies from `requirements.txt`:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Set up environment variables:**
   Create a `.env` file in the `PythonServer` directory and add the necessary variables such as OpenAI API keys and any other required credentials.

7. **Run the Python server:**
   ```bash
   python app.py
   ```

   This Python server will typically run on a separate port (e.g., `http://localhost:5000`).

### Full Setup

1. **Start the backend** (`http://localhost:3000`):
   ```bash
   cd Backend
   npm start
   ```

2. **Start the frontend application** (`Expo Go` or your simulator):
   ```bash
   cd ../Frontend
   npm start
   ```

3. **Start the Python server for AI-powered recommendations**:
   ```bash
   cd ../PythonServer
   source venv/bin/activate   # Activate the virtual environment
   python app.py
   ```

Once everything is running, the backend will serve data, the frontend will provide the interface, and the Python server will handle AI-powered recommendations.

## Usage

- **Sign Up:** Create an account by providing basic information and setting up your preferences.
- **Explore Recommendations:** Browse through a personalized feed of restaurant recommendations based on your initial input and ongoing interactions.
- **Add to Wishlist:** Save restaurants you'd like to visit to your wishlist for easy access later.
- **Review Restaurants:** After dining, leave a review to help improve future recommendations.
- **Get Tailored Suggestions:** Utilize AI-driven suggestions for the best restaurant matches based on your mood and past dining experiences.

## External Dependencies

- **Apify API:** The app uses data from the Apify API, which aggregates information from sources like Travel Advisor. This data is essential for generating accurate restaurant recommendations.
- **AI and Machine Learning Services:** The app leverages external AI services for analyzing user preferences and refining recommendations over time.

## Acknowledgments

- **Mentor:** Dr. Sarel Cohen for guiding us through the development process.
- **Team:** Inbar Cohen, Amit Furman, Eden Ismah Moshe.
- **External Tools:** Apify, Travel Advisor, and various AI/ML services that powered the app's functionality.

## Project Poster

![Dishcover Poster](./assets/dishcover_poster.png)

## Demo
Check out a live demo of the Dishcover app:

[Live Demo](./assets/demo.mp4)

## Screenshots

Here are some screenshots of the Dishcover app in action:
!(./assets/screenshots/dishcover.png)

### Sign In
![Sign In Screen](./assets/screenshots/signin_screen.png)

### Login
![Login Screen](./assets/screenshots/login_screen.jpg)

### Home Screen
![Home Screen](./assets/screenshots/home_screen.png)

### Wishlist
![Wishlist Screen](./assets/screenshots/wishlist_screen.png)

### Review and Rating
![Review Screen](./assets/screenshots/review_screen.png)

### Restaurant Recommendation
![Recommendation Screen](./assets/screenshots/recommendation_screen1.png)
![Recommendation Screen](./assets/screenshots/recommendation_screen2.png)

### Swipe to Browse Restaurants
![Swipe Screen](./assets/screenshots/swipe_screen1.png)
![Swipe Screen](./assets/screenshots/swipe_screen2.png)

