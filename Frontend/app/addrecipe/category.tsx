import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
const CATEGORIES = [
  { id: "1", label: "Main Course",   emoji: "🍛",  color: "#FFF3E0", border: "#F4A261" },
  { id: "2", label: "Appetizer",     emoji: "🥗",  color: "#E8F5E9", border: "#52B788" },
  { id: "3", label: "Dessert",       emoji: "🍰",  color: "#FCE4EC", border: "#E07A9F" },
  { id: "4", label: "Beverage",      emoji: "🧋",  color: "#E3F2FD", border: "#5BA4CF" },
  { id: "5", label: "Snack",         emoji: "🍿",  color: "#FFF8E1", border: "#E9C46A" },
  { id: "6", label: "Breakfast",     emoji: "🥞",  color: "#F3E5F5", border: "#A78BFA" },
  { id: "7", label: "Soup",          emoji: "🍜",  color: "#FBE9E7", border: "#E07A5F" },
  { id: "8", label: "Side Dish",     emoji: "🥙",  color: "#E0F7FA", border: "#4DB6AC" },
  { id: "9", label: "Healthy",       emoji: "🥦",  color: "#F1F8E9", border: "#8BC34A" },
  { id: "10", label: "Healthy",      emoji: "🥦",  color: "#F1F8E9", border: "#8BC34A" },
  { id: "11", label: "Healthy",      emoji: "🥦",  color: "#F1F8E9", border: "#8BC34A" },
  { id: "12", label: "Healthy",      emoji: "🥦",  color: "#F1F8E9", border: "#8BC34A" },
  { id: "13", label: "Healthy",      emoji: "🥦",  color: "#F1F8E9", border: "#8BC34A" },
  { id: "14", label: "Healthy",      emoji: "🥦",  color: "#F1F8E9", border: "#8BC34A" },
  { id: "15", label: "Healthy",      emoji: "🥦",  color: "#F1F8E9", border: "#8BC34A" },
];

export default function Category() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (!selected) return;
    router.push("/addrecipe/ingredients");
    console.log("Selected:", selected);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FDFAF6]" edges={["bottom"]}>
      <View className="flex-1 justify-between pb-12">
        <View className="flex-1">

          {/* Category Grid */}
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row flex-wrap justify-between">
              {CATEGORIES.map((cat) => {
                const isSelected = selected === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.75}
                    onPress={() => setSelected(cat.id)}
                    style={{
                      width: "31%",
                      marginBottom: 12,
                      borderRadius: 20,
                      backgroundColor: isSelected ? cat.color : "#FFFFFF",
                      borderWidth: isSelected ? 2.5 : 1.5,
                      borderColor: isSelected ? cat.border : "#E8E8E8",
                      alignItems: "center",
                      paddingVertical: 18,
                      shadowColor: isSelected ? cat.border : "#000",
                      shadowOffset: { width: 0, height: isSelected ? 4 : 1 },
                      shadowOpacity: isSelected ? 0.2 : 0.04,
                      shadowRadius: isSelected ? 8 : 3,
                      elevation: isSelected ? 6 : 1,
                      transform: [{ scale: isSelected ? 1.04 : 1 }],
                    }}
                  >
                    {/* Emoji bubble */}
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: isSelected ? "#FFFFFF" : cat.color,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ fontSize: 28 }}>{cat.emoji}</Text>
                    </View>

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: isSelected ? "700" : "500",
                        color: isSelected ? cat.border : "#444",
                        textAlign: "center",
                        lineHeight: 16,
                      }}
                    >
                      {cat.label}
                    </Text>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <View
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          backgroundColor: cat.border,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "800" }}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity
          className="py-4 px-10 self-center rounded-full bg-primary-500"
          onPress={handleNext}
        >
          <Text className="text-center font-brsegma-600 text-secondary-400">
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
