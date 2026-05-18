import { Stack, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { api } from "../../utils/api";
import { RecipeCard } from "../../components/RecipeCard";
import CustomHeader from "../../components/CustomHeader";
import { useColorScheme } from "nativewind";

export default function DynamicCategory() {
    const { category, title } = useLocalSearchParams<{ category: string; title: string }>();
    const [recipeData, setRecipeData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { colorScheme } = useColorScheme();
    const indicatorColor = colorScheme === 'dark' ? '#FFF9E7' : '#4a2c2a';

    const fetchRecipes = async (pageNum: number) => {
        try {
            const res = await api.get(`/recipes/getRecipesByNameCategory?query=&page=${pageNum}&limit=10&category=${title}`);
            return res.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    useEffect(() => {
        const loadInitial = async () => {
            setIsLoading(true);
            const data = await fetchRecipes(1);
            if (data) {
                setRecipeData(data.data || []);
                setTotalPage(data.info || 1);
                setPage(1);
            }
            setIsLoading(false);
        };
        loadInitial();
    }, [title]);

    const handleLoadMore = async () => {
        if (isLoadingMore || page >= totalPage) return;
        setIsLoadingMore(true);
        const nextPage = page + 1;
        const data = await fetchRecipes(nextPage);
        if (data?.data?.length > 0) {
            setRecipeData(prev => [...prev, ...data.data]);
            setPage(nextPage);
        }
        setIsLoadingMore(false);
    };

    return (
        <View className="flex bg-secondary-400 dark:bg-background-dark">
            <Stack.Screen 
                options={{ 
                    headerShown: true,
                    header: () => <CustomHeader title={title?.replace('\n', ' ') ?? 'Category'} />
                }}
            />
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={indicatorColor} />
                </View>
            ) : (
                <FlatList
                    data={recipeData}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={{ gap: 14, padding: 16 }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.3}
                    keyExtractor={(item) => item.recipe_id?.toString()}
                    renderItem={({ item }) => (
                        <RecipeCard
                            recipe={item}
                            onAddToPlan={() => console.log('Add to plan:', item.recipe_id)}
                        />
                    )}
                    ListFooterComponent={() => (
                        <View className="h-[30px]">
                            {isLoadingMore && <ActivityIndicator color={indicatorColor} />}
                        </View>
                    )}
                />
            )}
        </View>
    );
}