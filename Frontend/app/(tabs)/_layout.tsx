import { View,Text, ImageBackground, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Tabs } from "expo-router";
import MyTabBar from "../components/tabbar";
import api from '../utils/api';
import { AuthContext } from "../store/authContext";
import ProfileDataProvider from "../store/profileDataContext";


const _Layout = () => {
    
    return (
        <ProfileDataProvider>
            <Tabs>
                <Tabs.Screen 
                    name="index"
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
                    name="saved"
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
        
    );
}

export default _Layout;
