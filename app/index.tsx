import useAuth from "@/hooks/useAuth";
import { Redirect, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View, StyleSheet, Image, Pressable} from "react-native";

export default function Index() {
  const router = useRouter();
  const { user, logout } = useAuth();

  
  const goLogin = ()=>{
    console.log("Pressed login");
    router.push("./login");
  }

  const goRegister = ()=>{
    console.log("Pressed reg");
    router.push("./register");
  }

  const goHome = ()=>{
    router.replace('/(tabs)');
  }

  const goLogOut = ()=>{
    logout();
  }

  return (
    <View style={styles.container}>
      <View style={styles.secondaryCont}>
        <Image style={styles.logo} source={require("../assets/images/logo_notext_nobg.png")}/>
      </View>
      <View style={styles.secondaryCont}>
        <View>
          <Text style={[styles.title, styles.textDark]}>Welcome to EasyRider!</Text>
          <Text style={[styles.subtitle, styles.textDark]}>Ride-sharing made easy</Text>
        </View>
        {user ? <>
          <Pressable style={[styles.button, styles.buttonPrimary]} onPress={goHome}>
            <Text style={[{color: "#EDF2F4"}, styles.buttonLabel]}>Continue as {user.displayName != undefined ? user.displayName : "Anonymous"}</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonSecondary]} onPress={goLogOut}>
            <Text style={[{color: "#333333"}, styles.buttonLabel]}>Log Out</Text>
          </Pressable>
        </> : (
        <>
          <Pressable style={[styles.button, styles.buttonPrimary]} onPress={goLogin}>
            <Text style={[{color: "#EDF2F4"}, styles.buttonLabel]}>Login</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonSecondary]} onPress={goRegister}>
            <Text style={[{color: "#333333"}, styles.buttonLabel]}>Register</Text>
          </Pressable>
        </>
        )}
      </View>   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF2F4",
    padding: 16,
  },
  secondaryCont: {
    flex: 1, 
    justifyContent: "space-evenly", 
    alignItems: "center",
  },
  logo: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
  },
  textDark: {
    color: "#333333",
    textAlign: "center",
  },
  textLight: {
    color: "#EDF2F4",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    boxSizing: "border-box",
    gap: 32,
    borderRadius: 8,
    borderBottomWidth: 2,
    width: "100%"
  },
  buttonLabel: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: '#2B2D42',
    borderBottomColor: "#D90429",
  },
  buttonSecondary: {
    backgroundColor: '#8D99AE',
    borderBottomColor: "#333333",
  },
});
