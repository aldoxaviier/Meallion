import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../utils/api';
import { AuthContext } from '../../store/authContext';
import { ProfileDataContext } from '../../store/profileDataContext';
import { TenRecipeContext } from '../../store/tenRecipeContext';
import { useCallback, useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RecipeCard } from '../../components/RecipeCard';

const Index = () => {
  const authContext = useContext(AuthContext);
  const profileData = useContext(ProfileDataContext);
  const tenRecipe = useContext(TenRecipeContext);
  const [activeTab, setActiveTab] = useState<'grid' | 'favorites'>('grid');
  const [postrecipes, setPostRecipes] = useState<any[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const displayProfile =  profileData?.profileData;
  const router = useRouter();

  const getPostRecipes = async () => {
    try {
      const response = await api.get('/recipes/get-recipes-by-user',{ params: { user_id: profileData?.profileData?.user_id } });
      
      if (response.data) {
        setPostRecipes(response.data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchProfile = async () => {
        try {
          const response = await api.get('/profile/getProfile')
          profileData?.setProfileData(response.data)
        } catch (err: any) {
            console.log(err)
        }
    }

  const getLikedRecipes = async () => {
    try {
      const response = await api.get('/recipes/getLikesByUserId', { params: { user_id: profileData?.profileData?.user_id } });
      if (response.data) {
        setLikedRecipes(response.data);
      }
    } catch (error) {
      console.error("Error fetching liked recipes:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getPostRecipes();
      getLikedRecipes();
      fetchProfile();
    }, [])
  );

  const getGoalLabel = (goal: string | null | undefined) => {
    if (!goal){
      return 'Not Set';
    }else {
      return goal
    }
  };

  const getDietLabel = (diets: string[] | null | undefined) => {
    if (!diets || diets.length === 0) return 'Not Set';
    return diets.join(', ');
  };

  const displayedRecipes = activeTab === 'favorites' ? likedRecipes : postrecipes;


  return (
    <SafeAreaView className="flex-1 bg-primary-600" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-primary-600 h-28 relative">
            <TouchableOpacity
              className="absolute top-2 right-4 w-10 h-10 rounded-full bg-secondary-400/20 items-center justify-center"
              onPress={() => router.push("/settings/" as any)}
            >
              <Ionicons name="settings-outline" size={22} color="#F2E8C6" />
            </TouchableOpacity>
        </View>

        <View className="bg-secondary-400 min-h-screen rounded-t-3xl -mt-4 px-6 pb-8">
          <View className="-mt-14 mb-4">
            <View className="w-24 h-24 rounded-full border-4 border-secondary-400 overflow-hidden bg-secondary-300">
              <Image
                className="w-full h-full"
                source={displayProfile?.profile_image ? { uri: displayProfile.profile_image } : require('../../../assets/images/android-icon-background.png')}
              />
            </View>
          </View>

          <Text className="font-fogsta text-3xl text-primary-500 mb-1">
            {displayProfile?.users?.name || 'User'}
          </Text>

          <View className='flex flex-row gap-7 mb-2'>
            <View>
              <Text className='font-brsegma-600 text-primary-500'>{displayProfile?.recipes_count}</Text>
              <Text className='font-brsegma-500 text-gray-700'>Recipes</Text>
            </View>
            <View>
              <Text className='font-brsegma-600 text-primary-500'>{displayProfile?.followers}</Text>
              <Text className='font-brsegma-500 text-gray-700'>Followers</Text>
            </View>
            <View>
              <Text className='font-brsegma-600 text-primary-500'>{displayProfile?.followings}</Text>
              <Text className='font-brsegma-500 text-gray-700'>Following</Text>
            </View>
          </View>

          <Text className="font-brsegma-300 text-sm text-gray-600 mb-6 leading-5">
            {displayProfile?.bio || ''}
          </Text>

          <View className="border-t border-b border-gray-300 py-4 mb-6">
            <View className="flex-row justify-between items-center py-2">
              <Text className="font-brsegma-500 text-gray-700">Current weight</Text>
              <Text className="font-brsegma-600 text-primary-500">
                {displayProfile?.weight || '--'} kg
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="font-brsegma-500 text-gray-700">Goal</Text>
              <Text className="font-brsegma-600 text-primary-500">
                {getGoalLabel(displayProfile?.goal_plan)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="font-brsegma-500 text-gray-700">Diet</Text>
              <Text className="font-brsegma-600 text-primary-500">
                {getDietLabel(displayProfile?.diet_preferences)}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-center mb-6">
            <TouchableOpacity
              className={`px-8 py-2 ${activeTab === 'grid' ? 'border-b-2 border-primary-500' : ''}`}
              onPress={() => setActiveTab('grid')}
            >
              <MaterialCommunityIcons
                name="view-grid"
                size={24}
                color={activeTab === 'grid' ? '#660B05' : '#9CA3AF'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-8 py-2 ${activeTab === 'favorites' ? 'border-b-2 border-primary-500' : ''}`}
              onPress={() => setActiveTab('favorites')}
            >
              <Ionicons
                name={activeTab === 'favorites' ? 'heart' : 'heart-outline'}
                size={24}
                color={activeTab === 'favorites' ? '#660B05' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {displayedRecipes.slice(0, 6).map((item, index) => (
              <View key={item.recipe_id || index} className="w-[48%] mb-4">
                <RecipeCard
                  recipe={{
                    recipe_id: item.recipe_id,
                    Images: item.Images || item.image,
                    profile_image: item.profile_image,
                    author_name: item.author_name || item.AuthorName,
                    name: item.name,
                    rating_score: item.rating_score,
                    TotalTime: item.TotalTime,
                    tags: item.tags,
                  }}
                  width="w-full"
                  onAddToPlan={() => console.log('Add to plan:', item.recipe_id)}
                />
              </View>
            ))}
          </View>

          {displayedRecipes.length === 0 && (
            <View className="items-center py-12">
              <Ionicons
                name={activeTab === 'favorites' ? 'heart-outline' : 'restaurant-outline'}
                size={48}
                color="#9CA3AF"
              />
              <Text className="font-brsegma-500 text-gray-500 mt-4">
                {activeTab === 'favorites' ? 'No liked recipes to display' : 'No recipes to display'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
