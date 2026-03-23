import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { router, useNavigation } from "expo-router";

// Mock data for posts
const POSTS = [
  {
    id: "1",
    username: "X_AE_A-13",
    subtitle: "Product Designer, slothUI",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "Habitant morbi tristique senectus et netus et. Suspendisse sed nisi lacus sed viverra. Dolor morbi non arcu risus quis varius.",
    hashtags: ["#amazing", "#great", "#lifetime", "#uiux", "#machinelearning"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    likes: 12,
    comments: 25,
    shares: 187,
    bookmarks: 8,
  },
  {
    id: "2",
    username: "ChefMaria",
    subtitle: "Food Enthusiast",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    content: "Just made the most amazing pasta dish! The secret is fresh basil and homemade sauce.",
    hashtags: ["#cooking", "#pasta", "#homemade", "#foodie"],
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    likes: 45,
    comments: 12,
    shares: 89,
    bookmarks: 23,
  },
  {
    id: "3",
    username: "ChefMaria",
    subtitle: "Food Enthusiast",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    content: "Just made the most amazing pasta dish! The secret is fresh basil and homemade sauce.",
    hashtags: ["#cooking", "#pasta", "#homemade", "#foodie"],
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    likes: 45,
    comments: 12,
    shares: 89,
    bookmarks: 23,
  },
  {
    id: "4",
    username: "ChefMaria",
    subtitle: "Food Enthusiast",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    content: "Just made the most amazing pasta dish! The secret is fresh basil and homemade sauce.",
    hashtags: ["#cooking", "#pasta", "#homemade", "#foodie"],
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    likes: 45,
    comments: 12,
    shares: 89,
    bookmarks: 23,
  },
];

export default function Index() {

  const [modalVisible, setModalVisible] = useState(false);
  const renderHashtags = (text: string) => {
    return (
      <Text className="text-gray-700 font-brsegma-500">
        {text}{" "}
      </Text>
    );
  };

  return (
    <>
      <ScrollView
        className="flex-1 "
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        

        {POSTS.map((post) => (
          <View key={post.id} className="p-6 border-b-[0.5px] border-gray-400">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-row items-center gap-3">
                <Image
                  source={{ uri: post.avatar }}
                  className="w-10 h-10 rounded-full"
                />
                <View>
                  <Text className="font-brsegma-600 text-gray-800">{post.username}</Text>
                  <Text className="text-gray-400 text-xs">{post.subtitle}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Feather name="more-vertical" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Post Content */}
            <View className="mb-3">
              {renderHashtags(post.content)}
            </View>

            {/* Post Image */}
            <Image
              source={{ uri: post.image }}
              className="w-full h-72 rounded-xl mb-3"
              resizeMode="cover"
            />

            {/* Post Actions */}
            <View className="flex-row justify-between items-center pt-2">
              <View className="flex-row gap-5">
                <TouchableOpacity className="flex-row items-center gap-1">
                  <Feather name="thumbs-up" size={18} color="#6B7280" />
                  <Text className="text-gray-500 text-sm">{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center gap-1">
                  <Feather name="message-square" size={18} color="#6B7280" />
                  <Text className="text-gray-500 text-sm">{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center gap-1">
                  <Feather name="share-2" size={18} color="#6B7280" />
                  <Text className="text-gray-500 text-sm">{post.shares}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Feather name="bookmark" size={18} color="#6B7280" />
                <Text className="text-gray-500 text-sm">{post.bookmarks}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.9}
        className="absolute bottom-2 right-6 h-14 w-14 rounded-full bg-primary-500 items-center justify-center shadow-lg"
        onPress={() => router.push("/addrecipe")}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </>
  );
}
