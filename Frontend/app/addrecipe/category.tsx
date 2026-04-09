import { useContext, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RecipeContext } from "../store/addRecipeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CATEGORIES = [
  { id: 2,   name: "Indonesian",      emoji: "🇮🇩", color: "#FFF3E0", border: "#E65100" },
  { id: 10,  name: "Dutch",           emoji: "🧇",  color: "#FFF8E1", border: "#F9A825" },
  { id: 14,  name: "Dessert",         emoji: "🍰",  color: "#FCE4EC", border: "#C2185B" },
  { id: 16,  name: "Low Protein",     emoji: "🥗",  color: "#E8F5E9", border: "#2E7D32" },
  { id: 22,  name: "Mexican",         emoji: "🌮",  color: "#FFF3E0", border: "#BF360C" },
  { id: 38,  name: "Frozen Desserts", emoji: "🍦",  color: "#E3F2FD", border: "#1565C0" },
  { id: 39,  name: "Asian",           emoji: "🥢",  color: "#FBE9E7", border: "#D84315" },
  { id: 40,  name: "Russian",         emoji: "🥟",  color: "#F3E5F5", border: "#6A1B9A" },
  { id: 44,  name: "European",        emoji: "🥐",  color: "#FFFDE7", border: "#F57F17" },
  { id: 51,  name: "Turkish",         emoji: "🫕",  color: "#FCE4EC", border: "#880E4F" },
  { id: 52,  name: "South American",  emoji: "🥩",  color: "#FFF8E1", border: "#E65100" },
  { id: 58,  name: "Beginner Cook",   emoji: "👨‍🍳", color: "#E8F5E9", border: "#1B5E20" },
  { id: 59,  name: "Low Cholesterol", emoji: "💚",  color: "#F1F8E9", border: "#558B2F" },
  { id: 74,  name: "Indian",          emoji: "🍛",  color: "#FFF3E0", border: "#E65100" },
  { id: 76,  name: "Spanish",         emoji: "🥘",  color: "#FBE9E7", border: "#B71C1C" },
  { id: 84,  name: "High Protein",    emoji: "💪",  color: "#FBE9E7", border: "#C62828" },
  { id: 87,  name: "Korean",          emoji: "🍜",  color: "#FCE4EC", border: "#AD1457" },
  { id: 90,  name: "German",          emoji: "🥨",  color: "#FFF8E1", border: "#F57F17" },
  { id: 95,  name: "Portuguese",      emoji: "🐟",  color: "#E3F2FD", border: "#0D47A1" },
  { id: 99,  name: "Easy",            emoji: "⚡",  color: "#F9FBE7", border: "#827717" },
  { id: 101, name: "Lactose Free",    emoji: "🥛",  color: "#E3F2FD", border: "#1565C0" },
  { id: 106, name: "Vegan",           emoji: "🌱",  color: "#E8F5E9", border: "#1B5E20" },
  { id: 108, name: "Greek",           emoji: "🫒",  color: "#E8F5E9", border: "#2E7D32" },
  { id: 122, name: "Brazilian",       emoji: "🍖",  color: "#FBE9E7", border: "#BF360C" },
  { id: 136, name: "Meat",            emoji: "🥩",  color: "#FFEBEE", border: "#B71C1C" },
  { id: 140, name: "Beverages",       emoji: "🧃",  color: "#E3F2FD", border: "#1976D2" },
  { id: 142, name: "Fruit",           emoji: "🍓",  color: "#FCE4EC", border: "#E91E63" },
  { id: 144, name: "Kid Friendly",    emoji: "🧒",  color: "#FFFDE7", border: "#FBC02D" },
  { id: 149, name: "Spicy",           emoji: "🌶️", color: "#FFEBEE", border: "#D50000" },
  { id: 150, name: "Broil/Grill",     emoji: "🔥",  color: "#FBE9E7", border: "#BF360C" },
  { id: 151, name: "Breads",          emoji: "🍞",  color: "#FFF8E1", border: "#FF8F00" },
  { id: 154, name: "Japanese",        emoji: "🍣",  color: "#FCE4EC", border: "#880E4F" },
  { id: 158, name: "African",         emoji: "🌍",  color: "#FFF3E0", border: "#E65100" },
  { id: 160, name: "High Fiber",      emoji: "🌾",  color: "#F1F8E9", border: "#33691E" },
  { id: 165, name: "Chinese",         emoji: "🥡",  color: "#FBE9E7", border: "#B71C1C" },
  { id: 168, name: "Roast",           emoji: "🍗",  color: "#FFF3E0", border: "#BF360C" },
];

const PAGE_SIZE = 15;
const PAGES = [
  CATEGORIES.slice(0, PAGE_SIZE),
  CATEGORIES.slice(PAGE_SIZE, PAGE_SIZE * 2),
];

export default function Category() {
  const recipeContext = useContext(RecipeContext);
  const [selected, setSelected] = useState<Set<number>>(() => {
    const selectedNames = new Set(recipeContext?.recipeData?.tags ?? []);
    return new Set(
      CATEGORIES.filter((cat) => selectedNames.has(cat.name)).map((cat) => cat.id)
    );
  });
  const [activePage, setActivePage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const goToNextPage = () => {
    if (activePage < PAGES.length - 1) {
      const next = activePage + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActivePage(next);
    }
  };

  const handleNext = () => {
    if (selected.size === 0) return;
    const selectedTags = CATEGORIES.filter((cat) => selected.has(cat.id)).map(
      (cat) => cat.name
    );
    recipeContext?.setRecipeData((prev) => ({
      ...prev,
      tags: selectedTags,
    }));
    router.push("/addrecipe/ingredients");
  };

  const renderPage = ({ item: pageCategories }: { item: typeof CATEGORIES }) => (
    <View style={{ width: SCREEN_WIDTH, paddingHorizontal: 16, paddingTop: 16 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        {pageCategories.map((cat) => {
          const isSelected = selected.has(cat.id);
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.75}
              onPress={() => toggle(cat.id)}
              style={{
                width: "31%",
                marginBottom: 12,
                borderRadius: 20,
                backgroundColor: isSelected ? cat.color : "#FFFFFF",
                borderWidth: 2.5,
                borderColor: isSelected ? cat.border : "#E8E8E8",
                alignItems: "center",
                paddingVertical: 18,
                elevation: isSelected ? 6 : 1,
              }}
            >
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
                numberOfLines={2}
              >
                {cat.name}
              </Text>

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
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FDFAF6]" edges={["bottom"]}>
      <View style={{ flex: 1 }}>

        {/* Paged FlatList + Chevron side by side */}
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Animated.FlatList
            ref={flatListRef}
            data={PAGES}
            renderItem={renderPage}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActivePage(page);
            }}
            style={{ flex: 1 }}
          />
        </View>

        {/* Dot indicators */}
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 12, gap: 8 }}>
          {PAGES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                flatListRef.current?.scrollToIndex({ index: i, animated: true });
                setActivePage(i);
              }}
            >
              <Animated.View
                style={{
                  width: scrollX.interpolate({
                    inputRange: [
                      (i - 1) * SCREEN_WIDTH,
                      i * SCREEN_WIDTH,
                      (i + 1) * SCREEN_WIDTH,
                    ],
                    outputRange: [8, 20, 8],
                    extrapolate: "clamp",
                  }),
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: scrollX.interpolate({
                    inputRange: [
                      (i - 1) * SCREEN_WIDTH,
                      i * SCREEN_WIDTH,
                      (i + 1) * SCREEN_WIDTH,
                    ],
                    outputRange: ["#D0D0D0", "#E65100", "#D0D0D0"],
                    extrapolate: "clamp",
                  }),
                }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Next button */}
        <TouchableOpacity
          className="py-4 px-10 self-center rounded-full bg-primary-500"
          style={{ marginBottom: 12 }}
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