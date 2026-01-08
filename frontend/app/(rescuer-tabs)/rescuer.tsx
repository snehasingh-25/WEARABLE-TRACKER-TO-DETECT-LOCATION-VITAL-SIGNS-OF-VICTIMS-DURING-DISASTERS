import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useAuth } from "@/contexts/AuthContext";

type UserEntry = {
  _id: string;
  userId: string;
  name: string;
  bpm: number;
  spo2: number;
  lat: number;
  lng: number;
  sos: boolean;
  timestamp: string;
};

type StatusType = "Safe" | "Risk" | "SOS";

export default function RescuerDashboard() {
  const { logout } = useAuth();

  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<"list" | "map">("list");

  const [rescuerLocation, setRescuerLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [center, setCenter] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // ---------------- STATUS LOGIC ----------------
  const getStatus = (user: UserEntry): StatusType => {
    if (user.sos) return "SOS";
    if (user.bpm < 60 || user.bpm > 100) return "Risk";
    if (user.spo2 < 92) return "Risk";
    return "Safe";
  };


  const statusColor = (status: StatusType) => {
    if (status === "SOS") return "#dc2626";
    if (status === "Risk") return "#f97316";
    return "#16a34a";
  };

  // ---------------- RESCUER LOCATION ----------------
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setRescuerLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // ---------------- FETCH USERS ----------------
  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://wearable-tracker-to-detect-location.onrender.com/rescuer/latest-all"
      );
      const json = await res.json();
      setUsers(json);

      if (json.length > 0 && !center) {
        setCenter({ latitude: json[0].lat, longitude: json[0].lng });
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch rescuer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout(); // clears context + AsyncStorage
        },
      },
    ]);
  };

  // ---------------- GOOGLE MAPS NAVIGATION ----------------
  const openGoogleMapsRoute = (lat: number, lng: number, name: string) => {
    if (!rescuerLocation) {
      Alert.alert("Location unavailable", "Rescuer location not found");
      return;
    }

    const origin = `${rescuerLocation.latitude},${rescuerLocation.longitude}`;
    const destination = `${lat},${lng}`;

    const url = Platform.select({
      android: `google.navigation:q=${destination}`,
      ios: `comgooglemaps://?saddr=${origin}&daddr=${destination}&directionsmode=driving`,
    });

    Alert.alert("Navigate", `Open route to ${name} in Google Maps?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open",
        onPress: () =>
          Linking.openURL(url!).catch(() =>
            Alert.alert("Error", "Google Maps not installed")
          ),
      },
    ]);
  };

  // ---------------- COUNTS ----------------
  const totalUsers = users.length;
  const sosCount = users.filter((u) => u.sos).length;
  const atRiskCount = users.filter((u) => getStatus(u) === "Risk").length;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-600">
          Loading rescuer dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="px-5 pt-5 pb-3 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-sm">Rescuer Panel</Text>
          <Text className="text-gray-900 text-xl font-bold">Dashboard</Text>
        </View>

        <View className="flex-row items-center gap-4">
          <Ionicons
            name="shield-checkmark-outline"
            size={26}
            color="#2563eb"
          />
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={26}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* SUMMARY */}
      <View className="px-5 flex-row mb-3">
        <View className="flex-1 bg-white rounded-xl p-3 mr-2">
          <Text className="text-xs text-gray-500">Total Users</Text>
          <Text className="text-lg font-bold">{totalUsers}</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-3 mr-2">
          <Text className="text-xs text-gray-500">Risk</Text>
          <Text className="text-lg font-bold text-orange-500">
            {atRiskCount}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-3">
          <Text className="text-xs text-gray-500">SOS</Text>
          <Text className="text-lg font-bold text-red-500">
            {sosCount}
          </Text>
        </View>
      </View>

      {/* TOGGLE */}
      <View className="px-5 flex-row mb-3 bg-white rounded-full p-1 self-center">
        {["list", "map"].map((v) => (
          <TouchableOpacity
            key={v}
            className={`flex-1 items-center py-1 rounded-full ${selectedView === v ? "bg-blue-500" : ""
              }`}
            onPress={() => setSelectedView(v as any)}
          >
            <Text
              className={`text-xs ${selectedView === v ? "text-white" : "text-gray-600"
                }`}
            >
              {v.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST VIEW */}
      {selectedView === "list" ? (
        <ScrollView className="flex-1 px-5">
          {users.map((u) => {
            const status = getStatus(u);
            return (
              <View key={u._id} className="bg-white rounded-xl p-4 mb-3">
                <View className="flex-row justify-between mb-2">
                  <View>
                    <Text className="font-semibold">{u.name}</Text>
                    <Text className="text-xs text-gray-500">{u.userId}</Text>
                  </View>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: statusColor(status) }}
                  >
                    <Text className="text-white text-xs">{status}</Text>
                  </View>
                </View>

                <Text className="text-sm text-gray-600 mb-1">
                  HR: <Text className="font-semibold">{u.bpm} BPM</Text>
                </Text>

                <Text className="text-sm text-gray-600 mb-1">
                  SpO₂: <Text className="font-semibold">{u.spo2}%</Text>
                </Text>

                <Text className="text-xs text-gray-400 mb-2">
                  {u.lat.toFixed(4)}, {u.lng.toFixed(4)}
                </Text>

                <TouchableOpacity
                  className="flex-row items-center mt-1"
                  onPress={() =>
                    openGoogleMapsRoute(u.lat, u.lng, u.name)
                  }
                >
                  <Ionicons name="navigate" size={18} color="#2563eb" />
                  <Text className="ml-2 text-blue-600 text-sm">
                    Navigate
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        // MAP VIEW
        <View className="flex-1 px-5 pb-5">
          {center && (
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1, borderRadius: 16 }}
              initialRegion={{
                latitude: center.latitude,
                longitude: center.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              {users.map((u) => {
                const status = getStatus(u);
                return (
                  <Marker
                    key={u._id}
                    coordinate={{ latitude: u.lat, longitude: u.lng }}
                    pinColor={
                      status === "SOS"
                        ? "red"
                        : status === "Risk"
                          ? "orange"
                          : "green"
                    }
                    title={u.name}
                    description={`HR: ${u.bpm} BPM | SpO₂: ${u.spo2}%`}
                    onCalloutPress={() =>
                      openGoogleMapsRoute(u.lat, u.lng, u.name)
                    }
                  />
                );
              })}
            </MapView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
