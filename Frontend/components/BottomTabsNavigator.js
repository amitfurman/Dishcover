import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WishlistScreen from "../screens/WishlistScreen";
import { COLORS } from "../constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MainScreen from "../screens/MainScreen";

const Tab = createBottomTabNavigator();

function BottomTabsNavigator({ route }) {
  const { userId, userName } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarLabelStyle: { color: COLORS.blue, fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={MainScreen}
        initialParams={{ userId, userName }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant" color={color} size={size} />
          ),
          tabBarActiveTintColor: COLORS.pink,
          tabBarInactiveTintColor: "gray",
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        initialParams={{ userId, userName }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" color={color} size={size} />
          ),
          tabBarActiveTintColor: COLORS.pink,
          tabBarInactiveTintColor: "gray",
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabsNavigator;
