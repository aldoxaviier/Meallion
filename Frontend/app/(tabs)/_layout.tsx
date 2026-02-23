import { View,Text, ImageBackground, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { AuthContext } from "../store/authContext";
import ProfileDataProvider from "../store/profileDataContext";
import TenRecipeProvider from "../store/tenRecipeContext";
import { Ionicons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";


const _Layout = () => {
    
    return (
        <TenRecipeProvider>
        <ProfileDataProvider>
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
                    name="search"
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
        </ProfileDataProvider>
        </TenRecipeProvider>
    );
}

export default _Layout;
