import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return null; // splash / loader

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (user.role === "rescuer") {
    return <Redirect href="/(rescuer-tabs)/rescuer" />;
  }

  return <Redirect href="/(user-tabs)" />;
}
