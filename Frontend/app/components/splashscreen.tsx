import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function CustomSplash() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meallion</Text>
      <Text style={styles.subtitle}>Curating your next bite…</Text>
      <ActivityIndicator size="large" color="#FF7A00" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    marginTop: 24,
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  spinner: {
    marginTop: 32,
  },
});
