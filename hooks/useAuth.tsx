import React, { useState, useEffect, useMemo } from 'react'
import {SplashScreen, useRouter} from 'expo-router';
import { createContext } from 'react';
import { useContext } from 'react';
import { auth } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import CustomSplashScreen from "@/components/CustomSplashScreen";

const AuthContext = createContext({

});


 // @ts-ignore
export const AuthProvider = ({ children }) => {
  
  const [ error, setError ] = useState("");
  const [ user, setUser] = useState();
  const [ loadingInit, setLoadingInit ] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // @ts-ignore
        setUser(user);
        console.log(user.email + " has logged in");
      }else{
        // @ts-ignore
        setUser(null);
        console.log("Found no user");
      }
      setTimeout(() => {
        setLoadingInit(false); // Making sure splashscreen remains visible for at least 5sec
      }, 5000);
    });
    return unsub;
  }, []);

  const signIn = async (email:string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    }
    catch (error) {
      if(error instanceof Error){
        setError(error.message);
      }        
    }
    finally {
      setLoading(false);
    }
  }

  const logout = () => {
    setLoading(true);

    try {
        signOut(auth);
        setError("");
    }
    catch(error) {
        if(error instanceof Error){
            setError(error.message);
        }
    }
    finally {
        setLoading(false);
        router.dismissAll();
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      setError("");
    }
    catch (error) {
        if(error instanceof Error){
            setError(error.message);
        }
    }
    finally {
      setLoading(false);
    }
  }

  const memoedValue = useMemo(() => ({
    user,
    loading,
    error,
    loadingInit, 
    logout,
    signIn,
    register,
  }), [user, loading, error, loadingInit]);

  return (
    <AuthContext.Provider value={memoedValue}>
      {loadingInit ? <CustomSplashScreen isActive={loadingInit} /> : children}
    </AuthContext.Provider>
  );
};

export default function useAuth(){
    return useContext(AuthContext);
}