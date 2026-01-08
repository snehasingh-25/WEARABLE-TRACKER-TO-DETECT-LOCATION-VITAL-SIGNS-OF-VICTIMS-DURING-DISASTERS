import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

export default function RescuerTabsLayout() {
  const { user, loading } = useAuth();

  // Prevent flicker during restore
  if (loading) return null;

  // 🚫 Block unauthorized access
  if (!user || user.role !== "rescuer") {
    return <Redirect href="/" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="rescuer"
        options={{
          title: "Rescuer",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
