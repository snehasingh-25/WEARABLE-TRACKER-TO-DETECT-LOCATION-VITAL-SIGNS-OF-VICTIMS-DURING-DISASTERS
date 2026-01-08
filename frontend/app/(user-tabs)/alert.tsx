import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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

const USER_ID = 'device_001'; // replace later with auth userId

export default function AlertScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH ALERTS ----------------
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(
          `https://wearable-tracker-to-detect-location.onrender.com/alerts/${USER_ID}`
        );
        const data = await res.json();

        const formatted: AlertItem[] = data.map((item: any) => ({
          id: item._id,
          type: item.sos ? 'sos' : 'alert',
          message: item.sos
            ? 'SOS triggered by user'
            : `Abnormal heart rate detected (${item.bpm} BPM)`,
          severity: item.sos ? 'high' : 'medium',
          timestamp: new Date(item.timestamp),
          notified: true,
        }));

        setAlerts(formatted);
      } catch (error) {
        console.log('Error fetching alerts:', error);
        Alert.alert('Error', 'Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // ---------------- HELPERS ----------------
  const getIconName = (type: AlertItem['type']) =>
    type === 'sos' ? 'alert-circle' : 'warning';

  const getIconColor = (severity: AlertItem['severity']) => {
    if (severity === 'high') return '#ef4444';
    if (severity === 'medium') return '#f59e0b';
    return '#10b981';
  };

  const clearAlerts = () => {
    Alert.alert(
      'Clear History',
      'This will clear alerts from this view. Continue?',
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

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-500">Loading alerts...</Text>
      </SafeAreaView>
    );
  }

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
