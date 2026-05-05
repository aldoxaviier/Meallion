import { View, Text, Image, TouchableHighlight, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from "expo-router";
import { api } from '../utils/api';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { WarningModal } from './WarningModal';

interface RecipeCardProps {
  recipe: {
    recipe_id: number | string;
    Images: string;
    profile_image?: string;
    author_name?: string;
    name: string;
    rating_score?: number | string;
    TotalTime?: string;
    tags?: string;
  };
  onAddToPlan?: () => void;
  isOwnProfile?: boolean;
  activeTab?: string;
  onRefreshList?: () => void;
}

export const RecipeCard = ({ recipe, onAddToPlan, isOwnProfile, activeTab, onRefreshList }: RecipeCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '',
    message: '',
    isAlertOnly: false,
    confirmText: 'OK',
    confirmColor: 'bg-red-500',
    actionType: 'none', 
  });

  const getFirstTag = (tags: string | string[] | undefined) => {
    if (!tags) return null;
    if (Array.isArray(tags)) {
      return tags[0]?.trim().toUpperCase() || null;
    }
    if (typeof tags === 'string') {
      const tagList = tags.split('|');
      return tagList[0]?.trim().toUpperCase();
    }
    return null;
  };

  const handleModalConfirm = () => {
    if (modalConfig.actionType === 'delete') {
      executeDelete();
    } else {
      setModalConfig(prev => ({ ...prev, visible: false }));
    }
  };

  const handleLikes = async () => {
    try {
      const response = await api.post(`/recipes/addLikes`, { recipeId: recipe.recipe_id, interaction: 'SAVE' });
      
      if (response.data?.isDuplicate) {
        setModalConfig({
          visible: true,
          title: 'Warning',
          message: 'Recipe already liked!',
          isAlertOnly: true,
          confirmText: 'Got it',
          confirmColor: 'bg-orange-500',
          actionType: 'none',
        });
      } else {
        setModalConfig({
          visible: true,
          title: 'Success',
          message: 'Recipe saved to your likes!',
          isAlertOnly: true,
          confirmText: 'Awesome',
          confirmColor: 'bg-primary-500',
          actionType: 'none',
        });
      }
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  const handleDeletePress = () => {
    setShowMenu(false);
    setModalConfig({
      visible: true,
      title: 'Delete Recipe',
      message: 'Are you sure you want to delete this recipe?',
      isAlertOnly: false,
      confirmText: 'Delete',
      confirmColor: 'bg-primary-400',
      actionType: 'delete',
    });
  };

  const executeDelete = async () => {
    setIsLoading(true);
    try {
      await api.delete(`/recipes/deleteRecipe?recipeId=${recipe.recipe_id}`);
      setModalConfig(prev => ({ ...prev, visible: false }));
      onRefreshList?.();
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const firstTag = getFirstTag(recipe.tags);
  return (
    <>
    <TouchableHighlight 
      className={`w-52 h-80 p-3 gap-2 bg-white rounded-xl shadow-sm`} 
      onPress={() => {
        if (showMenu) {
          setShowMenu(false);
          return;
        }
        router.push(`/recipes/${recipe.recipe_id}`);
      }}
    >
      <View className='flex justify-between h-full'>
        <View className='flex gap-1 '>
          <View className="relative">
            <Image source={{ uri: recipe.Images }} className="w-full h-32 rounded-lg" />
            <View className="absolute top-24 -ml-1 w-10 h-10 bg-white rounded-full items-center justify-center">
              <Image 
                className="w-8 h-8 rounded-full" 
                source={recipe.profile_image ? { uri: recipe.profile_image } : require('../../assets/images/android-icon-background.png')}
              />
            </View>
            {showMenu && (
              <View className="absolute top-2 right-12 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                <TouchableOpacity 
                  className="px-4 py-2 bg-white"
                  onPress={handleDeletePress}
                >
                  <Text className="text-red-500 font-bold text-xs">Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            {isOwnProfile && activeTab === 'grid' && (
              <TouchableOpacity 
                className="absolute top-2 right-2 bg-black/30 rounded-full z-50"
                onPress={() => setShowMenu(!showMenu)}
              >
                <Ionicons name="ellipsis-vertical-circle" size={31} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-[10px] text-gray-500 font-medium">
            By {recipe.author_name || "Chef"}
          </Text>
          <View className="">
            <Text className="font-fogsta text-l" numberOfLines={2}>{recipe.name}</Text>
          </View>
          {firstTag && (
            <View className="bg-secondary-300 self-start px-2 py-1 rounded">
              <Text className="text-[8px] font-brsegma-600 text-primary-500">{firstTag}</Text>
            </View>
          )}
        </View>
        <View className='flex gap-1'>
          <View className="flex flex-row items-center gap-1">
            <FontAwesome5 name="star" size={9} color="black" solid />
            <Text className="font-brsegma-600 text-[10px] text-gray-700">
              {recipe.rating_score ?? "No Rate"} · {recipe.TotalTime || "N/A"}
            </Text>
          </View>
          <TouchableHighlight 
            className="bg-primary-400 btn-default py-1"
            onPress={handleLikes}
            underlayColor="#660B05"
          >
            <Text className="text-white font-fogsta">Love This!</Text>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableHighlight>
    <WarningModal
      visible={modalConfig.visible}
      title={modalConfig.title}
      message={modalConfig.message}
      isAlertOnly={modalConfig.isAlertOnly}
      confirmText={modalConfig.confirmText}
      confirmColor={modalConfig.confirmColor}
      isLoading={isLoading}
      onClose={() => setModalConfig(prev => ({ ...prev, visible: false }))}
      onConfirm={handleModalConfirm}
    />
    </>
  );
};
