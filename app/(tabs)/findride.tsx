import { getCities } from "@/hooks/location";
import { getAllRides } from "@/hooks/storage";
import { ListItem } from "@rneui/themed";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, Pressable, ScrollView} from "react-native";
import MapView, { Marker } from "react-native-maps";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


interface Ride {
  from: string,
  to: string,
  seatsTotal: number,
  seatsTaken: number,
  price: number,
  date: Date,
  participants: []
}

export default function FindRide() {
  const [fromExpanded, setFromExpanded] = useState(false);
  const [toExpanded, setToExpanded] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);


  useEffect(()=>{
    setCities(getCities());
    setRides(getAllRides());
  }, []);

  const getTimeLeft = function(date: Date){
    const timeLeft = (date.valueOf()-Date.now())/1000;
    
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
    <View style={styles.container}>
      <View>  {/* List of Cities to choose starting point */}    
          <ScrollView>
            <ListItem.Accordion containerStyle={styles.list}
              content={
                  <ListItem.Content>
                    <ListItem.Subtitle>Starting at?</ListItem.Subtitle>
                    <ListItem.Title style={[styles.textDark, {fontWeight: "bold"}]}>{from}</ListItem.Title>
                  </ListItem.Content>
              }
              isExpanded={toExpanded}
              onPress={() => {
                setToExpanded(!toExpanded);
              }}
            >
              {cities.map((city, i) => (
                <ListItem containerStyle={styles.listItem} key={i} bottomDivider onPress={()=> {setFrom(city);setToExpanded(false)}}>
                  <ListItem.Content>
                    <ListItem.Title style={[styles.textDark, styles.listText]}>{city}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              ))}
            </ListItem.Accordion>
          </ScrollView>
        </View>
        <View>  {/* List of Cities to choose destination */}    
          <ScrollView>
            <ListItem.Accordion containerStyle={styles.list}
              content={
                  <ListItem.Content>
                    <ListItem.Subtitle>Going where?</ListItem.Subtitle>
                    <ListItem.Title style={[styles.textDark, {fontWeight: "bold"}]}>{to}</ListItem.Title>
                  </ListItem.Content>
              }
              isExpanded={toExpanded}
              onPress={() => {
                setToExpanded(!toExpanded);
              }}
            >
              {cities.map((city, i) => (
                <ListItem containerStyle={styles.listItem} key={i} bottomDivider onPress={()=> {setTo(city);setToExpanded(false)}}>
                  <ListItem.Content>
                    <ListItem.Title style={[styles.textDark, styles.listText]}>{city}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              ))}
            </ListItem.Accordion>
          </ScrollView>
        </View>
        <View>
        {/* Mapping over our array of rides */}  
        {rides.map((ride, i) => (
          <ListItem key={i}>
            {ride.seatsTotal < 5 ? <FontAwesome name="car" size={24} color="black" /> : ride.seatsTotal < 15 ? <FontAwesome5 name="shuttle-van" size={24} color="black" /> : <FontAwesome5 name="bus-alt" size={24} color="black" />}
            <ListItem.Content>
              <Text>{getTimeLeft(ride.date)}</Text>
              <ListItem.Title>{ride.from}<FontAwesome name="long-arrow-right" size={24} color="black" />{ride.to}</ListItem.Title>
              <ListItem.Subtitle>Remaining spots: {ride.seatsTotal-ride.seatsTaken}{"\n"}
                Price: {ride.price}
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
        
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF2F4",
  },
  topCont: {
    flex: 2, 
    backgroundColor: "#2B2D42",
  },
  botCont: {
    flex: 3, 
    justifyContent: "space-evenly", 
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
    borderRadius: 4,
    borderColor: "#8D99AE",
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: "#8D99AE"
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
    lineHeight: 24
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
  }
});

