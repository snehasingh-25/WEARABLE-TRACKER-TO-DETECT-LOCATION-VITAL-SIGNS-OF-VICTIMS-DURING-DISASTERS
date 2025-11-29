import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import Card from '../../components/Card';
import StatusIndicator from '@/components/StatusIndicator';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Monitor() {
  const [data, setData] = useState([]);         // latest 3 entries
  const [loading, setLoading] = useState(true); // loading state

  // Fetch latest 3 entries from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://wearable-tracker-to-detect-location.onrender.com/latest3");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching backend data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  // If still loading
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#ef4444" />
        <Text className="mt-3 text-gray-600">Fetching live data...</Text>
      </SafeAreaView>
    );
  }

  // If backend has no data yet
  if (!data || data.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">No device data available.</Text>
      </SafeAreaView>
    );
  }

  // Latest entry (most recent)
  const latest = data[0];

  const heartRate = latest?.bpm || 0;
  const latitude = latest?.lat || 0;
  const longitude = latest?.lng || 0;
  const sos = latest?.sos || false;

  const status = heartRate > 100 || sos ? "Warning" : "Stable";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-5 py-5">

        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-900 text-2xl font-bold">Live Monitoring</Text>
          <StatusIndicator status={status} size="small" />
        </View>

        {/* Current Readings */}
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-3">Current Readings</Text>
          <Card>

            {/* Heart Rate */}
            <View className="py-3">
              <View className="flex-row items-center space-x-3">
                <Ionicons name="heart" size={24} color="#ef4444" />
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm mb-1">Heart Rate</Text>
                  <Text className="text-gray-900 font-semibold text-lg">{heartRate} BPM</Text>
                </View>
              </View>
            </View>
            <View className="h-px bg-gray-200" />

            {/* Location */}
            <View className="py-3">
              <View className="flex-row items-center space-x-3">
                <Ionicons name="location" size={24} color="#10b981" />
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm mb-1">Location</Text>
                  <Text className="text-gray-900 font-semibold text-lg">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            </View>

          </Card>
        </View>

        {/* Recent History */}
        <View className="mb-8">
          <Text className="text-gray-900 text-lg font-semibold mb-3">Recent History</Text>

          {data.map((item, index) => (
            <Card key={index} className="mb-3">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-900 font-semibold text-base">
                  {format(new Date(item.timestamp), 'HH:mm:ss')}
                </Text>
                <StatusIndicator status={item.sos ? "Warning" : "Stable"} size="small" />
              </View>

              <View className="flex-row space-x-6">

                {/* BPM */}
                <View className="flex-row items-center space-x-2">
                  <Ionicons name="heart" size={16} color="#ef4444" />
                  <Text className="text-gray-500 text-sm">{item.bpm} BPM</Text>
                </View>

                {/* Location */}
                <View className="flex-row items-center space-x-2">
                  <Ionicons name="location" size={16} color="#10b981" />
                  <Text className="text-gray-500 text-sm">
                    {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                  </Text>
                </View>

              </View>
            </Card>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
