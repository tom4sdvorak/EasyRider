import { Redirect, useRouter } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable, ScrollView} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function HomeScreen() {
  const [date, setDate] = useState(new Date); 
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const fakeSoon = [{from: "Helsinki", to: "Espoo", date: Date.now()+30000}, {from: "Helsinki", to: "Tampere", date: Date.now()+20*60*1000}, {from: "Lahti", to: "Mikkeli", date: Date.now()+28*60*1000}]

  useEffect(()=>{
    const updateDate = () => { 
      setDate(new Date);
    };
    const interval = setInterval(updateDate, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeLeft = function(date: number){
    const timeLeft = (date-Date.now())/1000;
    
    if(timeLeft<60){
      return Math.round(timeLeft)+"s left";
    }
    else if(timeLeft<3600){
      return Math.round(timeLeft/60)+"min left";
    }
    else if(timeLeft<86400){
      return Math.round(timeLeft/60/60)+"hr left";
    }
    else{
      return Math.round(timeLeft/60/60/24)+"day(s) left";
    }
  }

  return (
    <SafeAreaView style={styles.container}>
          <StatusBar style="light" backgroundColor="#2B2D42" />
          <View style={styles.topCont}>
            <Text style={[styles.textLight, {fontSize: 36, lineHeight: 44}]}>Hey, <Text style={{color: "#D90429"}}>User</Text></Text>
            <View style={{flex: 1, justifyContent: "center"}}>
              <Text style={[styles.textLight, styles.date]}>{months[date.getMonth()]} {date.getDate()}</Text>
              <Text style={styles.clock}>{date.getHours()}:{date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}</Text>
            </View>
          </View>
          <View style={styles.botCont}>
            <View style={{height: 176}}>
              <View style={{flexDirection: "row", alignItems: "center", paddingVertical: 10}}>
                <Text style={styles.sectionTitle}>Leaving soon</Text>
                <AntDesign name="arrowright" size={24} color="black" />
              </View>
              <ScrollView horizontal contentContainerStyle={styles.carousel} showsHorizontalScrollIndicator={false}>
              {fakeSoon.map((ride, i) => (
                <View key={i} style={{marginRight: 8}}>
                  <View style={styles.tile}>
                    <Text style={styles.tileText}>{ride.from+"\nto\n"+ride.to}</Text>
                  </View>
                  <Text style={styles.subTileText}>{getTimeLeft(ride.date)}</Text>
                </View>
              ))}
              </ScrollView>
            </View>
            <View style={{height: 176}}>
              <View style={{flexDirection: "row", alignItems: "center", paddingVertical: 10}}>
                <Text style={styles.sectionTitle}>Recently added</Text>
                <AntDesign name="arrowright" size={24} color="black" />
              </View>
              <ScrollView horizontal contentContainerStyle={styles.carousel} showsHorizontalScrollIndicator={false}>
              {fakeSoon.map((ride, i) => (
                <View key={i} style={{marginRight: 8}}>
                  <View style={styles.tile}>
                    <Text style={styles.tileText}>{ride.from+"\nto\n"+ride.to}</Text>
                  </View>
                  <Text style={styles.subTileText}>{getTimeLeft(ride.date)}</Text>
                </View>
              ))}
              </ScrollView>
            </View>
          </View>
          
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF2F4",
  },
  topCont: {
    flex: 1, 
    backgroundColor: "#2B2D42",
    padding: 16,
  },
  botCont: {
    flex: 1, 
    justifyContent: "flex-start", 
    padding: 16,
  },
  textDark: {
    color: "#333333",
  },
  textLight: {
    color: "#EDF2F4",
  },
  date: {
    fontSize: 36,
    lineHeight: 44,
    textAlign: "center",
  },
  clock: {
    color: "#D90429", 
    fontSize: 128, 
    lineHeight: 136, 
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: "#333333",
    marginRight: 8,
  },
  carousel: {
    paddingVertical: 8,
    flexWrap: "nowrap",
  },
  tile: {
    backgroundColor: "#2B2D42",
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#D90429",
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: 148,
  },
  tileText: {
    color: "#EDF2F4",
    textAlign: "center",
    fontSize: 22,
    lineHeight: 28,
  },
  subTileText: {
    color: "#D90429",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "bold",
    textAlign: "center"
  }
});

