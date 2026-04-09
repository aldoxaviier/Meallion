import { View,Text, ImageBackground, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import SocialHeader from "../components/SocialHeader";

const _Layout = () => {
    
    return (
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#660B05',
        }}
        >
            <Tabs.Screen 
                name="home"
                options={{ title: "Home",
                    headerShown:false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Octicons
                        name={focused ? 'home-fill' : 'home'}
                        size={size}
                        color={color}
                        />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="social"
                options={{ title: "Socials",
                    headerShown:false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                        name={focused ? 'people' : 'people-outline'}
                        size={size}
                        color={color}
                        />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="mealplan"
                options={{ title: "Plan",
                    headerShown:false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                        name={focused ? 'calendar' : 'calendar-outline'}
                        size={size}
                        color={color}
                        />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="profile"
                options={{ title: "Profile",
                    headerShown:false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                        name={focused ? 'person' : 'person-outline'}
                        size={size}
                        color={color}
                        />
                    ),
                }} 
            />
        </Tabs>
    );
}

export default _Layout;
