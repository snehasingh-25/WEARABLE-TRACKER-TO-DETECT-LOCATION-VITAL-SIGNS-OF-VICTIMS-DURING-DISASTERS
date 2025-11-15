import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Card from '../../components/Card';
import StatusIndicator from '@/components/StatusIndicator';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import {SafeAreaView} from "react-native-safe-area-context";
export default function Monitor() {
  const vitals = {
    status: 'Stable',
    heartRate: 80,
    temperature: 36.8,
  };

  const location = {
    latitude: 12.9716,
    longitude: 77.5946,
  };

  const history = [
    { lastUpdated: new Date(), status: 'Stable', heartRate: 78, temperature: 36.7 },
    { lastUpdated: new Date(Date.now() - 60000), status: 'Stable', heartRate: 81, temperature: 36.9 },
    { lastUpdated: new Date(Date.now() - 120000), status: 'Warning', heartRate: 95, temperature: 37.5 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-5 py-5">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-900 text-2xl font-bold">Live Monitoring</Text>
          <StatusIndicator status={vitals.status} size="small" />
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
                  <Text className="text-gray-900 font-semibold text-lg">{vitals.heartRate} BPM</Text>
                </View>
              </View>
            </View>
            <View className="h-px bg-gray-200" />

            {/* Temperature */}
            <View className="py-3">
              <View className="flex-row items-center space-x-3">
                <Ionicons name="thermometer" size={24} color="#f59e0b" />
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm mb-1">Temperature</Text>
                  <Text className="text-gray-900 font-semibold text-lg">{vitals.temperature}°C</Text>
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
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Recent History */}
        <View className="mb-8">
          <Text className="text-gray-900 text-lg font-semibold mb-3">Recent History</Text>
          {history.slice(-10).reverse().map((item, index) => (
            <Card key={index} className="mb-3">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-900 font-semibold text-base">{format(item.lastUpdated, 'HH:mm:ss')}</Text>
                <StatusIndicator status={item.status} size="small" />
              </View>
              <View className="flex-row space-x-6">
                <View className="flex-row items-center space-x-2">
                  <Ionicons name="heart" size={16} color="#ef4444" />
                  <Text className="text-gray-500 text-sm">{item.heartRate} BPM</Text>
                </View>
                <View className="flex-row items-center space-x-2">
                  <Ionicons name="thermometer" size={16} color="#f59e0b" />
                  <Text className="text-gray-500 text-sm">{item.temperature}°C</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
