import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { Slot } from "expo-router";
import { images } from "@/constants";

export default function AuthLayout() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-white"
      >
        {/* Top Blue Section */}
        <View
          className="w-full bg-blue-400 rounded-b-lg relative"
          style={{ height: Dimensions.get("screen").height / 2.25 }}
        >
          <Image
            source={images.logo2}
            className="self-center size-96 absolute -bottom-16 z-10"
          />
        </View>

        {/* Auth Screens */}
        <View className="flex-1 px-5 pt-20">
          <Slot />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
