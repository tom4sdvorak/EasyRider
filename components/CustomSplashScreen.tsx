import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";

interface CustomSplashScreenProps {
    isActive: boolean;
}

export default function CustomSplashScreen({ isActive } : CustomSplashScreenProps){
  const spinValue = new Animated.Value(0);
  const rotate = spinValue.interpolate({
    inputRange: [0,1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    Animated.loop(Animated.timing(spinValue, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    })).start();
    if (isActive){
      spinValue.stopAnimation();
    }
  }, [isActive]);

  const onImageReady = useCallback(async () => {
        await SplashScreen.hideAsync();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image style={{width: 200, height: 200, alignSelf: 'center', resizeMode: 'contain', transform: [{rotate}]}}
        source={require('../assets/images/logo_wheelonly.png')} 
        onLoadEnd={onImageReady}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#EDF2F4",
  }
});