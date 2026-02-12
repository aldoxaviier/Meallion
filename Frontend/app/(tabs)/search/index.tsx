import { View, Text, TextInput, ScrollView, FlatList, Image, TouchableHighlight, ActivityIndicator } from "react-native";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { TenRecipeContext } from "@/app/store/tenRecipeContext";
import api from "@/app/utils/api";

export default function Search() {
  const tenRecipe = useContext(TenRecipeContext)
  const [recipeData, setRecipeData] = useState<any>([])
  const [searchRec, setSearchRec] = useState("")
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const categories = ["All", "Vegan", "Low Sugar", "Low Cholesterol", "High Protein", "Low Protein", "Europian"];

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchRec.length >= 2) {
        const res = await api.get(`/recipes/getRecipesByName?query=${searchRec}&page=1&limit=10`)
        setRecipeData(res.data.data.data)
        setTotalPage(res.data.data.info)
      }
      else {
        setRecipeData(tenRecipe?.TenRecipe)
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchRec])

  const handleLoadMore = async () => {
    if(isLoading || page >= totalPage) {
      return;
    }

    setIsLoading(true)
    const nextPage = page + 1;
    
    try {
      if(searchRec.length >= 2) {
        const response = await api.get(`/recipes/getRecipesByName?query=${searchRec}&page=${nextPage}&limit=10`)
        const newRecipes = response.data.data.data
        if(newRecipes?.length > 0){
          setRecipeData((prevData: any[]) => {
              return [...prevData, ...newRecipes];
          })

          setPage(nextPage)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // console.log(recipeData.length);
  }, [recipeData])

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
            value={searchRec}
            onChangeText={setSearchRec}
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
          data={recipeData}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ gap: 14 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => {
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
          }}

          // Belom Kelar
          ListFooterComponent={() => {
            return(
              <View>
                {isLoading && <ActivityIndicator/>}
              </View>
            )
          }}
          >
        </FlatList>
      </View>
    </SafeAreaView>
  );
};

