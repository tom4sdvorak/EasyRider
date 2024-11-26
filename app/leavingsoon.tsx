import { getEndingSoonRides } from "@/hooks/storage";
import { ListItem } from "@rneui/themed";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

// Shows list of rides ordered by how soon they leave
export default function LeavingSoon() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoaded, setLoaded] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    fetchRides().catch(console.error);
  }, []);

  const fetchRides = async () => {
    try {
      setLoaded(false);
      let data: Ride[] = await getEndingSoonRides();
      setRides(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoaded(true);
    }
  };

  const getTimeLeft = function(date: Date) {
    date = new Date(date);
    const timeLeft = (date.getTime() - Date.now()) / 1000;
    if (timeLeft < 60) {
      return Math.round(timeLeft) + " seconds";
    } else if (timeLeft < 3600) {
      return Math.round(timeLeft / 60) + " minutes";
    } else if (timeLeft < 86400) {
      return Math.round(timeLeft / 60 / 60) + " hours";
    } else {
      return Math.round(timeLeft / 60 / 60 / 24) + " day(s)";
    }
  };

  return (
    <SafeAreaView style={[styles.container, { marginTop: insets.top }]}>
      <Stack.Screen options={{ headerTransparent: true, headerTitle: "Leaving soon", headerStyle: { backgroundColor: "#2B2D42" }, headerTitleStyle: { color: "#EDF2F4" }, headerTintColor: "#EDF2F4" }} />
      {/* Mapping over our array of rides */}
      <ScrollView style={styles.botCont}>
        {!isLoaded ? (
          <Text style={[styles.label, styles.textDark]}>Loading...</Text>
        ) : rides.length > 0 ? (
          rides.map((ride, i) => (
            <TouchableOpacity key={i} onPress={() => router.navigate(`/ride/${ride.id}`)}>
              <ListItem containerStyle={styles.rideListItem} bottomDivider>
                {ride.rideData.seatsTotal < 5 ? <FontAwesome name="car" size={24} color="#2B2D42" /> : ride.rideData.seatsTotal < 15 ? <FontAwesome5 name="shuttle-van" size={24} color="#2B2D42" /> : <FontAwesome5 name="bus-alt" size={24} color="#2B2D42" />}
                <ListItem.Content>
                  <Text style={[styles.secondLabel, { color: "#D90429" }]}>Leaves in {getTimeLeft(ride.rideData.date)}</Text>
                  <ListItem.Title>
                    <Text style={[styles.label, styles.textDark]}>{ride.rideData.from} <FontAwesome name="long-arrow-right" size={16} color="#333333" /> {ride.rideData.to}</Text>
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    <Text style={[styles.subtitle, styles.textDark]}>
                      Remaining spots: {ride.rideData.seatsTotal - ride.rideData.seatsTaken}{"\n"}
                      Price: {ride.rideData.price}
                    </Text>
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron color="#2B2D42" />
              </ListItem>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={[styles.label, styles.textDark]}>No rides available.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF2F4",
  },
  botCont: {
    paddingHorizontal: 16,
  },
  textDark: {
    color: "#333333",
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "bold",
  },
  secondLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  subtitle: {
    color: "#D90429",
    fontSize: 12,
    lineHeight: 16,
  },
  rideListItem: {
    backgroundColor: "#EDF2F4",
    paddingHorizontal: 16,
  },
});