import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import { getLatLng } from "@/hooks/location";
import { deleteRide, saveRide, getRideById } from "@/hooks/storage";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from '@rneui/themed';
import useAuth from "@/hooks/useAuth";

interface RideData {
  from: string,
  to: string,
  seatsTotal: number,
  seatsTaken: number,
  price: number,
  date: Date,
  participants: string[]
}

interface Ride {
  id: string;
  rideData: RideData,
}

// Displays detailed screen of specific ride based on id of it in route parameters
export default function RideDetails() {
  const [region, setRegion] = useState({
    latitude: 62.3100964,
    longitude: 25.6890595,
    latitudeDelta: 6,
    longitudeDelta: 6,
  });
  const { user } = useAuth();
  const [countdown, setCountdown] = useState({days: 0, hours: 0, minutes: 0, seconds: 0}); // Holds time value for countdown
  const local = useLocalSearchParams(); // Holds local parameters from route
  const [rideData, setRideData] = useState<RideData>();
  const [fromCoord, setFromCoord] = useState({latitude: 0, longitude: 0});
  const [toCoord, setToCoord] = useState({latitude: 0, longitude: 0});
  const [changeRegion, setChangeRegion] = useState(false); // functional variable that makes sure to trigger useEffect for region change
  const mapRef = useRef(null); // Will hold reference to mapview
  const [isLoaded, setIsLoaded] = useState(false);
  const insets = useSafeAreaInsets(); // Holds dimensions of screen danger zone elements
  const [joined, setJoined] = useState(false);
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [localError, setLocalError] = useState("");

  // Start by fetching the RideData of this ride
  useEffect(() => {
    fetchRide().catch(console.error);
  }, []);

  // Keeps countdown updated
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

  // Triggers when coordinates are changed, which happens when RideData are finally received. Works as described in addride.tsx
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

  // Changes mapview to new region
  useEffect(()=>{
    if(mapRef.current){
      (mapRef.current as MapView).animateToRegion(region);
    }
  }, [changeRegion]);

  // Triggered when rideData is changed (like after being loaded from storage) and sets countdown to count till departure
  useEffect(()=>{
    setIsLoaded(true);
    setButtonDisabled(false);
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [rideData])

  // Fetches the initial RideData from storage and sets coordinates for mapview
  const fetchRide = async()=>{
    try {
      let ride:RideData = await getRideById(local.ride.toString());
      setRideData(ride);
      setFromCoord(getLatLng(ride.from));
      setToCoord(getLatLng(ride.to));
      setJoined(ride.participants.includes(user.email)); // Check if current user is participant of the ride already
    }
    catch (e){
      console.log(e);
    }
  }

  // Adds user to ride list
  const joinRide = () => {
    setButtonDisabled(true); // Temporarily disable the join/leave button
    const rideToSave: RideData = {...rideData} as RideData; // Copy current ride data to new object
    
    if(rideToSave.seatsTaken >= rideToSave.seatsTotal){
      setLocalError("This ride is full.")
    }
    else{
      rideToSave.participants.push(user.email); // Add current user as participant
      rideToSave.seatsTaken += 1; // Increase the amount of seats occupied
      saveRide(rideToSave,local.ride.toString()); // Save ride (update) to storage
      setRideData(rideToSave);
      setJoined(true);
    }
    setButtonDisabled(false);    
  }

  // Removes user from ride list
  const leaveRide = () => {
    setButtonDisabled(true); // Temporarily disable the join/leave button
    const rideToSave: RideData = {...rideData} as RideData; // Copy current ride data to new object
    if(rideToSave.participants.length > 0){ // First confirm there are participants
      if(rideToSave.participants[0] === user.email){ // Then check if owner (on first position) is trying to leave and delete ride instead
        deleteRide(local.ride.toString());
        router.replace("/(tabs)");
      }
      else{ // Otherwise just remove user and update ride data
        rideToSave.participants = rideToSave.participants.filter(item => item !== user.email);
        rideToSave.seatsTaken -= 1;
        setRideData(rideToSave);
        setJoined(false);
        saveRide(rideToSave,local.ride.toString());
      }
    }
    else{
      setLocalError("You aren't in this ride.");
    }
    setButtonDisabled(false);
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
              {/* Show countdown till departure when there is less than 1 day left */}
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
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                {localError != '' ? <Text style={{color: "#D90429", alignSelf: 'center'}}>{localError}</Text> : <Text></Text>}
                {/* Switch button from join/leave depending on user */}
                {!joined ? 
                <Button disabled={buttonDisabled} buttonStyle={[styles.button,{borderColor: "#008000"}]} titleStyle={[styles.buttonLabel,{color: "#008000"}]} title="Join Ride" type="outline"
                icon={<AntDesign name="plus" size={24} color="#008000" />}
                onPress={joinRide}
                />
                :
                <Button disabled={buttonDisabled} buttonStyle={[styles.button, {borderColor: "#D90429"}]} titleStyle={[styles.buttonLabel, {color: "#D90429",}]} title="Leave Ride" type="outline"
                icon={<AntDesign name="plus" size={24} color="#D90429" />}
                onPress={leaveRide}
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
  label: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
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