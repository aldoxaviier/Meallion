import { useState,useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons, Octicons } from "@expo/vector-icons";
import GeneratePlanSheet, { PlanPreferences } from "../generatemealplan/components/generateplansheet";
import { api } from "../utils/api";
import { ProfileDataContext } from "../store/profileDataContext";
const Layout = () => {
  const [sheetVisible, setSheetVisible] = useState(false);
  const profileData = useContext(ProfileDataContext);
  const handleGenerate = async (prefs: PlanPreferences) => {
    try {
      const body ={
        allergies: profileData?.profileData?.allergies ,
        diet_preferences: profileData?.profileData?.diet_preferences ,
        target_calories: profileData?.profileData?.target_calories ,
        target_proteins: profileData?.profileData?.target_proteins ,
        target_carbs: profileData?.profileData?.target_carbs ,
        target_fats: profileData?.profileData?.target_fats,
        days: prefs.days,
      }
      const response = await api.post("/recipes/mealplan-generate", { body });
    } catch (error) {
      console.error("Error generating meal plan:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#660B05",
          tabBarStyle: {
            height: 80,
            paddingHorizontal: 10,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Octicons name={focused ? "home-fill" : "home"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="social"
          options={{
            title: "Socials",
            headerShown: false,
            tabBarItemStyle: { marginRight: 30 },
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "people" : "people-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="mealplan"
          options={{
            title: "Plan",
            headerShown: false,
            tabBarItemStyle: { marginLeft: 30 },
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "calendar" : "calendar-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* FAB */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 22,
          alignSelf: "center",
          backgroundColor: "#660B05",
          width: 50,
          height: 50,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          elevation: 4,
          shadowColor: "#660B05",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
        onPress={() => setSheetVisible(true)}
      >
        <Ionicons name="sparkles" size={28} color="#FFF0C4" />
      </TouchableOpacity>

      {/* Sheet */}
      <GeneratePlanSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onGenerate={handleGenerate}
      />
    </View>
  );
};

export default Layout;