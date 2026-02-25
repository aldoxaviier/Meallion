import { View, Text, Image, TouchableHighlight } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from "expo-router";

interface RecipeCardProps {
  recipe: {
    recipe_id: number | string;
    Images: string;
    author_name?: string;
    name: string;
    rating_score?: number | string;
    TotalTime?: string;
    tags?: string;
  };
  onAddToPlan?: () => void;
  width?: string;
}

export const RecipeCard = ({ recipe, onAddToPlan, width = 'w-56' }: RecipeCardProps) => {
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

  const firstTag = getFirstTag(recipe.tags);

  return (
    <TouchableHighlight className={`${width} p-3 gap-2 bg-white rounded-xl shadow-sm`} onPress={() => router.push(`../recipes/${recipe.recipe_id}`)}>
    <View >
      <View className="relative mb-3">
        <Image source={{ uri: recipe.Images }} className="w-full h-32 rounded-lg" />
        <View className="absolute top-24 -ml-1 w-10 h-10 bg-white rounded-full items-center justify-center">
          <Image 
            className="w-8 h-8 rounded-full" 
            source={require('../../assets/images/android-icon-background.png')} 
          />
        </View>
      </View>
      <Text className="text-[10px] text-gray-500 font-medium">
        By {recipe.author_name || "Chef"}
      </Text>
      <View className="h-12">
        <Text className="font-fogsta text-l" numberOfLines={2}>{recipe.name}</Text>
      </View>
      {firstTag && (
        <View className="bg-secondary-300 self-start px-2 py-1 rounded">
          <Text className="text-[8px] font-brsegma-600 text-primary-500">{firstTag}</Text>
        </View>
      )}
      <View className="flex flex-row items-center gap-1">
        <FontAwesome5 name="star" size={9} color="black" solid />
        <Text className="font-brsegma-600 text-[10px] text-gray-700">
          {recipe.rating_score ?? "No Rate"} · {recipe.TotalTime || "N/A"}
        </Text>
      </View>
      <TouchableHighlight 
        className="bg-primary-400 btn-default mt-auto"
        onPress={onAddToPlan}
        underlayColor="#660B05"
      >
        <Text className="text-secondary-400 font-fogsta">Add to plan</Text>
      </TouchableHighlight>
    </View>
    </TouchableHighlight>
  );
};
