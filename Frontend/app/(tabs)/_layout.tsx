import { View,Text, ImageBackground, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Tabs } from "expo-router";
import MyTabBar from "../components/tabbar";
import { AuthContext } from "../store/authContext";
import ProfileDataProvider from "../store/profileDataContext";
import TenRecipeProvider from "../store/tenRecipeContext";


const _Layout = () => {
    
    return (
        <TenRecipeProvider>
        <ProfileDataProvider>
            <Tabs>
                <Tabs.Screen 
                    name="home"
                    options={{ title: "Home",
                        headerShown:false,
                    }} 
                />
                <Tabs.Screen 
                    name="search"
                    options={{ title: "Search",
                        headerShown:false, 
                    }} 
                />
                <Tabs.Screen 
                    name="mealplan"
                    options={{ title: "Saved",
                        headerShown:false,
                    }} 
                />
                <Tabs.Screen 
                    name="profile"
                    options={{ title: "Profile",
                        headerShown:false,
                    }} 
                />
            </Tabs>
        </ProfileDataProvider>
        </TenRecipeProvider>
    );
}

export default _Layout;
