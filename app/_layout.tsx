import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useContext, useEffect, useState } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";
import CustomSplashScreen from "@/components/CustomSplashScreen";
import useAuth, { AuthProvider } from "@/hooks/useAuth";


export default function RootLayout() {
  
  const { user } = useAuth();

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ride" options={{ headerShown: false }}/>
        <Stack.Screen options={{headerTransparent: true, headerTitle: "Leaving soon", headerStyle: {backgroundColor: "#2B2D42"}, headerTitleStyle: {color: "#EDF2F4"}, headerTintColor: "#EDF2F4"}} name="leavingsoon" />
        <Stack.Screen options={{headerTransparent: true, headerTitle: "Recently added", headerStyle: {backgroundColor: "#2B2D42"}, headerTitleStyle: {color: "#EDF2F4"}, headerTintColor: "#EDF2F4"}} name="recentlyadded" />
        <Stack.Screen options={{headerTransparent: true, headerTitle: "Login"}} name="login" />
        <Stack.Screen options={{headerTransparent: true, headerTitle: "Register"}} name="register" />
      </Stack>
    </AuthProvider>
  );
}