import { apiFastApi, api } from "../../utils/api";
import { Text, View, Image, TextInput, ScrollView, Pressable, Button, TouchableHighlight, FlatList, Animated, Keyboard, ActivityIndicator } from "react-native";
import { useEffect, useState, useContext, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileDataContext } from "../../store/profileDataContext";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import "../../globals.css"
import { TenRecipeContext } from "@/app/store/tenRecipeContext";
import { RecipeCard } from "../../components/RecipeCard";
import { TodaysMeal } from "../../components/TodaysMeal";


export default function Index() {
  const [loading, setLoading] = useState(true)
  const profileData = useContext(ProfileDataContext)
  const tenRecipe = useContext(TenRecipeContext)
  const [TenRecipe, setTenRecipe] = useState<any>([]);

  // Search state
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchRec, setSearchRec] = useState("");
  const [recipeData, setRecipeData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchCategories, setSearchCategory] = useState([
    { name: 'Vegan', isActive: false },
    { name: 'Low Sugar', isActive: false },
    { name: 'Low Cholesterol', isActive: false },
    { name: 'High Protein', isActive: false },
    { name: 'Low Protein', isActive: false },
    { name: 'Europian', isActive: false },
  ])
  
  // Animation values
  const homeContentOpacity = useRef(new Animated.Value(1)).current;
  const searchContentOpacity = useRef(new Animated.Value(0)).current;
  const searchBarTranslateY = useRef(new Animated.Value(0)).current;
  const backArrowOpacity = useRef(new Animated.Value(0)).current;
  const backArrowTranslateX = useRef(new Animated.Value(-20)).current;
  const searchBarLeftMargin = useRef(new Animated.Value(0)).current;
  const searchBarScale = useRef(new Animated.Value(1)).current;
  const filterIconOpacity = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);

  const categories = [
    { label: "Vegan", url:'vegan', icon: "leaf", bg: "bg-green-400" },
    { label: "Low Sugar", url:'low-sugar', icon: "cubes", bg: "bg-amber-300" },
    { label: "Low Cholesterol", url:'low-cholesterol', icon: "heart", bg: "bg-red-400" },
    { label: "High Protein", url:'high-protein', icon: "drumstick-bite", bg: "bg-yellow-300" },
    { label: "Low Protein", url:'low-protein', icon: "drumstick-bite", bg: "bg-orange-400" },
    { label: "European", url:'test2', icon: "fish", bg: "bg-blue-400" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
        try {
          const response = await api.get('/profile/getProfile')
          profileData?.setProfileData(response.data)
        } catch (err: any) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const get10Recipe = async () => {
      try {
        const RecipeRes = await apiFastApi.get('/recommendation/')
        if(RecipeRes){
          tenRecipe?.setTenRecipe(RecipeRes.data)
        }
      } catch (err: any) {
        console.log(err)
      }
    }

    get10Recipe()
    fetchProfile()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const activeCategories = searchCategories.filter(c => c.isActive);
      if (searchRec.length >= 2 || activeCategories.length > 0) {
        const catParam = activeCategories.map(c => c.name).join(',');
        const res = await api.get(`/recipes/getRecipesByNameCategory?query=${searchRec}&page=1&limit=10&category=${catParam}`)
        console.log(res)
        setRecipeData(res.data.data)
        setTotalPage(res.data.info)
        setPage(1)
      } else {
        setRecipeData(tenRecipe?.TenRecipe || [])
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchRec, tenRecipe?.TenRecipe, searchCategories])

  const enterSearchMode = () => {
    setIsSearchMode(true);
    Animated.parallel([
      Animated.spring(searchBarTranslateY, {
        toValue: -150,
        useNativeDriver: true,
        tension: 90,
        friction: 14,
      }),
      Animated.spring(searchBarScale, {
        toValue: 0.90,
        useNativeDriver: true,
        tension: 90,
        friction: 14,
      }),
      Animated.spring(searchBarLeftMargin, {
        toValue: 20,
        useNativeDriver: true,
        tension: 90,
        friction: 14,
      }),
      Animated.timing(homeContentOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(backArrowOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(backArrowTranslateX, {
        toValue: 0,
        tension: 90,
        friction: 14,
        useNativeDriver: true,
      }),
      Animated.timing(searchContentOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(filterIconOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
        searchInputRef.current?.focus();
    });
  };

  const exitSearchMode = () => {
    setIsSearchMode(false);
    Keyboard.dismiss();
    setSearchRec("");
    Animated.parallel([
      Animated.timing(searchContentOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(filterIconOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(searchBarScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }),
      Animated.spring(searchBarLeftMargin, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }),
      Animated.timing(backArrowOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(backArrowTranslateX, {
        toValue: -20,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }),
      Animated.spring(searchBarTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 12,
      }),
      Animated.timing(homeContentOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {

    });
  };

  const handleLoadMore = async () => {
    if (isLoadingSearch || page >= totalPage) {
      return;
    }

    setIsLoadingSearch(true);
    const nextPage = page + 1;

    try {
      const activeCategories = searchCategories.filter(c => c.isActive);
      if (searchRec.length >= 2 || activeCategories.length > 0) {
        const catParam = activeCategories.map(c => c.name).join(',');
        const response = await api.get(`/recipes/getRecipesByNameCategory?query=${searchRec}&page=${nextPage}&limit=10&category=${catParam}`)
        const newRecipes = response.data.data
        if (newRecipes?.length > 0) {
          setRecipeData((prevData: any[]) => [...prevData, ...newRecipes]);
          setPage(nextPage);
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleCategories = (category : string) => {
    const selectedCategories = categories.find(item => item.url === category);

    if(!selectedCategories) return;

    router.push({
      pathname: '/home/[category]',
      params: {
        category: selectedCategories.url,
        title: selectedCategories.label
      }
    });
  }

  useEffect(() => {
    console.log(isSearchMode)
  },[isSearchMode])

  const handleSearchCategory = (index: number) => {
    const newCategory = [...searchCategories];
    newCategory[index].isActive = !newCategory[index].isActive;
    newCategory.sort((a, b) => Number(b.isActive) - Number(a.isActive));
    setSearchCategory(newCategory);
  }

  const renderSearchHeader = () => (
    <View className="h-12 mb-4">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        {searchCategories.map((cat, index) => {
          return (
            <TouchableHighlight
              key={index} 
              className={`px-5 py-2 rounded-full justify-center ${cat.isActive ? 'bg-primary-400' : 'bg-white'}`}
              onPress={() => handleSearchCategory(index)}
            >
              <View className="flex flex-row items-center">
                <Text className={`font-semibold ${cat.isActive ? 'text-white' : 'text-primary-400'}`}>
                  {cat.name}
                </Text>
                {cat.isActive && <FontAwesome6 name="x" className="ml-3" size={15} color="white"></FontAwesome6>}
              </View>
            </TouchableHighlight>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderCommonElements = () => (
    <>
      {/* Invisible placeholder to maintain layout spacing */}
      <View className="px-6" style={{ opacity: 0 }}>
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center rounded-full px-4 py-2">
            <FontAwesome5 name="search" size={20} color="gray" />
            <TextInput 
              className="flex-1 ml-3 text-base text-gray-700" 
              placeholder="Find your meal..." 
              editable={false}
            />
          </View>
        </View>
      </View>

      {/* Back arrow - absolutely positioned and independent from search bar */}
      <Animated.View 
        className="absolute"
        style={{ 
          transform: [
            { translateY: searchBarTranslateY },
            { translateX: backArrowTranslateX }
          ],
          opacity: backArrowOpacity,
          top: 198,
          left: 24,
          zIndex: isSearchMode ? 11 : -1,
        }}
        pointerEvents={isSearchMode ? 'auto' : 'none'}
      >
        <TouchableHighlight 
          onPress={exitSearchMode}
          underlayColor="transparent"
        >
          <Ionicons name="arrow-back" size={24} color="#4a2c2a" />
        </TouchableHighlight>
      </Animated.View>

      {/* Absolute positioned search bar for animation */}
      <Animated.View 
        className="w-full absolute px-6"
        style={{ 
          transform: [
            { translateY: searchBarTranslateY },
            { translateX: searchBarLeftMargin },
            { scaleX: searchBarScale }
          ],
          top: 182,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Pressable
        onPress={() => {
          if (!isSearchMode) {
            enterSearchMode();
          }
        }}>
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
          <FontAwesome5 name="search" size={20} color="gray" />
          <TextInput 
            ref={searchInputRef}
            className="flex-1 ml-3 text-base text-gray-700" 
            placeholder="Find your meal..." 
            value={searchRec}
            onChangeText={setSearchRec}
            editable={isSearchMode}
          />
          <Animated.View style={{ opacity: filterIconOpacity }}>
            {isSearchMode && (
              <TouchableHighlight underlayColor="transparent">
                <FontAwesome6 name="sliders" size={20} color="#4a2c2a" />
              </TouchableHighlight>
            )}
          </Animated.View>
        </View>
        </Pressable>
      </Animated.View>
    </>
  );
  console.log("profileeimage", profileData?.profileData?.profile_image)
  return (
    <SafeAreaView className="bg-secondary-400 flex-1" edges={['top']}>
      {isSearchMode ? (
        // Search mode: Use FlatList as the main scrolling container
        <View className="bg-secondary-400 h-full w-full pt-7 flex flex-col gap-5 pb-6">
          <Animated.View 
            style={{ 
              opacity: homeContentOpacity,
              height: 0,
              overflow: 'hidden'
            }}
            className="gap-7"
          >
            <View className="flex flex-row items-center justify-between px-6">
              <View className="flex flex-row gap-3 items-center">
                <Image 
                  className="w-16 h-16 rounded-full"
                  source={profileData?.profileData?.profile_image ? { uri: profileData.profileData.profile_image } : require('../../../assets/images/android-icon-background.png')}
                />
                <View>
                  <Text className="text-primary-500 text-2xl font-fogsta">Hey, {profileData?.profileData?.users.name}</Text>
                  <Text className="text-primary-500 text-xs font-brsegma-500">Good Morning</Text>
                </View>
              </View>
              <TouchableHighlight onPress={() => router.push('/profile')} className="rounded-full">
                <FontAwesome5 name="bell" size={24} color="#4a2c2a" />
              </TouchableHighlight>
            </View>

            <View className="px-6">
              <Text className="text-primary-500 text-2xl font-fogsta">What flavors are you{'\n'}craving today?</Text>
            </View>
          </Animated.View>

          {renderCommonElements()}

          <Animated.View 
            style={{ opacity: searchContentOpacity, flex: 1 }}
            className="px-6 z-20"
            pointerEvents={isSearchMode ? 'auto' : 'none'}
          >
            <FlatList
              data={recipeData}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ gap: 14, paddingBottom: 100 }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              keyExtractor={(item) => item.recipe_id?.toString()}
              ListHeaderComponent={renderSearchHeader}
              renderItem={({ item }) => (
                <RecipeCard 
                  recipe={item} 
                  width="w-[48%]"
                  onAddToPlan={() => console.log('Add to plan:', item.recipe_id)}
                />
              )}
              ListFooterComponent={() => (
                <View className="h-[30px]">
                  {isLoadingSearch && <ActivityIndicator />}
                </View>
              )}
            />
          </Animated.View>
        </View>
      ) : (
        // Home mode: Use ScrollView for the home content
        <ScrollView>
          <View className="bg-secondary-400 h-full w-full pt-7 flex flex-col gap-5 pb-6">
            <Animated.View 
              style={{ 
                opacity: homeContentOpacity,
                height: 'auto',
                overflow: 'hidden'
              }}
              className="gap-7"
            >
              <View className="flex flex-row items-center justify-between px-6  h-16">
                <View className="flex flex-row gap-3 items-center">
                  <Image 
                    className="w-16 h-16 rounded-full"
                    source={profileData?.profileData?.profile_image ? { uri: profileData.profileData.profile_image } : require('../../../assets/images/android-icon-background.png')}
                  />
                  <View >
                    <Text className="text-primary-500 text-2xl font-fogsta">Hey, {profileData?.profileData?.users.name}</Text>
                    <Text className="text-primary-500 text-xs font-brsegma-500">Good Morning</Text>
                  </View>
                </View>
                <TouchableHighlight onPress={() => router.push('/profile')} className="rounded-full">
                  <FontAwesome5 name="bell" size={24} color="#4a2c2a" />
                </TouchableHighlight>
              </View>

              <View className="px-6">
                <Text className="text-primary-500 text-2xl font-fogsta">What flavors are you{'\n'}craving today?</Text>
              </View>
            </Animated.View>

            {renderCommonElements()}

            <Animated.View 
              style={{ opacity: homeContentOpacity, flex: 1 }}
            >
              <View className="flex gap-4">
                {/* Today's Meal */}
                <TodaysMeal />
                {/* Categories */}
                <View className="flex gap-3">
                  <Text className="text-xl font-fogsta px-6">Categories</Text>
                  <FlatList
                    data={categories}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
                    renderItem={({ item }) => (
                      <TouchableHighlight onPress={() => handleCategories(item.url)} underlayColor="transparent">
                        <View key={item.label} className="items-center">
                          <View className={`size-20 rounded-full items-center justify-center ${item.bg}`}>
                            <FontAwesome5 name={item.icon} size={28} color="#4a2c2a" />
                          </View>
                          <Text className="text-center font-brsegma-600 w-24">{item.label}</Text>
                        </View>
                      </TouchableHighlight>
                    )}
                  />
                </View>
                {/* 10 recipe */}
                <View className="gap-3">
                  <Text className="text-xl font-fogsta px-6">For You</Text>
                  <FlatList
                    data={tenRecipe?.TenRecipe}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
                    renderItem={({ item }) => (
                      <RecipeCard 
                        recipe={item} 
                        width="w-56"
                        onAddToPlan={() => console.log('Add to plan:', item.recipe_id)}
                      />
                    )}
                  />
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}