import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Button, Dialog } from '@rneui/themed';
import { getEndingSoonRides, getRecentlyAddedRides } from "@/hooks/storage";
import useAuth from "@/hooks/useAuth";

interface RideData {
  from: string;
  to: string;
  seatsTotal: number;
  seatsTaken: number;
  price: number;
  date: Date;
  participants: string[];
}

interface Ride {
  id: string;
  rideData: RideData;
}

export default function HomeScreen() {
  const [date, setDate] = useState(new Date()); 
  const [isLoaded, setLoaded] = useState(false);
  const [leavingSoon, setLeavingSoon] = useState<Ride[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Ride[]>([]);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);

  // Months for displaying dates
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Sets clock to update every 1s
  useEffect(() => {
    const updateDate = () => { 
      setDate(new Date());
      fetchRides().catch(console.error); // Updates ride list too, faster than necessary (for sake of smooth testing)
    };
    const interval = setInterval(updateDate, 1000);
    fetchRides().catch(console.error);
    return () => clearInterval(interval);
  }, []);

  // Gets 5 soonest leaving and 5 most recently added rides
  const fetchRides = async () => {
    try {
      let data: Ride[] = await getEndingSoonRides();
      setLeavingSoon(data.slice(0, 5));
      data = await getRecentlyAddedRides();
      setRecentlyAdded(data.slice(0, 5));
    } catch (e) {
      console.log(e);
    } finally {
      setLoaded(true);
    }  
  };

  const getTimeLeft = (date: Date) => {
    date = new Date(date);
    const timeLeft = (date.getTime() - Date.now()) / 1000;
    if (timeLeft < 60) {
      return Math.round(timeLeft) + " seconds left";
    } else if (timeLeft < 3600) {
      return Math.round(timeLeft / 60) + " minutes left";
    } else if (timeLeft < 86400) {
      return Math.round(timeLeft / 60 / 60) + " hours left";
    } else {
      return Math.round(timeLeft / 60 / 60 / 24) + " day(s) left";
    }
  };

  const toggleDialog = () => {
    setDialogVisible(!dialogVisible);
  };

  const goLogOut = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#2B2D42" />

      {/* Top Section */}
      <View style={styles.topCont}>
        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
          {user ? (
            <Text style={[styles.textLight, { fontSize: 36, lineHeight: 44 }]}>
              Hey, <Text style={{ color: "#D90429" }}>{user.displayName}</Text>
            </Text>
          ) : (
            <Text style={[styles.textLight, { fontSize: 36, lineHeight: 44 }]}>
              Hey, <Text style={{ color: "#D90429" }}>Anonymous</Text>
            </Text>
          )}
          <Pressable onPress={toggleDialog}>
            <EvilIcons name="user" size={44} color="#EDF2F4" />
          </Pressable>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={[styles.textLight, styles.date]}>{months[date.getMonth()]} {date.getDate()}</Text>
          <Text style={styles.clock}>
            {date.getHours()}:{date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}
          </Text>
        </View>
      </View>
      
      {/* Bottom Section */}
      <View style={styles.botCont}>
        {/* Leaving Soon Section */}
        <View style={{ height: 176 }}>
          <TouchableOpacity onPress={() => router.navigate("../leavingsoon")}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
              <Text style={styles.sectionTitle}>Leaving soon</Text>
              <AntDesign name="arrowright" size={24} color="black" />
            </View>
          </TouchableOpacity>
          {!isLoaded ? <></> : 
          <ScrollView horizontal contentContainerStyle={styles.carousel} showsHorizontalScrollIndicator={false}>
            {leavingSoon.map((ride, i) => (
              <View key={i} style={{ marginRight: 8 }}>
                <TouchableOpacity onPress={() => router.navigate(`/ride/${ride.id}`)}>
                  <View style={styles.tile}>
                    <Text style={styles.tileText}>{ride.rideData.from + "\nto\n" + ride.rideData.to}</Text>
                  </View>
                  <Text style={styles.subTileText}>{getTimeLeft(ride.rideData.date)}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          }
        </View>

        {/* Recently Added Section */}
        <View style={{ height: 176 }}>
          <TouchableOpacity onPress={() => router.navigate("../recentlyadded")}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
              <Text style={styles.sectionTitle}>Recently added</Text>
              <AntDesign name="arrowright" size={24} color="black" />
            </View>
          </TouchableOpacity>
          {!isLoaded ? <></> : 
            <ScrollView horizontal contentContainerStyle={styles.carousel} showsHorizontalScrollIndicator={false}>
              {recentlyAdded.map((ride, i) => (
                <View key={i} style={{ marginRight: 8 }}>
                  <TouchableOpacity onPress={() => router.navigate(`/ride/${ride.id}`)}>
                  <View style={styles.tile}>
                    <Text style={styles.tileText}>{ride.rideData.from + "\nto\n" + ride.rideData.to}</Text>
                  </View>
                  <Text style={styles.subTileText}>{getTimeLeft(ride.rideData.date)}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          }
        </View>
      </View>

      {/* Account Menu Dialog */}
      <Dialog
        isVisible={dialogVisible}
        onBackdropPress={toggleDialog}
        overlayStyle={{ backgroundColor: "#EDF2F4" }}
      >
        <Dialog.Title title="Account menu" />
        <Text>Name: {user ? user.displayName : ""}</Text>
        <Text>Email: {user ? user.email : ""}</Text>
        <Dialog.Actions>
          <Button
            buttonStyle={[styles.button, { borderColor: "#D90429" }]}
            titleStyle={[styles.buttonLabel, { color: "#D90429" }]}
            title="Sign out"
            type="outline"
            icon={<AntDesign name="logout" size={16} color="#D90429" />}
            onPress={goLogOut}
          />
        </Dialog.Actions>
      </Dialog>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: 148,
  },
  tileText: {
    color: "#EDF2F4",
    textAlign: "center",
    fontSize: 18,
    lineHeight: 24,
  },
  subTileText: {
    color: "#D90429",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  button: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

