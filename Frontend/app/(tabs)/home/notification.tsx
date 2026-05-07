import { Stack, router, useNavigation } from "expo-router";
import { View, Text, TouchableOpacity, RefreshControl, SectionList } from "react-native";
import { useEffect, useState } from "react";
import CustomHeader from "../../components/CustomHeader";
import { api } from "@/app/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";
import { useColorScheme } from "nativewind";

type NotifType = "meal_reminder" | "follow" | "review";

type Notification = {
  id: number;
  notif_type: NotifType;
  title: string;
  content: string;
  is_checked: boolean;
  timestamp: string;
};

type Section = {
  title: string;
  data: Notification[];
};

function groupNotifications(notifications: Notification[]): Section[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const older: Notification[] = [];

  notifications.forEach((n) => {
    const date = new Date(n.timestamp.replace(" ", "T"));
    if (date >= startOfToday) today.push(n);
    else if (date >= startOfYesterday) yesterday.push(n);
    else older.push(n);
  });

  const sections: Section[] = [];
  if (today.length) sections.push({ title: "Today", data: today });
  if (yesterday.length) sections.push({ title: "Yesterday", data: yesterday });
  if (older.length) sections.push({ title: "Older", data: older });
  return sections;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const notifStyles = {
    meal_reminder: { 
        icon: "alarm" as const, 
        color: isDark ? "#2dd4bf" : "#0d9488",
        bg: "bg-teal-100 dark:bg-teal-900/40" 
    },
    follow: { 
        icon: "person-add" as const, 
        color: isDark ? "#818cf8" : "#6366f1",
        bg: "bg-indigo-100 dark:bg-indigo-900/40" 
    },
    review: { 
        icon: "star" as const, 
        color: isDark ? "#facc15" : "#eab308",
        bg: "bg-yellow-100 dark:bg-yellow-900/40" 
    },
  } as const;

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/auth/getNotifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { 
    fetchNotifications(); 
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleRead = async (id: number, notif_type: NotifType) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, is_checked: true } : notif
      )
    );

    if (notif_type === "meal_reminder") {
      router.push("/(tabs)/mealplan");
    } else {
      router.push("/(tabs)/profile");
    }

    setTimeout(() => {
      if (navigation.canGoBack()) {
        navigation.dispatch(StackActions.popToTop());
      }
    }, 300);

    try {
      await api.put("/auth/markNotificationRead", { id });
    } catch (err) {
      console.error(err);
      fetchNotifications();
    }
  };

  const handleDismiss = async (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== id)
    );

    try {
      await api.delete(`/auth/deleteNotifications?id=${id}`);
    } catch (err) {
      console.error(err);
      fetchNotifications();
    }
  };

  return (
    <View className="flex-1 bg-[#f0ead8] dark:bg-background-dark">
      <Stack.Screen options={{ headerShown: true, header: () => <CustomHeader title="Your Notifications" /> }} />
      <SectionList
        sections={groupNotifications(notifications)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        renderSectionHeader={({ section }) => (
          <View className="items-center my-3">
            <View className="bg-[#e8e2d5] dark:bg-surface-darker rounded-full px-4 py-1">
              <Text className="text-xs font-brsegma-600 text-gray-600 dark:text-gray-400">{section.title}</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => {
          const { icon, color, bg } = notifStyles[item.notif_type];
          return (
            <TouchableOpacity
              onPress={() => handleRead(item.id, item.notif_type)}
              activeOpacity={0.75}
              className={`mx-4 mb-2 flex-row items-center rounded-2xl bg-white dark:bg-surface-dark px-3 py-3 `}
              style={{ elevation: 2, borderLeftWidth: item.is_checked ? 0 : 3, borderLeftColor: color }}
            >
              <View className={`w-11 h-11 rounded-full items-center justify-center mr-3 ${bg}`}>
                <Ionicons name={icon} size={20} color={color} />
              </View>
              <View className="flex-1">
                <Text className={`text-sm font-brsegma-700 ${item.is_checked ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-secondary-200"}`} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className={`text-xs mt-0.5 leading-4 ${item.is_checked ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-secondary-400"}`} numberOfLines={2}>
                  {item.content}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDismiss(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} className="ml-2 p-1">
                <Ionicons name="close" size={16} color={isDark ? "#6b7280" : "#9ca3af"} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-32">
            <Ionicons name="notifications-off-outline" size={48} color={isDark ? "#4b5563" : "#9ca3af"} />
            <Text className="text-gray-500 dark:text-gray-400 font-brsegma-500 text-sm mt-3">No notifications yet.</Text>
          </View>
        }
      />
    </View>
  );
}