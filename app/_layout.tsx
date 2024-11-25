import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";
import CustomSplashScreen from "@/components/CustomSplashScreen";


SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [appReady, setAppReady] = useState<boolean>(false);
  
  useEffect(()=>{
    setTimeout(() => {
      setAppReady(true);
      console.log("Ready");
    }, 5000);
  }, []); 

  if (!appReady) {
    return <CustomSplashScreen isActive={appReady} />;
  }  

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen options={{headerTransparent: true, headerTitle: "Login"}} name="login" />
      <Stack.Screen options={{headerTransparent: true, headerTitle: "Register"}} name="register" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen options={{headerTitle: "Leaving soon", headerStyle: {backgroundColor: "#2B2D42"}, headerTitleStyle: {color: "#EDF2F4"}, headerTintColor: "#EDF2F4"}} name="leavingsoon" />
      <Stack.Screen options={{headerTitle: "Recently added", headerStyle: {backgroundColor: "#2B2D42"}, headerTitleStyle: {color: "#EDF2F4"}, headerTintColor: "#EDF2F4"}} name="recentlyadded" />
      <Stack.Screen name="ride" options={{ headerShown: false }} />
    </Stack>
  );
}