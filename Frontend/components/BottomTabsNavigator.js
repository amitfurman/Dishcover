
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RestaurantPreferenceScreen from "../screens/RestaurantPreferenceScreen";
import WishlistScreen from "../screens/WishlistScreen";
import { COLORS } from "../colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

function BottomTabsNavigator() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: "#fff" },
          tabBarLabelStyle: { color: COLORS.blue, fontSize: 12 },
        }}
      >
        <Tab.Screen
          name="Preferences"
          component={RestaurantPreferenceScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="restaurant" color={color} size={size} />
            ),
            tabBarActiveTintColor: COLORS.pink, 
            tabBarInactiveTintColor: 'gray',
          }}
        />
        <Tab.Screen
          name="Wishlist"
          component={WishlistScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="favorite" color={color} size={size} />
            ),
            tabBarActiveTintColor: COLORS.pink, 
            tabBarInactiveTintColor: 'gray',
          }}
        />
      </Tab.Navigator>
    );
  }
export default BottomTabsNavigator;
