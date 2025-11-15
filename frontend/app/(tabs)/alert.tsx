import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import {SafeAreaView} from "react-native-safe-area-context";
export default function AlertScreen() {
  const alerts = [
    { id: '1', type: 'alert', message: 'High temperature detected!', timestamp: new Date() },
    { id: '2', type: 'sos', message: 'SOS triggered by user.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  ];

  const getIconName = (type: string) => {
    switch (type) {
      case 'alert': return 'warning';
      case 'sos': return 'alert-circle';
      default: return 'information-circle';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'alert': return '#f59e0b';
      case 'sos': return '#ef4444';
      default: return '#10b981';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-5 py-5">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Text className="text-gray-900 text-2xl font-bold mr-3">Alerts</Text>
          {alerts.length > 0 && (
            <View className="bg-red-500 rounded-xl px-2 py-1 min-w-[24px] items-center">
              <Text className="text-white text-xs font-bold">{alerts.length}</Text>
            </View>
          )}
        </View>

        <ScrollView className="flex-1">
          {alerts.length === 0 ? (
            <Card className="items-center py-12">
              <Ionicons name="notifications-off" size={48} color="#9ca3af" />
              <Text className="text-gray-400 text-base mt-4">No alerts yet</Text>
            </Card>
          ) : (
            alerts.map(alert => (
              <Card key={alert.id} className="mb-3">
                <View className="flex-row items-start">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: getIconColor(alert.type) + '20' }}
                  >
                    <Ionicons
                      name={getIconName(alert.type) as any}
                      size={24}
                      color={getIconColor(alert.type)}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 text-base mb-1">{alert.message}</Text>
                    <Text className="text-gray-500 text-sm">{format(alert.timestamp, 'MMM dd, yyyy HH:mm')}</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
