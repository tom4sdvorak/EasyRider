import { Stack } from "expo-router";
import { AuthProvider } from "@/hooks/useAuth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ride" options={{ headerShown: false }} />
        <Stack.Screen
          options={{
            headerTransparent: true,
            headerTitle: "Leaving soon",
            headerStyle: { backgroundColor: "#2B2D42" },
            headerTitleStyle: { color: "#EDF2F4" },
            headerTintColor: "#EDF2F4",
          }}
          name="leavingsoon"
        />
        <Stack.Screen
          options={{
            headerTransparent: true,
            headerTitle: "Recently added",
            headerStyle: { backgroundColor: "#2B2D42" },
            headerTitleStyle: { color: "#EDF2F4" },
            headerTintColor: "#EDF2F4",
          }}
          name="recentlyadded"
        />
        <Stack.Screen
          options={{ headerTransparent: true, headerTitle: "Login" }}
          name="login"
        />
        <Stack.Screen
          options={{ headerTransparent: true, headerTitle: "Register" }}
          name="register"
        />
      </Stack>
    </AuthProvider>
  );
}