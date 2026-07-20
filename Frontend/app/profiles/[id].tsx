import { View, Text, TouchableOpacity, Image, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../utils/api';
import { useEffect, useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RecipeCard } from '../components/RecipeCard';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { ProfileDataContext } from '../store/profileDataContext';
import { useColorScheme } from 'nativewind';
import { WarningModal } from '../components/WarningModal';

interface UserProfile {
  activity_level: number;
  allergies: string[];
  bio: string | null;
  birthdate: string; // ISO date string
  diet_preferences: string[];
  gender: string;
  goal_plan: string;
  health_condition: string;
  height: number;
  profile_image: string | null;
  target_calories: number;
  target_carbs: number;
  target_fats: number;
  target_proteins: number;
  updated_at: string; // ISO date string
  user_id: string;
  followers: number;
  followings: number;
  recipes_count: number;
  users: {
    email: string;
    name: string;
  };
  weight: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'grid' | 'favorites'>('grid');
  const [postrecipes, setPostRecipes] = useState<any[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(true);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const router = useRouter();
  const {id} = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile>();
  const profileContext = useContext(ProfileDataContext);
  const viewedUserId = Array.isArray(id) ? id[0] : id;

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const activeTabColor = isDark ? '#FFF9E7' : '#660B05';
  const inactiveTabColor = '#9CA3AF';

  const getPostRecipes = async () => {
    try {
      const response = await api.get('/recipes/get-recipes-by-user',{ params: { user_id: viewedUserId } });
      if (response.data) {
        setPostRecipes(response.data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const getLikedRecipes = async () => {
    try {
      const response = await api.get('/recipes/getLikesByUserId', { params: { user_id: viewedUserId } });
      if (response.data) {
        setLikedRecipes(response.data);
      }
    } catch (error) {
      console.error('Error fetching liked recipes:', error);
    }
  };

  const getProfile = async () => {
    try {
        const response = await api.get(`/profile/getProfileFromID?user_id=${viewedUserId}`);
        const data = await response.data;
        setProfile(data);
    } catch (err) {
        console.error(err);
    }
  }

  const getIsfollowing = async () => {
    setIsFollowLoading(true);
    try {
      const response = await api.get(`/user/user-relationship?target_user_id=${viewedUserId}`);
      
      const followState = response?.data ? true : false; 
      setIsFollowing(followState);
    } catch (error) {
      console.error('Error fetching follow status:', error);
      setIsFollowing(false);
    } finally {
      setIsFollowLoading(false);
    }
  };


  useEffect(() => {
    setIsFollowLoading(true);
    setIsFollowing(false);
    getProfile();
    getPostRecipes();
    getLikedRecipes();
    getIsfollowing();
  }, [viewedUserId]);

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

  const applyFollowChange = async (nextState: boolean) => {
    try {
      setIsFollowLoading(true);
      await new Promise(resolve => setTimeout(resolve, 250));
      setIsFollowing(nextState);
      await api.post('/user/update-follow', { target_user_id: viewedUserId, follow: nextState });
      await getProfile();
    } catch (error) {
      console.error('Failed to update follow state:', error);
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setIsFollowLoading(false);
    }
  };

  const onFollowPress = () => {
    if (isFollowLoading) {
      return;
    }

    if (isFollowing) {
      setShowUnfollowModal(true);
      return;
    }

    void applyFollowChange(true);
  };


  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView className="flex-1 bg-primary-600 dark:bg-surface-darker" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-primary-600 dark:bg-surface-darker h-32 relative">
          <TouchableOpacity
              className="absolute top-1 left-4 w-10 h-10 rounded-full bg-secondary-400/20 dark:bg-black/20 items-center justify-center"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color={isDark ? "#FFF9E7" : "#F2E8C6"} />
            </TouchableOpacity>
        </View>

        <View className="bg-secondary-400 dark:bg-background-dark min-h-screen rounded-t-3xl -mt-4 px-6 pb-8 flex ">
          <View className="-mt-14 mb-4">
            <View className="w-24 h-24 rounded-full border-4 border-secondary-400 dark:border-background-dark overflow-hidden bg-secondary-300 dark:bg-surface-dark">
              <Image
                className="w-full h-full"
                source={profile?.profile_image ? { uri: profile?.profile_image } : require('../../assets/images/android-icon-background.png')}
              />
            </View>
          </View>
          <View className='flex flex-row justify-between'>
            <Text className="font-fogsta text-3xl text-primary-500 dark:text-secondary-200 mb-1">
              {profile?.users.name || 'User'}
            </Text>
            <Pressable
              className={`h-10 min-w-[116px] rounded-full px-4 flex-row items-center justify-center gap-2 ${
                isFollowLoading
                  ? 'bg-gray-300 dark:bg-gray-700'
                  : isFollowing
                  ? 'border border-primary-500 dark:border-secondary-200 bg-secondary-400 dark:bg-surface-darker'
                  : 'bg-primary-500 dark:bg-primary-600'
              } ${isFollowLoading ? 'opacity-100' : 'opacity-100'}`}
              disabled={isFollowLoading}
              onPress={() => {
                void onFollowPress();
              }}
              android_ripple={{ color: 'rgba(255,255,255,0.18)', borderless: false }}
              accessibilityRole="button"
              accessibilityLabel={isFollowing ? 'Unfollow user' : 'Follow user'}
              accessibilityHint={isFollowing ? 'Double tap to unfollow this profile' : 'Double tap to follow this profile'}
              accessibilityState={{ busy: isFollowLoading, disabled: isFollowLoading }}
            >
              {!isFollowLoading && (
                <Ionicons
                  name={isFollowing ? 'checkmark-circle' : 'person-add'}
                  size={16}
                  color={isFollowing ? (isDark ? '#FFF9E7' : '#660B05') : (isDark ? '#FFF9E7' : '#F2E8C6')}
                />
              )}
              <Text
                className={`font-brsegma-600 text-sm ${
                  isFollowLoading
                    ? 'text-gray-500 dark:text-gray-400'
                    : isFollowing
                    ? 'text-primary-500 dark:text-secondary-200'
                    : 'text-secondary-400 dark:text-secondary-200'
                }`}
              >
                {isFollowLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          </View>

          <View className='flex flex-row gap-7 mb-2'>
            <View>
              <Text className='font-brsegma-600 text-primary-500 dark:text-secondary-200'>{profile?.recipes_count}</Text>
              <Text className='font-brsegma-500 text-gray-700 dark:text-gray-400'>Recipes</Text>
            </View>
            <View>
              <Text className='font-brsegma-600 text-primary-500 dark:text-secondary-200'>{profile?.followers}</Text>
              <Text className='font-brsegma-500 text-gray-700 dark:text-gray-400'>Followers</Text>
            </View>
            <View>
              <Text className='font-brsegma-600 text-primary-500 dark:text-secondary-200'>{profile?.followings}</Text>
              <Text className='font-brsegma-500 text-gray-700 dark:text-gray-400'>Following</Text>
            </View>
          </View>

          <Text className="font-brsegma-300 text-sm text-gray-600 dark:text-gray-400 leading-5 pt-2 pb-1">
            {profile?.bio != "null" ? profile?.bio : 'Passionate about healthy, halal cooking and fitness tracking.'}
          </Text>


          <View className="border-t border-b border-gray-300 dark:border-surface-darker py-4 mb-6">
            <View className="flex-row justify-between items-center py-2">
              <Text className="font-brsegma-500 text-gray-700 dark:text-gray-400">Current weight</Text>
              <Text className="font-brsegma-600 text-primary-500 dark:text-secondary-200">
                {profile?.weight || '--'} kg
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="font-brsegma-500 text-gray-700 dark:text-gray-400">Goal</Text>
              <Text className="font-brsegma-600 text-primary-500 dark:text-secondary-200">
                {getGoalLabel(profile?.goal_plan)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="font-brsegma-500 text-gray-700 dark:text-gray-400">Diet</Text>
              <Text className="font-brsegma-600 text-primary-500 dark:text-secondary-200">
                {getDietLabel(profile?.diet_preferences)}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-center mb-6">
            <TouchableOpacity
              className={`px-8 py-2 ${activeTab === 'grid' ? 'border-b-2 border-primary-500 dark:border-secondary-200' : ''}`}
              onPress={() => setActiveTab('grid')}
            >
              <MaterialCommunityIcons
                name="view-grid"
                size={24}
                color={activeTab === 'grid' ? activeTabColor : inactiveTabColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-8 py-2 ${activeTab === 'favorites' ? 'border-b-2 border-primary-500 dark:border-secondary-200' : ''}`}
              onPress={() => setActiveTab('favorites')}
            >
              <Ionicons
                name={activeTab === 'favorites' ? 'heart' : 'heart-outline'}
                size={24}
                color={activeTab === 'favorites' ? activeTabColor : inactiveTabColor}
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap justify-between" style={{ rowGap: 16 }}>
            {displayedRecipes.slice(0, 6).map((item, index) => (
              <RecipeCard
                key={item.recipe_id || index}
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
                onAddToPlan={() => console.log('Add to plan:', item.recipe_id)}
              />
            ))}
          </View>

          {displayedRecipes.length === 0 && (
            <View className="items-center py-12">
              <Ionicons
                name={activeTab === 'favorites' ? 'heart-outline' : 'restaurant-outline'}
                size={48}
                color={isDark ? '#4B5563' : '#9CA3AF'}
              />
              <Text className="font-brsegma-500 text-gray-500 dark:text-gray-400 mt-4">
                {activeTab === 'favorites' ? 'No liked recipes to display' : 'No recipes to display'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <WarningModal
        visible={showUnfollowModal}
        onClose={() => setShowUnfollowModal(false)}
        onConfirm={async () => {
          await applyFollowChange(false);
          setShowUnfollowModal(false);
        }}
        title="Unfollow this user?"
        message="You will stop seeing their latest recipe updates in your feed."
        isLoading={isFollowLoading}
        confirmText="Unfollow"
        confirmColor="bg-primary-500"
      />
    </SafeAreaView>
    </>
  );
};

export default Index;