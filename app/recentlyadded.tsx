import { getCities } from "@/hooks/location";
import { getAllRides, getEndingSoonRides, getRecentlyAddedRides } from "@/hooks/storage";
import { ListItem } from "@rneui/themed";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, Pressable, ScrollView} from "react-native";
import MapView, { Marker } from "react-native-maps";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';

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

export default function RecentlyAdded() {
  const [fromExpanded, setFromExpanded] = useState(false);
  const [toExpanded, setToExpanded] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(()=>{
    fetchRides().catch(console.error);
  }, []);
  
  const fetchRides = async () => {
    try {
      setLoaded(false);
      let data : Ride[] = await getRecentlyAddedRides();
      setRides(data);
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
      return Math.round(timeLeft)+" seconds";
    }
    else if(timeLeft<3600){
      return Math.round(timeLeft/60)+" minutes";
    }
    else if(timeLeft<86400){
      return Math.round(timeLeft/60/60)+" hours";
    }
    else{
      return Math.round(timeLeft/60/60/24)+" day(s)";
    }
  }

  return (
    <SafeAreaView style={styles.container}>
        {/* Mapping over our array of rides */}  
        <ScrollView style={styles.botCont}>
          {!isLoaded ? (<Text style={[styles.label, styles.textDark]}>Loading...</Text>) : rides.length > 0 ? (
            rides.map((ride, i) => (
              <ListItem key={i} containerStyle={styles.rideListItem} bottomDivider>
                {ride.rideData.seatsTotal < 5 ? <FontAwesome name="car" size={24} color="#2B2D42" /> : ride.rideData.seatsTotal < 15 ? <FontAwesome5 name="shuttle-van" size={24} color="#2B2D42" /> : <FontAwesome5 name="bus-alt" size={24} color="#2B2D42" />}
                <ListItem.Content>
                  <Text style={[styles.secondLabel,{color: "#D90429"}]}>Leaves in {getTimeLeft(ride.rideData.date)}</Text>
                  <ListItem.Title>
                    <Text style={[styles.label, styles.textDark]}>{ride.rideData.from} <FontAwesome name="long-arrow-right" size={16} color="#333333" /> {ride.rideData.to}</Text>
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    <Text style={[styles.subtitle, styles.textDark]}>
                      Remaining spots: {ride.rideData.seatsTotal-ride.rideData.seatsTaken}{"\n"}
                      Price: {ride.rideData.price}
                    </Text>
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron color="#2B2D42"/>
              </ListItem>
            ))) : ( 
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
  list: {
    borderColor: "#D90429",
    borderBottomWidth: 3,
    backgroundColor: "#2B2D42",
  },
  listItem: {
    backgroundColor: "#EDF2F4",
    marginHorizontal: 16,
    boxShadow: "2px 3px 5px #999",
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
  input: {
    borderRadius: 4,
    borderColor: "#8D99AE",
    borderWidth: 1,
    boxSizing: "border-box",
    fontSize: 16,
    lineHeight: 24,
    padding: 8,
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
