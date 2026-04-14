import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import SocialHeader from "../../components/SocialHeader";
import { api } from "@/app/utils/api";

export default function Index() {

  const [recipes, setRecipes] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState('foryou');
  const isSocial = true;
  const url = process.env.EXPO_PUBLIC_API_URL;

  const fetchRecipes = async (pageNum: number) => {
    try {
      const res = await api.get(`/recipes/getRecipesByNameCategory?query=&page=${pageNum}&limit=10&category=&isSocial=${isSocial}`);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const loadInitial = async () => {
    setIsLoading(true);
    const data = await fetchRecipes(1);
    if (data) {
      setRecipes(data.data || []);
      setPage(1);
      setTotalPage(data.info?.totalPage || 1);
    }
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadInitial();

      return () => {
        setRecipes([]); 
        setPage(1);
      };
    }, [])
  );

  const handleLoadMore = async () => {
    if (isLoadingMore || page >= totalPage) return;
    console.log("Trigger")
    setIsLoadingMore(true);
    
    const nextPage = page + 1;
    const data = await fetchRecipes(nextPage);
    
    if (data?.data?.length > 0) {
      setRecipes(prev => {
        const newRecipes = data.data.filter(
          (newItem: any) => !prev.some((prevItem) => prevItem.recipe_id === newItem.recipe_id)
        );
        return [...prev, ...newRecipes];
      });
      setPage(nextPage);
    }
    setIsLoadingMore(false);
  };

  const handleActiveTab = async (selectedTab: string) => {
    console.log("Tab: ", selectedTab);
    setActiveTab(selectedTab);
  };

  const getFirstTag = (tags: string | string[] | undefined) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.slice(0, 3).map(t => `#${t.trim()}`);
    return tags.split('|').slice(0, 3).map(t => `#${t.trim()}`);
  };

  const getImages = (images: string) => {
    if (images?.includes('https')) {
      return images;
    }
    return `${url}/${images}`;
  }

  const renderRecipePost = ({ item }: { item: any }) => (
    // UBAH DISINI: Ganti border dengan bg-white, rounded, dan margin
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => router.push(`../recipes/${item.recipe_id}`)} 
      className="bg-white p-5 mx-4 mb-4 rounded-2xl shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center gap-3">
          <Image
            source={item.profile_image ? { uri: item.profile_image } : require('../../../assets/images/android-icon-background.png')}
            className="w-10 h-10 rounded-full"
          />
          <View>
            <Text className="font-brsegma-600 text-gray-800">{item.author_name || "Chef"}</Text>
            <Text className="text-gray-400 text-xs">Food Enthusiast</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Feather name="more-vertical" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View className="mb-3">
        <Text className="text-gray-800 font-brsegma-600 text-base mb-1" numberOfLines={2}>{item.name}</Text>
        <Text className="text-gray-500 font-brsegma-500 text-sm" numberOfLines={2}>{item.Description}</Text>
        {getFirstTag(item.tags).length > 0 && (
          <Text className="text-primary-400 font-brsegma-500 text-sm mt-1">
            {getFirstTag(item.tags).join(' ')}
          </Text>
        )}
      </View>

      {/* Post Image */}
      {item.Images && (
        <Image
          source={{ uri: getImages(item.Images) }}
          className="w-full h-72 rounded-xl mb-3"
          resizeMode="cover"
        />
      )}

      {/* Post Actions */}
      <View className="flex-row justify-between items-center pt-2">
        <View className="flex-row gap-5">
          <TouchableOpacity className="flex-row items-center gap-1">
            <Feather name="star" size={18} color="#FFD700" />
            <Text className="text-gray-500 text-sm">{item.rating_total || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Feather name="message-square" size={18} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Feather name="share-2" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="flex-row items-center gap-1">
          <Feather name="bookmark" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  return (
    // UBAH DISINI: Bungkus semuanya dengan View background secondary-400
    <View className="flex-1 bg-secondary-400">
      <SocialHeader onPressBtn={handleActiveTab} />
      
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4a2c2a" />
        </View>
      ) : (
        <FlatList
          data={recipes}
          className="flex-1"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }} // Tambahkan padding agar card pertama dan terakhir tidak terlalu nempel
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.recipe_id?.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          renderItem={renderRecipePost}
          ListFooterComponent={() => (
            <View className="h-[30px]">
              {isLoadingMore && <ActivityIndicator />}
            </View>
          )}
        />
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        className="absolute bottom-4 right-6 h-14 w-14 rounded-full bg-primary-500 items-center justify-center shadow-lg"
        onPress={() => router.push("/addrecipe")}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}