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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.35;

/* ─── types ─────────────────────────────────────────────── */
interface GeneratePlanSheetProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (prefs: PlanPreferences) => void;
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
}: GeneratePlanSheetProps) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [days, setDays] = useState(7);
  const [diet, setDiet] = useState<string[]>(["Balanced"]);
  const [calories, setCalories] = useState("1800");

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

  const handleGenerate = () => {
    onGenerate({ days });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end"
      >
        {/* backdrop */}
        <Animated.View
          className="absolute inset-0 bg-black/45"
          style={{ opacity: fadeAnim }}
          onTouchEnd={onClose}
        />

        {/* sheet */}
        <Animated.View
          className="rounded-t-3xl bg-[#FAF7F0] px-5 pt-8 pb-2"
          style={{ height: SHEET_HEIGHT, transform: [{ translateY: slideAnim }] }}
        >

          {/* header */}
          <View className="mb-5 flex-row items-start justify-between">
            <View>
              <Text className="text-[20px] font-fogsta tracking-[-0.4px] text-[#1A0A08]">Generate Meal Plan</Text>
              <Text className="mt-0.5 text-[13px] text-[#9A7B6A] font-brsegma-500">
                Personalise your plan below
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="h-8 w-8 items-center justify-center rounded-full bg-[#F0E8DD]">
              <Ionicons name="close" size={20} color="#660B05" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* ── duration ──────────────────────────────── */}
            <Text className="mb-1 mt-1 text-[13px] font-brsegma-600 uppercase tracking-[0.6px] text-[#1A0A08]">Plan Duration</Text>
            <View className="mb-5 mt-2 flex-row gap-2.5">
              {DAY_OPTIONS.map((d) => (
                <TouchableOpacity
                  key={d}
                  className={`flex-1 items-center rounded-2xl border-[1.5px] py-3 ${days === d ? "border-primary-500 bg-primary-500" : "border-transparent bg-[#F0E8DD]"}`}
                  onPress={() => setDays(d)}
                >
                  <Text className={`text-[18px] font-bold ${days === d ? "text-secondary-300" : "text-primary-500"}`}>
                    {d}
                  </Text>
                  <Text className={`mt-0.5 text-[10px] ${days === d ? "text-[#F5C9A0]" : "text-[#9A7B6A]"}`}>
                    days
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* CTA */}
          <View className="gap-2.5 border-t border-[#EDE3D4] py-3.5">
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="sparkles"
                size={14}
                color="#660B05"
                style={{ marginRight: 4 }}
              />
              <Text className="shrink text-center text-[11px] text-[#9A7B6A]">
                {days}-day {diet.join(" · ")} · {calories} kcal/day
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-2xl bg-primary-500 py-4"
              onPress={handleGenerate}
              activeOpacity={0.85}
            >
              <Ionicons
                name="sparkles"
                size={18}
                color="#FFF0C4"
                style={{ marginRight: 8 }}
              />
              <Text className="text-base font-bold tracking-[0.3px] text-secondary-300">Generate Plan</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
