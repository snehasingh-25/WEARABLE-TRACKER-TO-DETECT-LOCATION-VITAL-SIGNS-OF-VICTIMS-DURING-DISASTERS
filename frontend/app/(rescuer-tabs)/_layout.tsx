import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RescuerTabsLayout() {
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
