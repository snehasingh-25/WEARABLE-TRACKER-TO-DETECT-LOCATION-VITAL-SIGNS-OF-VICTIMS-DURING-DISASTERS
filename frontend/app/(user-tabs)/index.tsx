import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Card from '../../components/Card';
import StatusIndicator from '@/components/StatusIndicator';
import VitalSignCard from '@/components/VitalSignCard';
import Button from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const router = useRouter();


  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();


  // Get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to show your current position');
          setLoadingLocation(false);
          setLocationError(true);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        // setLocation({
        //   latitude: 13.151252,
        //   longitude: 77.609938,
        // });
        setLocation({
  latitude: loc.coords.latitude,
  longitude: loc.coords.longitude,
});
        setLoadingLocation(false);
      } catch (error) {
        console.error('Location error:', error);
        setLocationError(true);
        setLoadingLocation(false);
        Alert.alert('Location Error', 'Unable to fetch your current location');
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://wearable-tracker-to-detect-location.onrender.com/latest");
        const json = await response.json();
        setLiveData(json);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const user = { name: 'User' };
  type VitalStatus = 'Safe' | 'Risk';

  const vitals: { heartRate: number; spo2: number } = {
    heartRate: liveData?.bpm,
    spo2: liveData?.spo2,
  };


  const status =
    vitals.heartRate >= 60 && vitals.heartRate <= 100
      ? "Safe"
      : "Risk";



  const handleSOS = async () => {
    if (!location || !liveData) {
      Alert.alert("Error", "Location or vitals not available");
      return;
    }

    Alert.alert(
      "Send SOS",
      "Are you sure you want to send an emergency alert?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send SOS",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(
                "https://wearable-tracker-to-detect-location.onrender.com/sos",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: "user_001",
                    name: user.name,
                    bpm: liveData.bpm,
                    spo2: liveData.spo2,
                    lat: location.latitude,
                    lng: location.longitude,
                  }),
                }
              );

              Alert.alert(
                "SOS Sent",
                "Rescue team has been notified with your live location."
              );
            } catch (error) {
              Alert.alert("Error", "Failed to send SOS");
            }
          },
        },
      ]
    );
  };


  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };



  const refreshLocation = async () => {
    setLoadingLocation(true);
    setLocationError(false);
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLoadingLocation(false);
    } catch (error) {
      console.error('Location refresh error:', error);
      setLocationError(true);
      setLoadingLocation(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-5 py-10">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-500 text-base">Hello,</Text>
            <Text className="text-gray-900 text-xl font-bold">{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Status Section */}
        <View className="mb-6">
          <View className="flex-row items-center">
            <Text className="text-gray-900 text-base font-semibold mr-2">Status:</Text>
            <StatusIndicator status={status} size="large" />
          </View>
        </View>

        {/* Vitals Section */}
        <View className="mb-6">
          <Text className="text-gray-900 text-base font-semibold mb-2">Vital Signs</Text>
          <View className="flex-row">
            <View className="flex-1 mr-3">
              <VitalSignCard icon="heart" label={"Heart Rate\n(Pulse Based)"} value={vitals.heartRate} unit="BPM" color="#ef4444" />
            </View>
            <View className="flex-1">
              <VitalSignCard
                icon="pulse"
                label="SpO₂"
                value={vitals.spo2}
                unit="%"
                color="#3b82f6"
              />

            </View>
          </View>
        </View>

        {/* SOS Button */}
        <View className="mb-8">
          <Button title="SEND SOS" onPress={handleSOS} variant="danger" />
        </View>

        {/* Location Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-900 text-base font-semibold">Current Location</Text>
            {!loadingLocation && location && (
              <TouchableOpacity onPress={refreshLocation}>
                <Ionicons name="refresh" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
          <Card>
            <View className="items-center py-4">
              {loadingLocation ? (
                <ActivityIndicator size="large" color="#ef4444" />
              ) : location ? (
                <>
                  <MapView
                    style={{ width: '100%', height: 200, borderRadius: 12 }}
                    initialRegion={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker coordinate={location} title="You are here" />
                  </MapView>

                </>
              ) : (
                <View className="items-center">
                  <Text className="text-red-500 mb-2">Unable to fetch location</Text>
                  <TouchableOpacity onPress={refreshLocation}>
                    <Text className="text-blue-500">Retry</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}