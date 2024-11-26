import { auth } from "@/firebase";
import useAuth from "@/hooks/useAuth";
import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, Pressable, TextInput} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const router = useRouter();
  const { error, register } = useAuth();
  const [ localError, setLocalError ] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)');
      }
    });
    return unsub;
  }, []);
  
  const tryRegister = ()=>{
    console.log("Pressed register");
    if(email != "" && password != "" && passwordConfirm != "" && name != ""){
      if(password != passwordConfirm){
        setLocalError("Passwords have to match.");
      }
      else{
        register(email, password, name);
        setLocalError("");
      }
    }
    else{
      setLocalError("Please fill all the fields.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{headerTransparent: true, headerTitle: "Register"}} />
      <View style={[styles.secondaryCont, {flex: 1}]}>
        <Image style={styles.logo} source={require("../assets/images/logo_notext_nobg.png")}/>
      </View>
      <View style={[styles.secondaryCont, {flex: 2}]}>
        <Text style={[styles.title, styles.textDark]}>Create Account</Text>
        <View style={{width: "100%"}}>
          <TextInput style={styles.input} onChangeText={setEmail} value={email} placeholder="Email" autoComplete="email" autoFocus={true} />
          <TextInput style={styles.input} onChangeText={setName} value={name} placeholder="Name" autoFocus={true} />
          <TextInput style={styles.input} onChangeText={setPassword} value={password} placeholder="Password" secureTextEntry={true} />
          <TextInput style={styles.input} onChangeText={setPasswordConfirm} value={passwordConfirm} placeholder="Confirm Password" secureTextEntry={true} />
        </View>
        <View style={{width: "100%"}}>
          {error ? <Text style={{color: "#D90429", alignSelf: 'center'}}>{error.message}</Text> : <></>}
          {localError != "" ? <Text style={{color: "#D90429", alignSelf: 'center'}}>{localError}</Text> : <></>}
          <Pressable style={[styles.button, styles.buttonPrimary]} onPress={tryRegister}>
            <Text style={[{color: "#EDF2F4"}, styles.buttonLabel]}>Register</Text>
          </Pressable>
        </View>
        
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
    marginTop: 8,
  }
});


