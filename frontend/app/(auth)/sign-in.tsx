import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

const SignIn = () => {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
    const router = useRouter();

  const submit = async () => {
  const { email, password } = form;

  if (!email || !password) {
    return Alert.alert("Error", "Please enter email & password");
  }

  try {
    setIsSubmitting(true);

    const res = await fetch("http://192.168.0.104:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // ✅ FIX
    });

    const data = await res.json();

    if (!res.ok) {
      return Alert.alert("Login failed", data.error);
    }

    await login(data);

    // ✅ IMMEDIATE REDIRECT
    if (data.role === "rescuer") {
      router.replace("/rescuer");
    } else {
      router.replace("/(user-tabs)");

    }

  } catch (err) {
    Alert.alert("Error", "Unable to connect to server");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, email: text }))
        }
        label="Email"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry
      />

      <CustomButton
        title="Sign In"
        isLoading={isSubmitting}
        onPress={submit}
      />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don’t have an account?
        </Text>
        <Link href="/sign-up" className="base-bold text-blue-950">
          Sign Up
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
