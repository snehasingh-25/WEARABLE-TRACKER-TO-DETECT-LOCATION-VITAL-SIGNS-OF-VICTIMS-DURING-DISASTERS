import { Redirect } from "expo-router";

export default function Index() {
  const isAuthenticated = true;   
  const role = "user";         // "user" | "rescuer"

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (role === "rescuer") {
    return <Redirect href="/(rescuer-tabs)/rescuer" />;
  }

  return <Redirect href="/(user-tabs)" />;
}
