// app/(tabs)/rescuer.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

type UserEntry = {
  _id: string;        // MongoDB id
  userId: string;
  name: string;
  bpm: number;
  lat: number;
  lng: number;
  sos: boolean;
  timestamp: string;
};

type StatusType = "Safe" | "At Risk" | "SOS";

export default function RescuerDashboard() {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<"list" | "map">("list");

  const [center, setCenter] = useState<{ latitude: number; longitude: number } | null>(null);

  const getStatus = (user: UserEntry): StatusType => {
    if (user.sos) return "SOS";
    if (user.bpm > 100 || user.bpm < 50) return "At Risk";
    return "Safe";
  };

  const fetchData = async () => {
    try {
      const res = await fetch("https://wearable-tracker-to-detect-location.onrender.com/rescuer/latest-all");
      const json = await res.json();
      setUsers(json);

      if (json.length > 0 && !center) {
        setCenter({ latitude: json[0].lat, longitude: json[0].lng });
      }
    } catch (error) {
      console.error("Error fetching rescuer data:", error);
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

  const totalUsers = users.length;
  const sosCount = users.filter(u => u.sos).length;
  const atRiskCount = users.filter(u => getStatus(u) === "At Risk").length;

  const statusColor = (status: StatusType) => {
    switch (status) {
      case "SOS":
        return "#dc2626";
      case "At Risk":
        return "#f97316";
      default:
        return "#16a34a";
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-600">Loading rescuer dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 pt-5 pb-3 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-sm">Rescuer Panel</Text>
          <Text className="text-gray-900 text-xl font-bold">Dashboard</Text>
        </View>
        <Ionicons name="shield-checkmark-outline" size={28} color="#2563eb" />
      </View>

      {/* Summary cards */}
      <View className="px-5 flex-row mb-3">
        <View className="flex-1 bg-white rounded-xl shadow-sm p-3 mr-2">
          <Text className="text-xs text-gray-500">Total Users</Text>
          <Text className="text-lg font-bold text-gray-900 mt-1">{totalUsers}</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl shadow-sm p-3 mr-2">
          <Text className="text-xs text-gray-500">At Risk</Text>
          <Text className="text-lg font-bold text-amber-500 mt-1">{atRiskCount}</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl shadow-sm p-3">
          <Text className="text-xs text-gray-500">SOS</Text>
          <Text className="text-lg font-bold text-red-500 mt-1">{sosCount}</Text>
        </View>
      </View>

      {/* Toggle list / map */}
      <View className="px-5 flex-row mb-3 bg-white rounded-full p-1 self-center">
        <TouchableOpacity
          className={`flex-1 items-center py-1 rounded-full ${selectedView === "list" ? "bg-blue-500" : ""}`}
          onPress={() => setSelectedView("list")}
        >
          <Text className={`${selectedView === "list" ? "text-white" : "text-gray-600"} text-xs`}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-1 rounded-full ${selectedView === "map" ? "bg-blue-500" : ""}`}
          onPress={() => setSelectedView("map")}
        >
          <Text className={`${selectedView === "map" ? "text-white" : "text-gray-600"} text-xs`}>Map</Text>
        </TouchableOpacity>
      </View>

      {selectedView === "list" ? (
        <ScrollView className="flex-1 px-5">
          {users.map((u) => {
            const status = getStatus(u);
            return (
              <View key={u._id} className="bg-white rounded-xl shadow-sm p-4 mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <View>
                    <Text className="text-gray-900 font-semibold">{u.name}</Text>
                    <Text className="text-xs text-gray-500">{u.userId}</Text>
                  </View>
                  <View
                    style={{ backgroundColor: statusColor(status) }}
                    className="px-3 py-1 rounded-full"
                  >
                    <Text className="text-white text-xs font-semibold">{status}</Text>
                  </View>
                </View>

                <View className="flex-row mb-2">
                  <Text className="text-sm text-gray-600 mr-4">
                    HR: <Text className="font-semibold">{u.bpm} BPM</Text>
                  </Text>
                  <Text className="text-sm text-gray-600">
                    SOS:{" "}
                    <Text className={`font-semibold ${u.sos ? "text-red-500" : "text-green-600"}`}>
                      {u.sos ? "Yes" : "No"}
                    </Text>
                  </Text>
                </View>

                <Text className="text-xs text-gray-500 mb-2">
                  Location: {u.lat.toFixed(4)}, {u.lng.toFixed(4)}
                </Text>

                <Text className="text-xs text-gray-400">
                  Updated: {new Date(u.timestamp).toLocaleString()}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className="flex-1 px-5 pb-5">
          {center ? (
            <MapView
              style={{ width: '100%', height: '100%', borderRadius: 16 }}
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
                    title={u.name}
                    description={`HR: ${u.bpm} BPM | ${status}`}
                    pinColor={status === "SOS" ? "red" : status === "At Risk" ? "orange" : "green"}
                  />
                );
              })}
            </MapView>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500">No location data available</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
