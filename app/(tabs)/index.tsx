import { Redirect, useRouter } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable, ScrollView} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getEndingSoonRides, getRecentlyAddedRides } from "@/hooks/storage";

interface RideData {
  from: string,
  to: string,
  seatsTotal: number,
  seatsTaken: number,
  price: number,
  date: Date,
  participants: []
}

interface Ride {
  id: string;
  rideData: RideData,
}

export default function HomeScreen() {
  const [date, setDate] = useState(new Date); 
  const [isLoaded, setLoaded] = useState(false);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const fakeSoon = [{from: "Helsinki", to: "Espoo", date: Date.now()+30000}, {from: "Helsinki", to: "Tampere", date: Date.now()+20*60*1000}, {from: "Lahti", to: "Mikkeli", date: Date.now()+28*60*1000}]
  const [leavingSoon, setLeavingSoon] = useState<Ride[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Ride[]>([]);

  // Set clock to update every 1s
  useEffect(()=>{
    const updateDate = () => { 
      setDate(new Date);
      fetchRides().catch(console.error); // Updates our ride list every second. Ideally would not do it as often, but stops wasting testing time.
    };
    const interval = setInterval(updateDate, 1000);
    fetchRides().catch(console.error);
    return () => clearInterval(interval);
  }, []);

  const fetchRides = async () => {
    
    try {
      let data : Ride[] = await getEndingSoonRides();
      setLeavingSoon(data);
      data = await getRecentlyAddedRides();
      setRecentlyAdded(data);
      
    } catch(e){
      console.log(e);
    } finally {
      setLoaded(true);
    }  
  };

  const getTimeLeft = function(date: Date){
    date = new Date(date);
    const timeLeft = (date.getTime()-Date.now())/1000;
    if(timeLeft<60){
      return Math.round(timeLeft)+" seconds left";
    }
    else if(timeLeft<3600){
      return Math.round(timeLeft/60)+" minutes left";
    }
    else if(timeLeft<86400){
      return Math.round(timeLeft/60/60)+" hours left";
    }
    else{
      return Math.round(timeLeft/60/60/24)+" day(s) left";
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
              {leavingSoon.map((ride, i) => (
                <View key={i} style={{marginRight: 8}}>
                  <View style={styles.tile}>
                    <Text style={styles.tileText}>{ride.rideData.from+"\nto\n"+ride.rideData.to}</Text>
                  </View>
                  <Text style={styles.subTileText}>{getTimeLeft(ride.rideData.date)}</Text>
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
              {recentlyAdded.map((ride, i) => (
                <View key={i} style={{marginRight: 8}}>
                  <View style={styles.tile}>
                    <Text style={styles.tileText}>{ride.rideData.from+"\nto\n"+ride.rideData.to}</Text>
                  </View>
                  <Text style={styles.subTileText}>{getTimeLeft(ride.rideData.date)}</Text>
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

