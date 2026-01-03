import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

import Card from '../../components/Card';

type AlertItem = {
  id: string;
  type: 'alert' | 'sos';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  notified: boolean;
};

export default function AlertScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      type: 'alert',
      message: 'Abnormal heart rate detected',
      severity: 'medium',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      notified: true,
    },
    {
      id: '2',
      type: 'sos',
      message: 'SOS triggered manually by user',
      severity: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      notified: true,
    },
  ]);

  const getIconName = (type: AlertItem['type']) => {
    return type === 'sos' ? 'alert-circle' : 'warning';
  };

  const getIconColor = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  const clearAlerts = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all alerts?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setAlerts([]),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-5 py-5">

        {/* HEADER */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Text className="text-gray-900 text-2xl font-bold mr-3">
              Alerts & SOS History
            </Text>
            {alerts.length > 0 && (
              <View className="bg-red-500 rounded-xl px-2 py-1 min-w-[24px] items-center">
                <Text className="text-white text-xs font-bold">
                  {alerts.length}
                </Text>
              </View>
            )}
          </View>

          {alerts.length > 0 && (
            <TouchableOpacity onPress={clearAlerts}>
              <Text className="text-blue-600 text-sm">Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ALERT LIST */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {alerts.length === 0 ? (
            <Card className="items-center py-12">
              <Ionicons
                name="notifications-off"
                size={48}
                color="#9ca3af"
              />
              <Text className="text-gray-400 text-base mt-4">
                No alerts recorded
              </Text>
            </Card>
          ) : (
            alerts.map(alert => (
              <Card key={alert.id} className="mb-3">
                <View className="flex-row items-start">
                  {/* ICON */}
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{
                      backgroundColor: getIconColor(alert.severity) + '20',
                    }}
                  >
                    <Ionicons
                      name={getIconName(alert.type)}
                      size={24}
                      color={getIconColor(alert.severity)}
                    />
                  </View>

                  {/* CONTENT */}
                  <View className="flex-1">
                    <Text className="text-gray-900 text-base font-medium mb-1">
                      {alert.message}
                    </Text>

                    <Text className="text-gray-500 text-sm mb-1">
                      {format(alert.timestamp, 'MMM dd, yyyy · HH:mm')}
                    </Text>

                    <Text className="text-xs text-gray-400">
                      {alert.notified
                        ? 'Rescuer notified'
                        : 'Pending notification'}
                    </Text>

                    {/* SOS TAG */}
                    {alert.type === 'sos' && (
                      <View className="mt-2 bg-red-50 px-2 py-1 rounded-md self-start">
                        <Text className="text-red-600 text-xs font-semibold">
                          Emergency Alert
                        </Text>
                      </View>
                    )}
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
