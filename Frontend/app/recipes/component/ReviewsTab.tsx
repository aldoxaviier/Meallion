import React from 'react';
import { useRef, useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/app/utils/api';
import { ProfileDataContext } from '@/app/store/profileDataContext';

export default function ReviewsTab({recipeData, onReviewSuccess} : {recipeData: any, onReviewSuccess: () => void}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [review, setReview] = useState("")
  const [searchRev, setSearchRev] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [reviewData, setReviewData] = useState<any>([])
  const [allReviewData, setAllReviewData] = useState<any>([])
  const profileData = useContext(ProfileDataContext)
  const [loading, setisLoading] = useState(false)

  const recipeId = recipeData?.recipe_id
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const totalReviews = allReviewData?.length || 0;

  const ratingStats = [
    { star: 5, count: 1000, progress: 'w-[80%]' },
    { star: 4, count: 500, progress: 'w-[40%]' },
    { star: 3, count: 400, progress: 'w-[30%]' },
    { star: 2, count: 100, progress: 'w-[10%]' },
    { star: 1, count: 0, progress: 'w-[0%]' },
  ];

  allReviewData?.forEach((rev: any) => {
    const r = Math.round(rev.rating);
    if (counts[r as keyof typeof counts] !== undefined) {
      counts[r as keyof typeof counts]++;
    }
  });

  const fetchReviews = async () => {
    try {
      const listRes = await api.get(`/recipes/getReview?id=${recipeId}&query=${searchRev}`);
      setReviewData(listRes.data);
      const statsRes = await api.get(`/recipes/getReview?id=${recipeId}&query=`);
      setAllReviewData(statsRes.data);
    } catch (err) {
      console.error("Error Fetching Reviews: ", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [recipeId, searchRev, refreshTrigger]);

  const SubmitReviews = async () => {
    try {
      setisLoading(true)
      if(!selectedRating || !review.trim()){
        setErrorMessage("Please complete your review before submitting")
        return
      }

      setErrorMessage("")
      const name = profileData?.profileData?.users.name
      const body = { review, selectedRating, recipeId, name }
      await api.post('/recipes/addReview', body)
      
      setSelectedRating(0)
      setReview("")
      setIsModalOpen(false)
      setRefreshTrigger(prev => prev + 1);

      if (onReviewSuccess) {
        onReviewSuccess();
      }
      
    } catch (error: any) {
      console.error("Error Submiting Review: ", error)
    } finally {
      setisLoading(false)
    }
  }

  const dynamicRatingStats = [5, 4, 3, 2, 1].map((star) => {
    const count = counts[star as keyof typeof counts];
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return {
      star,
      count,
      progressWidth: `${percentage}%`
    };
  });

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5">
      <View className="flex-row items-center mb-8">
        <View className="flex-1 items-center border-r border-gray-300 pr-4">
          <Text className="text-5xl font-brsegma-600">{recipeData.rating_score || 0}</Text>
          <View className="flex-row my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons key={s} name="star" size={16} color={s <= Math.round(recipeData.rating_score || 0) ? "#FF9F1C" : "#E5E7EB"} />
            ))}
          </View>
          <Text className="text-gray-500 text-xs">({reviewData.length || 0} reviews)</Text>
        </View>

        <View className="flex-[1.5] pl-6">
          {dynamicRatingStats.map((item) => (
            <View key={item.star} className="flex-row items-center mb-1">
              <Text className="text-xs text-gray-600 w-3">{item.star}</Text>
              <Ionicons name="star" size={10} color="#FF9F1C" className="mx-1" />
              <View className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden mx-2">
                <View className="h-full bg-[#FF9F1C]" style={{ width: item.progressWidth as any }} />
              </View>
              <Text className="text-[10px] text-gray-400 w-8 text-right">{item.count}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* SEARCH BAR */}
      <View className="flex-row gap-x-2 mb-8">
        <View className="flex-1 flex-row items-center bg-gray-50 rounded-xl px-4 py-1">
          <Ionicons name="search-outline" size={20} color="black" />
          <TextInput placeholder="Search reviews" className="flex-1 ml-2 text-gray-600" value={searchRev} onChangeText={setSearchRev} />
        </View>
        <TouchableOpacity className="bg-gray-50 p-3 rounded-xl justify-center">
          <Ionicons name="options-outline" size={20} color="#311004" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-50 p-3 rounded-xl justify-center" onPress={() => setIsModalOpen(true)}>
          <Ionicons name="add-circle-outline" size={20} color="#311004" />
        </TouchableOpacity>
      </View>

      {/* cth card review */}
      {reviewData.map((review: any, index: number) => (
        <View key={review.id || index} className="bg-gray-50 rounded-2xl p-4 mb-4">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                  key={star} 
                  name="star" 
                  size={14} 
                  color={star <= review.rating ? "#FF9F1C" : "#E5E7EB"}
                />
              ))}
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <Text className="font-brsegma-600">{review.name}</Text>
          </View>
          <Text className="text-gray-700 text-sm leading-5 font-brsegma-300">
            {review.review}
          </Text>
        </View>
      ))}

      <Modal
        visible={isModalOpen}
        animationType="slide"
        backdropColor={"bg-black/50"}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-[30px] p-6 h-[70%]">
        
            {/* Header Modal */}
            <View className="flex-row justify-between items-center mb-6">
              <View style={{ width: 30 }} />
              <Text className="text-2xl font-brsegma-600 font-bold text-[#311004]">Write a Review</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close-circle-outline" size={30} color={"#8C1007"}></Ionicons>
              </TouchableOpacity>
            </View>

            {/* gambar makan */}
            <View className="h-[200px] w-[300px] mx-auto mb-6">
              <Image
                source={{ uri: recipeData.Images }}
                className="w-full h-full rounded-[20px]"
                resizeMode="cover"
              />
            </View>

            {/* judul makan */}
            <View className="items-center mb-4">
              <Text className="font-fogsta text-3xl">{recipeData.name}</Text>
            </View>
            
            {/* stars */}
            <View className="flex-row justify-center mb-6 gap-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => s === selectedRating ? setSelectedRating(0) : setSelectedRating(s)}>
                  <Ionicons key={s} name={s <= selectedRating ? "star" : "star-outline"} size={30} color={s <= selectedRating ? "#FF9F1C" : "#4b5563"} className="mx-1" />
                </TouchableOpacity>
                
              ))}
            </View>
            
            {/* da review */}
            <TextInput
              className="bg-gray-50 p-5 rounded-xl h-32 font-brsegma-300 border border-gray-400"
              placeholder="What do you think about this recipe?"
              value={review}
              onChangeText={setReview}
              multiline
              textAlignVertical="top"
            />

            <View className="mt-auto">
              {errorMessage ? (
                <Text className="text-red-500 text-sm font-brsegma-600">
                  {errorMessage}
                </Text>
              ) : null}
              {/* submit button */}
              <TouchableOpacity className=" mb-4 bg-primary-400 p-4 rounded-xl items-center shadow-sm" onPress={() => SubmitReviews()} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">Submit Review</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}