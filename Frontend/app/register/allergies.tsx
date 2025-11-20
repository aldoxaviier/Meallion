import { View, Text, TouchableOpacity, TextInput,TouchableWithoutFeedback,Keyboard } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import  FontAwesome5  from "@expo/vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "../utils/api";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Allergies = () => {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  // snap points like iOS modal style
  const snapPoints = useMemo(() => ["70%"], []);

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
      opacity={0.6}
    />
  ), []);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
    if (searchTerm.length >= 2) {
    const data = await api.get(`/recipes/getIngredients?query=${searchTerm}`);
    console.log(data.data);
    setResults(data.data.data);
    } else {
      setResults([]);
    }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const toggleSelect = (item: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const commonDislikes = [
    "Black olives",
    "Pitted green olives",
    "Kalamata olives",
    "Fresh coriander",
  ];

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-secondary-200 flex-1" >
        <View className="h-full w-full flex flex-col gap-4 px-6 py-6">
          <TouchableOpacity
            className="self-start pr-2 py-2 rounded-lg"
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>

          {/* progress bar */}
          <View className="flex flex-row gap-1 mb-4">
            <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
            <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
            <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
            <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
          </View>

          <View className="flex flex-col justify-between flex-1">
            <View className="flex flex-col gap-2">
              <Text className="text-4xl font-fogsta text-primary-500 text-center">
                Any dislikes or allergies?
              </Text>
              <Text className="text-center font-brsegma-500">
                We’re excited to have you here. Before we get started...
              </Text>
            </View>

            <TouchableOpacity
              className="border border-primary-400 rounded-full py-6 px-4 flex-row items-center justify-center gap-2"
              onPress={openBottomSheet}
            >
              <Feather name="search" size={28} color="black" className="absolute left-4" />
              <Text className="font-brsegma-600">Add ingredients</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-4 px-10 self-center rounded-full bg-primary-500"
              onPress={() => router.push("/register/personal")}
            >
              <Text className="text-center font-brsegma-600 text-secondary-400">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* BOTTOM SHEET */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="px-6 h-[80%] pb-8">
          {/* Header */}
          <View className="flex-row justify-center items-center mb-4">
            <Text className="text-lg font-fogsta">Add Ingredients</Text>
            <TouchableOpacity onPress={closeBottomSheet} className="absolute right-0">
              <Feather name="x" size={26} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="bg-gray-200 rounded-full px-4 py-1 flex-row items-center gap-2 mb-4">
            <Feather name="search" size={20} />
            <TextInput
              placeholder="Search for an ingredient"
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 font-brsegma-500"
            />
          </View>

          {/* Common Dislikes */}
          <View className="flex h-full flex-col justify-between ">
          <Text className="text-sm font-brsegma-600 mb-2">Common dislikes</Text>

          <View className="flex-row flex-wrap gap-2">
            {/* If there are search results show them first */}
            {results && results.length > 0 && results.map((item: any, idx: number) => {
              const selected = selectedIngredients.includes(item);
              return (
                <TouchableOpacity
                  key={`res-${idx}`}
                  onPress={() => toggleSelect(item)}
                  className={`rounded-full px-3 py-2 flex-row items-center gap-2 border border-primary-400 ${selected ? 'bg-primary-500' : ''}`}
                >
                  <View className="w-5 items-center justify-center">
                    <Text className={`text-${selected ? 'secondary-400' : 'primary-400'}`}><FontAwesome5 name={selected ? 'times' : 'plus'} size={16} /></Text>
                  </View>
                  <Text className={`${selected ? 'text-secondary-400' : 'text-primary-400'}`}>{item.Name}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Common dislikes */}
            {commonDislikes.map((item, index) => {
              const selected = selectedIngredients.includes(item);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleSelect(item)}
                  className={`rounded-full px-3 py-2 flex-row items-center gap-2 border border-primary-400 ${selected ? 'bg-primary-500' : ''}`}
                >
                  <View className="w-5 items-center justify-center">
                    <Text className={`text-${selected ? 'secondary-400' : 'primary-400'}`}><FontAwesome5 name={selected ? 'times' : 'plus'} size={16} /></Text>
                  </View>
                  <Text className={`${selected ? 'text-secondary-400' : 'text-primary-400'}`}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Done Button */}
          <TouchableOpacity
            className="mt-auto bg-primary-400 rounded-full py-4"
            onPress={closeBottomSheet}
          >
            <Text className="text-center text-white font-brsegma-600">Done</Text>
          </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
};

export default Allergies;
