import useAuth from "@/hooks/useAuth";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Text, View, StyleSheet, Image, Pressable, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged } from 'firebase/auth';

// Controls login screen
export default function Login() {
  const [email, setEmail] = useState("newmail@x.com");
  const [password, setPassword] = useState("newmail");
  const router = useRouter();
  const { user, error, setError, signIn, loading } = useAuth();

  const tryLogin = () => {
    // Validation
    if(email === "" || password === ""){
      setError("Please fill both fields.")
    }
    else{
      setError("");
      signIn(email, password);
    }
    
  };

  useEffect(() => {
    setError("");
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)');
      }
    });
    return unsub;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerTransparent: true, headerTitle: "Login" }} />
      <View style={styles.secondaryCont}>
        <Image style={styles.logo} source={require("../assets/images/logo_notext_nobg.png")} />
      </View>
      <View style={styles.secondaryCont}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} onChangeText={setEmail} value={email} placeholder="Email" autoComplete="email" autoFocus={true} />
        <TextInput style={styles.input} onChangeText={setPassword} value={password} placeholder="Password" secureTextEntry={true} />
        <Text style={{ color: "#D90429", alignSelf: 'center' }}>{error != "" ? error : null}</Text>
        <Pressable style={[styles.button, styles.buttonPrimary, { flexDirection: "row" }]} onPress={tryLogin}>
          <Text style={[styles.textLight, styles.buttonLabel]}>{loading ? <ActivityIndicator color="#EDF2F4"/> : "Login"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
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
    color: "#333333",
    textAlign: "center",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    boxSizing: "border-box",
    gap: 32,
    borderRadius: 8,
    borderBottomWidth: 2,
    width: "100%",
    margin: 8,
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
  input: {
    borderRadius: 4,
    borderColor: "#8D99AE",
    borderWidth: 1,
    padding: 20,
    gap: 10,
    alignSelf: "stretch",
    boxSizing: "border-box",
    fontSize: 16,
    lineHeight: 24,
    margin: 8,
    color: "#333333"
  },
  textDark: {
    color: "#333333"
  },
  textLight: {
    color: "#EDF2F4"
  },
});