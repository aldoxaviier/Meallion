import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import { useRouter } from 'expo-router';
import ConfirmationModal from '../../components/ConfirmationModal';
import { ProfileDataContext } from '@/app/store/profileDataContext';

export default function Likes() {
  const router = useRouter();
  const { mealType, selectedDate } = useLocalSearchParams();
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const profileData = useContext(ProfileDataContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: 'add' | 'delete' | null, recipeId: number | null }>({
    type: null,
    recipeId: null
  });

  const refreshLikedRecipes = async () => {
    try {
      const response = await api.get(`/recipes/getLikesByUserId`, { params: { user_id: profileData?.profileData?.user_id } });
      setLikedRecipes(response.data || []);
    } catch (err) {
      console.error('Error fetching liked meals:', err);
    }
  };

  useEffect(() => {
    refreshLikedRecipes();
  }, []);

  const handleAddToMealplan = async (recipeId: number) => {
    try {
      const body = { recipeId, mealType, date: selectedDate };
      await api.post(`/recipes/addToMealPlan`, [body]);
      router.back();
    } catch (err) {
      console.error('Error adding to meal plan:', err);
    }
  };

  const handleRemoveLike = async (recipeId: number) => {
    try {
      await api.delete(`/recipes/removeLikes?recipeId=${recipeId}`);
      setLikedRecipes((prev) => prev.filter((item) => item.recipes?.id !== recipeId));
      await refreshLikedRecipes();
    } catch (err) {
      console.error('Error removing like:', err);
    }
  };

  const showConfirmation = (type: 'add' | 'delete', recipeId: number) => {
    setModalConfig({ type, recipeId });
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (modalConfig.recipeId !== null) {
      if (modalConfig.type === 'add') {
        handleAddToMealplan(modalConfig.recipeId);
      } else if (modalConfig.type === 'delete') {
        handleRemoveLike(modalConfig.recipeId);
      }
    }
    setModalVisible(false);
  };

  const renderFood = ({ item }: { item: any }) => {
    const recipeId = item.recipe_id ?? null;

    return (
      <View className="flex-row items-center bg-white rounded-2xl p-3 mb-2">
        <Image className="w-14 h-14 rounded-2xl" source={{ uri: item?.Images }} />
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-black" numberOfLines={1}>
            {item.name || 'Unknown Meal'}
          </Text>
          <Text className="text-xs text-gray-500">
            {item.Calories} kcal · {item.TotalTime || '0 mins'}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-[10px] text-gray-500">{item.CarbohydrateContent}g carbs</Text>
            <Text className="text-[10px] text-gray-500 ml-2">{item.FatContent}g fats</Text>
            <Text className="text-[10px] text-gray-500 ml-2">{item.ProteinContent}g prot</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            className="p-1.5 rounded-full mr-2 bg-third-500/30"
            onPress={() => showConfirmation('add', recipeId)}
          >
            <Ionicons name="add-outline" size={20} color="#10b981" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-1.5 rounded-full bg-primary-400"
            onPress={() => showConfirmation('delete', recipeId)}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <View className="flex-1 bg-secondary-400 p-5">
      <FlatList data={likedRecipes} renderItem={renderFood} />
      
      <ConfirmationModal 
        visible={modalVisible}
        type={modalConfig.type}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
    </View>
  );
}