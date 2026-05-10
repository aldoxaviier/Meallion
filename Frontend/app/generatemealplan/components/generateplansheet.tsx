import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.35;

/* ─── types ─────────────────────────────────────────────── */
interface GeneratePlanSheetProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (prefs: PlanPreferences) => Promise<void> | void;
  isLoading?: boolean;
}

export interface PlanPreferences {
  days: number;
}

/* ─── data ───────────────────────────────────────────────── */
const DAY_OPTIONS = [1,3, 5, 7,];

const DIET_OPTIONS = [
  { label: "Vegan", icon: "leaf-outline" },
  { label: "Low Sugar", icon: "cube-outline" },
  { label: "Low Cholesterol", icon: "heart-outline" },
  { label: "High Protein", icon: "barbell-outline" },
  { label: "Balanced", icon: "restaurant-outline" },
  { label: "Keto", icon: "flame-outline" },
];

/* ─── component ──────────────────────────────────────────── */
export default function GeneratePlanSheet({
  visible,
  onClose,
  onGenerate,
  isLoading = false,
}: GeneratePlanSheetProps) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [days, setDays] = useState(7);
  const [diet, setDiet] = useState<string[]>(["Balanced"]);
  const [calories, setCalories] = useState("1800");

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  /* animate in/out */
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SHEET_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const toggleDiet = (label: string) => {
    setDiet((prev) =>
      prev.includes(label)
        ? prev.length === 1
          ? prev // keep at least one
          : prev.filter((d) => d !== label)
        : [...prev, label]
    );
  };

  const handleGenerate = async () => {
    await onGenerate({ days });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (!isLoading) onClose();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end"
      >
        {/* backdrop */}
        <Animated.View
          className="absolute inset-0 bg-black/45 dark:bg-black/70"
          style={{ opacity: fadeAnim }}
          onTouchEnd={() => {
            if (!isLoading) onClose();
          }}
        />

        {/* sheet */}
        <Animated.View
          className="rounded-t-3xl bg-secondary-400 dark:bg-surface-dark px-5 pt-8 pb-2 border border-transparent dark:border-surface-darker"
          style={{ height: SHEET_HEIGHT, transform: [{ translateY: slideAnim }] }}
        >

          {/* header */}
          <View className="mb-5 flex-row items-start justify-between">
            <View>
              <Text className="text-[20px] font-fogsta tracking-[-0.4px] text-primary-500 dark:text-secondary-400">Generate Meal Plan</Text>
              <Text className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400 font-brsegma-500">
                Personalise your plan below
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              className="h-8 w-8 items-center justify-center rounded-full bg-secondary-300 dark:bg-surface-darker"
            >
              <Ionicons name="close" size={20} color={isDark ? "#FFF9E7" : "#660B05"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* ── duration ──────────────────────────────── */}
            <Text className="mb-1 mt-1 text-[13px] font-brsegma-600 uppercase tracking-[0.6px] text-primary-500 dark:text-secondary-400">Plan Duration</Text>
            <View className="mb-5 mt-2 flex-row gap-2.5">
              {DAY_OPTIONS.map((d) => (
                <TouchableOpacity
                  key={d}
                  className={`flex-1 items-center rounded-2xl border-[1.5px] py-3 ${days === d ? "border-primary-500 dark:border-primary-600 bg-primary-500 dark:bg-primary-600" : "border-transparent bg-secondary-300 dark:bg-surface-darker"}`}
                  onPress={() => setDays(d)}
                >
                  <Text className={`text-[18px] font-bold ${days === d ? "text-secondary-300 dark:text-secondary-400" : "text-primary-500 dark:text-gray-400"}`}>
                    {d}
                  </Text>
                  <Text className={`mt-0.5 text-[10px] ${days === d ? "text-[#F5C9A0] dark:text-secondary-200" : "text-gray-500 dark:text-gray-500"}`}>
                    days
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* CTA */}
          <View className="gap-2.5 border-t border-gray-200 dark:border-surface-darker py-3.5">
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="sparkles"
                size={14}
                color={isDark ? "#eddca1" : "#660B05"}
                style={{ marginRight: 4 }}
              />
              <Text className="shrink text-center text-[11px] text-gray-500 dark:text-gray-400 font-brsegma-500">
                {days}-day {diet.join(" · ")} · {calories} kcal/day
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-2xl bg-primary-500 dark:bg-primary-600 py-4"
              onPress={handleGenerate}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color={isDark ? "#FFF9E7" : "#FFF0C4"} style={{ marginRight: 8 }} />
                  <Text className="text-base font-bold tracking-[0.3px] text-secondary-300 dark:text-secondary-400">Generating...</Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color={isDark ? "#FFF9E7" : "#FFF0C4"}
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-base font-bold tracking-[0.3px] text-secondary-300 dark:text-secondary-400">Generate Plan</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}