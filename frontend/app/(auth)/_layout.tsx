import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, Image } from 'react-native'
import { Redirect, Slot } from "expo-router";
import { images } from "@/constants";


export default function AuthLayout() {
    const isAuthenticated = true; // later replace with real auth state

    // If already logged in, skip auth stack and go to tabs/index
    if (isAuthenticated) {
        return <Redirect href="/(tabs)" />; 
    }
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
                <View
                    className="w-full bg-blue-400 rounded-b-lg relative"
                    style={{ height: Dimensions.get('screen').height / 2.25 }}>

                    <Image source={images.logo2} className="self-center size-96 absolute -bottom-16 z-10" />
                </View>
                <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}