import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, Image, Pressable, TextInput} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const tryLogin = ()=>{
    console.log("Pressed login");
    router.replace("./(tabs)");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.secondaryCont}>
        <Image style={styles.logo} source={require("../assets/images/logo_notext_nobg.png")}/>
      </View>
      <View style={styles.secondaryCont}>
        <Text style={[styles.title, styles.textDark]}>Login</Text>
          <TextInput style={styles.input} onChangeText={setEmail} value={email} placeholder="Email" autoComplete="email" autoFocus={true} />
          <TextInput style={styles.input} onChangeText={setPassword} value={password} placeholder="Password" secureTextEntry={true} />
        <Pressable style={[styles.button, styles.buttonPrimary]} onPress={tryLogin}>
          <Text style={[{color: "#EDF2F4"}, styles.buttonLabel]}>Login</Text>
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
  buttonSecondary: {
    backgroundColor: '#8D99AE',
    borderBottomColor: "#333333",
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
  }
});


