import { Redirect, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable, TextInput, FlatList, ScrollView} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from "react";
import { getCities, getLatLng } from "@/hooks/location";
import { saveRide } from "@/hooks/storage";
import { ListItem } from '@rneui/themed';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { getRideById } from "@/hooks/storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from '@rneui/themed';

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

export default function RideDetails() {
  const [region, setRegion] = useState({
    latitude: 62.3100964,
    longitude: 25.6890595,
    latitudeDelta: 6,
    longitudeDelta: 6,
  });
  const [countdown, setCountdown] = useState({days: 0, hours: 0, minutes: 0, seconds: 0}); 
  const local = useLocalSearchParams();
  const [rideData, setRideData] = useState<RideData>();
  const [fromCoord, setFromCoord] = useState({latitude: 0, longitude: 0});
  const [toCoord, setToCoord] = useState({latitude: 0, longitude: 0});
  const [changeRegion, setChangeRegion] = useState(false);
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const insets = useSafeAreaInsets();
  const [joined, setJoined] = useState(false);

  useEffect(()=>{
    fetchRide().catch(console.error);;
  }, []);

  const updateCountdown = () => { 
    if(rideData != null){
      let deltaTime = rideData.date.getTime() - new Date().getTime();
      let newCountdown = {
        days: Math.floor(deltaTime / (1000 * 60 * 60 * 24)),
        hours: Math.floor((deltaTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((deltaTime % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((deltaTime % (1000 * 60)) / 1000)
      }
      setCountdown(newCountdown);
    }
  };

  useEffect(()=>{
    let newRegion = { ...region };
    if(fromCoord.latitude > 0 && toCoord.latitude > 0){
      newRegion.latitude = (fromCoord.latitude+toCoord.latitude)/2;
      newRegion.longitude = (fromCoord.longitude+toCoord.longitude)/2;
      newRegion.latitudeDelta = Math.abs(toCoord.latitude-fromCoord.latitude)+0.5;
      newRegion.longitudeDelta = Math.abs(toCoord.longitude-fromCoord.longitude)+0.5;
    }
    else if(fromCoord.latitude > 0){
      newRegion = {...newRegion, ... fromCoord};
    }
    else if(toCoord.latitude > 0){
      newRegion = {...newRegion, ... toCoord};
    }
    setRegion(newRegion);
    setChangeRegion(!changeRegion);
  },[fromCoord,toCoord]);

  useEffect(()=>{
    if(mapRef.current){
      (mapRef.current as MapView).animateToRegion(region);
    }
  }, [changeRegion]);

  useEffect(()=>{
    setIsLoaded(true);
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [rideData])

  const fetchRide = async()=>{
    try {
      let ride:RideData = await getRideById(local.ride.toString());
      setRideData(ride);
      setFromCoord(getLatLng(ride.from));
      setToCoord(getLatLng(ride.to));
    }
    catch (e){
      console.log(e);
    }
  }

    return (
      <SafeAreaView style={[styles.container, {marginTop: insets.top}]}>
        <Stack.Screen options={{headerTransparent: true, headerTitle: (rideData ? rideData.from+" to "+rideData.to : "Not found"), headerStyle: {backgroundColor: "#2B2D42"}, headerTitleStyle: {color: "#EDF2F4"}, headerTintColor: "#EDF2F4"}}/>
        
          {!isLoaded ? (<Text style={[styles.label, styles.textDark]}>Loading...</Text>) : rideData ? (
            <>
            <View style={styles.topCont}>
              <MapView style={{ flex: 1 }} initialRegion={region} ref={mapRef}>
                {fromCoord.latitude > 0 ? (<></>) : (<Marker pinColor="#2B2D42" coordinate={fromCoord} />)}
                {toCoord.latitude > 0 ? (<></>) : (<Marker pinColor="#D90429" coordinate={toCoord} />)}
              </MapView>
              <View style={{paddingVertical: 16}}>
                <Text style={styles.title}>
                  {rideData.from+' '}
                  <AntDesign name="arrowright" size={24} color="#EDF2F4" />
                  {' '+rideData.to}
                </Text>
              </View>
              {countdown.days < 1 ? (
                <View style={{paddingBottom: 16}}>
                  <Text style={[styles.textLight, styles.label]}>Leaving in:</Text>
                  <Text style={styles.clock}>
                  {countdown.hours < 10 ? "0" + countdown.hours : countdown.hours}:{countdown.minutes < 10 ? "0" + countdown.minutes : countdown.minutes}
                    <Text style={{ fontSize: 16 }}>
                      {countdown.seconds < 10 ? "0" + countdown.seconds : countdown.seconds}
                    </Text>
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={styles.botCont}>
              <View>
                <View style={styles.detailRow}>
                  <Text style={[styles.textDark, {fontSize: 22, textAlign: "left", lineHeight: 24}]}>Price (€)</Text><Text style={[styles.textDark, {fontSize: 22, textAlign: "right", lineHeight: 24}]}>{rideData.price+",00"}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.textDark, {fontSize: 16, textAlign: "left", lineHeight: 24}]}>Seats (Total)</Text><Text style={[styles.textDark, {fontSize: 16, textAlign: "right", lineHeight: 24}]}>{(rideData.seatsTotal-rideData.seatsTaken)+' ('+rideData.seatsTotal+')'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.textDark, {fontSize: 16, textAlign: "left", lineHeight: 24}]}>Date of departure</Text><Text style={[styles.textDark, {fontSize: 16, textAlign: "right", lineHeight: 24}]}>{rideData.date.getDate()+'/'+(1+rideData.date.getMonth())+'/'+rideData.date.getFullYear()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.textDark, {fontSize: 16, textAlign: "left", lineHeight: 24}]}>Time of departure</Text><Text style={[styles.textDark, {fontSize: 16, textAlign: "right", lineHeight: 24}]}>{rideData.date.getHours()+':'+rideData.date.getMinutes()}</Text>
                </View>
              </View>
              <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                {!joined ? 
                <Button buttonStyle={[styles.button,{borderColor: "#008000"}]} titleStyle={[styles.buttonLabel,{color: "#008000"}]} title="Join Ride" type="outline"
                icon={<AntDesign name="plus" size={24} color="#008000" />}
                onPress={()=>setJoined(true)}
                />
                :
                <Button buttonStyle={[styles.button, {borderColor: "#D90429"}]} titleStyle={[styles.buttonLabel, {color: "#D90429",}]} title="Leave Ride" type="outline"
                icon={<AntDesign name="plus" size={24} color="#D90429" />}
                onPress={()=>setJoined(false)}
                />
                }
              </View>
              
            </View>
            </>
          ) : (
            <Text style={[styles.label, styles.textDark]}>This ride does not exist</Text>
          )}
        
        
      </SafeAreaView>
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
    justifyContent: "space-evenly",
  },
  botCont: {
    flex: 1, 
    justifyContent: "space-around", 
    padding: 16,
  },
  textDark: {
    color: "#333333",
  },
  textLight: {
    color: "#EDF2F4",
  },
  clock: {
    color: "#D90429", 
    fontSize: 64, 
    lineHeight: 64, 
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
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonLabel: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "bold",
    marginLeft: 8,
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
    backgroundColor: "#8D99AE",
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
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  secondLabel: {
    fontSize: 14,
    lineHeight: 20,
    
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
  title: {
    fontSize: 32,
    lineHeight: 40,
    color: "#D90429",
    fontWeight: "bold",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#8D99AE",
    paddingVertical: 4,
  }
});


