import { View, Text, TextInput, ScrollView, FlatList, Image, TouchableHighlight } from "react-native";
import { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { TenRecipeContext } from "@/app/store/tenRecipeContext";

export default function Search() {
  const tenRecipe = useContext(TenRecipeContext)
  const categories = ["All", "Vegan", "Low Sugar", "Low Cholesterol", "High Protein", "Low Protein", "Europian"];

  return (
    <SafeAreaView className="bg-secondary-400">
      <View className="h-full w-full px-6 pt-7 flex gap-4">

        {/* Header Logo Notip */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-4xl text-primary-500 font-fogsta">
            Meallion
          </Text>
          <TouchableHighlight>
            <FontAwesome5 name="bell" size={24} color="#4a2c2a" />
          </TouchableHighlight>
        </View>

        {/* Search bar */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
          <FontAwesome5 name="search" size={24} color="gray" />
          <TextInput 
            className="flex-1 ml-3 text-base text-gray-700" 
            placeholder="Find your meal..." 
          />
          <TouchableHighlight>
            <FontAwesome6 name="sliders" size={24} color="#4a2c2a" />
          </TouchableHighlight>
        </View>

        {/* Category */}
        <View className="flex h-12">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {categories.map((cat, index) => {
              const isActive = index === 0; 
              return (
                <TouchableHighlight
                  key={index} 
                  className={`px-5 py-2 rounded-full justify-center ${isActive ? 'bg-red-900' : 'bg-white'}`}
                >
                  <Text className={`font-semibold ${isActive ? 'text-white' : 'text-red-900'}`}>
                    {cat}
                  </Text>
                </TouchableHighlight>
              )
            })}
          </ScrollView>
        </View>


        {/* Card Resep */}
        <FlatList
          data={tenRecipe?.TenRecipe}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ gap: 14 }}
          renderItem={({ item }) => {
            const tagArray = item.tags ? item.tags.split(" | ").map(tag => tag.trim()) : []
            let isHighProtein = tagArray.includes("High Protein")
            let isVegan = tagArray.includes("Vegan")
            return (
              <View key={item.recipe_id} className="w-[48%] p-3 gap-2 bg-white rounded-xl shadow-sm">
                <View className="relative mb-3">
                  <Image
                    source={{uri: item.Images}}
                    className="w-full h-32 rounded-lg"
                  />
                  <View className="absolute top-24 -ml-1 w-10 h-10 bg-white rounded-full items-center justify-center">
                      <Image className="w-8 h-8 rounded-full" source={require('../../../assets/images/android-icon-background.png')}></Image>
                  </View>
                </View>
                <Text className="text-[10px] text-gray-500 font-medium">
                  By {item.author_name || "Chef"}
                </Text>
                <View className="h-12">
                  <Text className="font-fogsta text-l">{item.name}</Text>
                </View>
                <View className="flex flex-row">
                </View>
                <View className="flex flex-row items-center gap-1">
                  <FontAwesome5 name="star" size={9} color="black" />
                  <Text className="font-brsegma-600 text-[10px] text-gray-700">{item.rating_score ?? "No Rate"} · {item.TotalTime}</Text>
                </View>
                <TouchableHighlight className="bg-primary-400 btn-default mt-auto">
                  <Text className="text-secondary-400 font-fogsta">Add To Plan</Text>
                </TouchableHighlight>
              </View>
            );
          }}>
        </FlatList>
      </View>
    </SafeAreaView>
  );
};

