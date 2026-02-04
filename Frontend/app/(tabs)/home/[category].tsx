import { Stack, useLocalSearchParams } from "expo-router"
import React from "react";

export default function dynamicCategory() {
    const { category, title } = useLocalSearchParams<{ category: string; title: string }>();
    return (
        <React.Fragment>
            <Stack.Screen options={{ title: title?.replace('\n', ' ') ?? 'Category', headerTitleAlign: 'center'}} />
        </React.Fragment>
    )
}