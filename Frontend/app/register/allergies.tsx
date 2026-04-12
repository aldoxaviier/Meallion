import { View, Text, TouchableOpacity, TextInput,TouchableWithoutFeedback,Keyboard } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import  FontAwesome5  from "@expo/vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {api} from "../utils/api";
import { useEffect, useMemo, useRef, useState, useCallback, useContext } from "react";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ProfileContext } from "../store/profileContext";
import { RegisterContext } from "../store/registerContext";

const Allergies = () => {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const profileContext = useContext(ProfileContext);
  const registerContext = useContext(RegisterContext);
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
        const res = await api.get(`/recipes/getIngredients?query=${searchTerm}`);
        const raw = res.data;

        const grouped = raw.reduce((acc: any, item: any) => {
          if (!acc[item.simplified_name]) {
            acc[item.simplified_name] = [];
          }
          acc[item.simplified_name].push(item.original_name);
          return acc;
        }, {});

        const simplifiedList = Object.keys(grouped).map((key) => ({
          simplified_name: key,
          originals: grouped[key],
        }));

        setResults(simplifiedList);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const toggleSelect = (group: any) => {
  if (typeof group === "string") {
    setSelectedIngredients((prev) => {
      const exists = prev.includes(group);
      return exists ? prev.filter((i) => i !== group) : [...prev, group];
    });
    return;
  }
  const { simplified_name, originals } = group;
  setSelectedIngredients((prev) => {
    const exists = prev.includes(simplified_name);

    if (exists) {
      const toRemove = new Set([simplified_name, ...originals]);
      return prev.filter((i) => !toRemove.has(i));
    } else {
      return [...prev, simplified_name, ...originals];
    }
  });
};

  const commonDislikes = [
    "Nuts",
    "Spninach",
    "Pickle",
    "Eggplant",
  ];

  const selectedSimplifiedNames = useMemo(() => {
    const sel = new Set(selectedIngredients);
    const simplifiedSet = new Set<string>();
    results.forEach((group: any) => {
      if (
        sel.has(group.simplified_name) ||
        group.originals.some((o: string) => sel.has(o))
      ) {
        simplifiedSet.add(group.simplified_name);
      }
    });
    selectedIngredients.forEach((item) => {
      const inAnyGroup = results.some((g: any) => g.simplified_name === item || g.originals.includes(item));
      if (!inAnyGroup) simplifiedSet.add(item);
    });

    return Array.from(simplifiedSet);
  }, [selectedIngredients, results]);

  const removeSelectedName = (name: string) => {
    const group = results.find((g: any) => g.simplified_name === name);

    if (group) {
      const toRemove = new Set([group.simplified_name, ...group.originals]);
      setSelectedIngredients((prev) => prev.filter((i) => !toRemove.has(i)));
    } else {
      setSelectedIngredients((prev) => prev.filter((i) => i !== name));
    }
  };

  useEffect(() => { 
    console.log("Selected Ingredients:", selectedIngredients);
  }, [selectedIngredients]);

  const next = async () => {
    try {
      const updatedProfileData = {
        ...profileContext?.profileData,
        dislikes: selectedIngredients,
      };
      profileContext?.setProfileData(updatedProfileData);
      await api.post("/profile/addProfile", updatedProfileData, {
        headers: {
          Authorization: `Bearer ${registerContext?.accessToken}`,
        },
      });
      
      router.push("/register/preference");
    } catch (err) {
      console.error("Navigation error:", err);
    }
  }

  console.log("ProfileContext allergies:", profileContext?.profileData);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-secondary-400 flex-1" >
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
            <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
            <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
            <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
          </View>

          <View className="flex flex-col gap-44 flex-1">
            <View className="flex flex-col gap-2">
              <Text className="text-4xl font-fogsta text-primary-500 text-center">
                Any dislikes or allergies?
              </Text>
              <Text className="text-center font-brsegma-500">
                We’re excited to have you here. Before we get started...
              </Text>
            </View>
            <View className="flex flex-col justify-between flex-1">
            <View className="flex flex-col gap-4">
              <TouchableOpacity
                className="border border-primary-400 rounded-full py-6 px-4 flex-row items-center justify-center gap-2"
                onPress={openBottomSheet}
              >
                <Feather name="search" size={28} color="black" className="absolute left-4" />
                <Text className="font-brsegma-600">Add ingredients</Text>
              </TouchableOpacity>

              {selectedSimplifiedNames.length > 0 && (
                <View className="mt-3">
                  <View className="flex-row flex-wrap gap-2 justify-center">
                    {selectedSimplifiedNames.map((name, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => removeSelectedName(name)}
                        className={`rounded-full px-3 py-2 flex-row items-center gap-2 border border-primary-400 bg-primary-500`}
                      >
                        <View className="w-5 items-center justify-center">
                          <Text className={`text-secondary-400`}>
                          <FontAwesome5
                            name="times"
                            size={16}
                          />
                          </Text>
                        </View>

                        <Text className={`text-secondary-400`}>
                          {name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
            <TouchableOpacity
              className="py-4 px-10 self-center rounded-full bg-primary-500"
              onPress={next}
            >
              <Text className="text-center font-brsegma-600 text-secondary-400">
                Next
              </Text>
            </TouchableOpacity>
            </View>
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
            {results.length > 0 && results.map((group: any, idx: number) => {
              const selected = selectedIngredients.includes(group.simplified_name);

              return (
                <TouchableOpacity
                  key={`res-${idx}`}
                  onPress={() => toggleSelect(group)}
                  className={`rounded-full px-3 py-2 flex-row items-center gap-2 border border-primary-400 ${
                    selected ? "bg-primary-500" : ""
                  }`}
                >
                  <View className="w-5 items-center justify-center">
                    <Text className={`text-${selected ? "secondary-400" : "primary-400"}`}>
                    <FontAwesome5
                      name={selected ? "times" : "plus"}
                      size={16}
                    />
                    </Text>
                  </View>

                  <Text className={`${selected ? "text-secondary-400" : "text-primary-400"}`}>
                    {group.simplified_name}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Common dislikes */}
            
            {results.length === 0 && commonDislikes.map((item, index) => {
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
