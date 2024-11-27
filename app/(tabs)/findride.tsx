import { useRouter } from "expo-router";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ListItem } from "@rneui/themed";
import { getCities } from "@/hooks/location";
import { getAllRides } from "@/hooks/storage";

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

// Controls Find Ride screen
export default function FindRide() {
  const [fromExpanded, setFromExpanded] = useState(false); // Controls state of dropdown menu
  const [toExpanded, setToExpanded] = useState(false);  // Controls state of dropdown menu
  const [cities, setCities] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoaded, setLoaded] = useState(false);
  const router = useRouter();

  // On first load, import the list of cities
  useEffect(() => {
    setCities(getCities());
  }, []);

  // Refetch list of all rides whenever user changes from/to destination
  useEffect(() => {
    fetchRides().catch(console.error);
  }, [from, to]);

  const fetchRides = async () => {
    try {
      setLoaded(false);
      const data: Ride[] = await getAllRides(from, to);
      setRides(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoaded(true);
    }
  };

  const getTimeLeft = (date: Date) => {
    date = new Date(date);
    const timeLeft = (date.getTime() - Date.now()) / 1000;
    if (timeLeft < 60) return Math.round(timeLeft) + " seconds";
    else if (timeLeft < 3600) return Math.round(timeLeft / 60) + " minutes";
    else if (timeLeft < 86400) return Math.round(timeLeft / 3600) + " hours";
    else return Math.round(timeLeft / 86400) + " day(s)";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* List of Cities to choose starting point */}
      <View>
        <ScrollView>
          <ListItem.Accordion
            containerStyle={styles.list}
            content={
              <>
                <ListItem.Content>
                  <ListItem.Subtitle>
                    <Text style={styles.subtitle}>Starting at?</Text>
                  </ListItem.Subtitle>
                  <ListItem.Title style={styles.title}>
                    <Text>{from}</Text>
                  </ListItem.Title>
                </ListItem.Content>
              </>
            }
            icon={<AntDesign name="down" size={24} color="#EDF2F4" />}
            isExpanded={fromExpanded}
            onPress={() => setFromExpanded(!fromExpanded)}
          >
            {cities.map((city, i) => (
              <ListItem
                containerStyle={styles.listItem}
                key={i}
                bottomDivider
                onPress={() => {
                  setFrom(city);
                  setFromExpanded(false);
                }}
              >
                <ListItem.Content>
                  <ListItem.Title style={[styles.textDark, styles.listText]}>
                    <Text>{city}</Text>
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </ListItem.Accordion>
        </ScrollView>
      </View>

      {/* List of Cities to choose destination */}
      <View>
        <ScrollView>
          <ListItem.Accordion
            containerStyle={styles.list}
            content={
              <ListItem.Content>
                <ListItem.Subtitle>
                  <Text style={styles.subtitle}>Going where?</Text>
                </ListItem.Subtitle>
                <ListItem.Title style={styles.title}>
                  <Text>{to}</Text>
                </ListItem.Title>
              </ListItem.Content>
            }
            icon={<AntDesign name="down" size={24} color="#EDF2F4" />}
            isExpanded={toExpanded}
            onPress={() => setToExpanded(!toExpanded)}
          >
            {cities.map((city, i) => (
              <ListItem
                containerStyle={styles.listItem}
                key={i}
                bottomDivider
                onPress={() => {
                  setTo(city);
                  setToExpanded(false);
                }}
              >
                <ListItem.Content>
                  <ListItem.Title style={[styles.textDark, styles.listText]}>
                    <Text>{city}</Text>
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </ListItem.Accordion>
        </ScrollView>
      </View>

      {/* Mapping over array of rides */}
      <View style={styles.botCont}>
        {!isLoaded ? (
          <Text style={[styles.label, styles.textDark, {textAlign: "center"}]}><ActivityIndicator color="#333333"/> Loading...</Text>
        ) : rides.length > 0 ? (
          rides.map((ride, i) => (
            <TouchableOpacity key={i} onPress={() => router.navigate(`/ride/${ride.id}`)}>
              <ListItem containerStyle={styles.rideListItem} bottomDivider>
                {ride.rideData.seatsTotal < 5 ? (
                  <FontAwesome name="car" size={24} color="#2B2D42" />
                ) : ride.rideData.seatsTotal < 15 ? (
                  <FontAwesome5 name="shuttle-van" size={24} color="#2B2D42" />
                ) : (
                  <FontAwesome5 name="bus-alt" size={24} color="#2B2D42" />
                )}
                <ListItem.Content>
                  <Text style={[styles.secondLabel, { color: "#D90429" }]}>
                    Leaves in {getTimeLeft(ride.rideData.date)}
                  </Text>
                  <ListItem.Title>
                    <Text style={[styles.label, styles.textDark]}>
                      {ride.rideData.from} <FontAwesome name="long-arrow-right" size={16} color="#333333" />{" "}
                      {ride.rideData.to}
                    </Text>
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    <Text style={[styles.subtitle, styles.textDark]}>
                      Remaining spots: {ride.rideData.seatsTotal - ride.rideData.seatsTaken}
                      {"\n"}Price: {ride.rideData.price}
                    </Text>
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron color="#2B2D42" />
              </ListItem>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={[styles.label, styles.textDark, {textAlign: "center"}]}>No rides available.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF2F4",
  },
  botCont: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  textDark: {
    color: "#333333",
  },
  list: {
    borderColor: "#D90429",
    borderBottomWidth: 3,
    backgroundColor: "#2B2D42",
  },
  listItem: {
    backgroundColor: "#EDF2F4",
    marginHorizontal: 16,
  },
  listText: {
    fontSize: 16,
    lineHeight: 24,
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
  title: {
    color: "#EDF2F4",
    fontSize: 16,
    lineHeight: 24,
  },
  rideListItem: {
    backgroundColor: "#EDF2F4",
    paddingHorizontal: 16,
  },
});
