import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from "react";
import { getCities, getLatLng } from "../../hooks/location";
import { saveRide } from "../../hooks/storage";
import { ListItem } from '@rneui/themed';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";

interface RideData {
  from: string,
  to: string,
  seatsTotal: number,
  seatsTaken: number,
  price: number,
  date: Date,
  participants: string[],
}

export default function AddRide() {
  const [region, setRegion] = useState({ // Initial region for mapview
    latitude: 62.3100964,
    longitude: 25.6890595,
    latitudeDelta: 3,
    longitudeDelta: 3,
  });

  const { user } = useAuth();
  const dateNow = new Date();
  const [cities, setCities] = useState<string[]>([]); // List of cities app allows to travel from/to
  const [error, setError] = useState('');
  const [fromExpanded, setFromExpanded] = useState(false); // Controls dropdown menu of cities list
  const [toExpanded, setToExpanded] = useState(false);  // Controls dropdown menu of cities list
  const [date, setDate] = useState(new Date(dateNow.getTime() + 3600000));  // Sets date and time for hour from now to be used as minimum value in datepicker
  const [time, setTime] = useState(new Date(dateNow.getTime() + 3600000));  // Sets date and time for hour from now to be used as minimum value in datepicker
  const [showDatePicker, setShowDatePicker] = useState(false);  // Controls if datepicker is shown or not
  const [showTimePicker, setShowTimePicker] = useState(false);  // Controls if datepicker is shown or not
  const router = useRouter();
  const mapRef = useRef(null); // Will hold reference to mapview
  const [markerFromCoordinates, setMarkerFromCoordinates] = useState({ latitude: 0, longitude: 0 }); // Holds coordinates of markers used in the mapview
  const [markerToCoordinates, setMarkerToCoordinates] = useState({ latitude: 0, longitude: 0 });  // Holds coordinates of markers used in the mapview
  const [changeRegion, setChangeRegion] = useState(false); // functional variable that makes sure to trigger useEffect for region change


  //Form data
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [seats, setSeats] = useState("1");
  const [price, setPrice] = useState("1");

  // At first, we load our list of cities
  useEffect(() => {
    setError("");
    setCities(getCities());
  }, []);

  // Whenever user changes from/to location, we get the new coordinates
  useEffect(() => {
    getCoord();
  }, [from, to]);

  // Runs whenever we need to change MapView region to updated coordinates
  useEffect(() => {
    if (mapRef.current) {
      (mapRef.current as MapView).animateToRegion(region);
    }
  }, [changeRegion]);

  // Runs when we submit ride
  const trySubmit = async ()=>{
    // Create new RideData object with user enetered data
    const rideToSave: RideData = {
      from: from,
      to: to,
      seatsTotal: parseInt(seats),
      seatsTaken: 0,
      price: parseInt(price),
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), 0),
      participants: [user.email],
    }

    // Validations
    if(rideToSave.from === "" || rideToSave.to === ""){
      setError("Incorrect city selected");
      return;
    }
    else if(isNaN(rideToSave.seatsTotal) || rideToSave.seatsTotal < 1 || rideToSave.seatsTotal > 99){
      setError("Number of seats must be between 1 and 99.");
      return;
    }
    else if(isNaN(rideToSave.price) || rideToSave.price < 0 || rideToSave.price > 1000){
      setError("Price has to be between 0 and 1000€.");
      return;
    }
    else if(rideToSave.date.getTime() <= dateNow.getTime()){
      setError("Time of departure cannot be so soon");
      return;
    }

    try {
      await saveRide(rideToSave);
    }
    catch (e) {
      if (e instanceof Error){
        setError(e.message);
      } 
    }
    finally {
      setError("");
      router.push("../(tabs)");
    }    
  }

  // Gets coordinates of the chosen cities from our saved json
  const getCoord = () => {
    let data = {latitude: 0, longitude: 0};    
    if(from != ""){
      data = getLatLng(from);
      setMarkerFromCoordinates(data);  
    }
    if(to != ""){
      data = getLatLng(to);
      setMarkerToCoordinates(data);  
    }
  }

  // Runs when coordinates of our marker were changed (like when user changed location)
  useEffect(()=>{
    let newRegion = { ...region }; // We copy current region in MapView
    if(markerFromCoordinates.latitude > 0 && markerToCoordinates.latitude > 0){
      // If both markers are in place already, we calculate new region for MapView to be centered between 2 destinations (latitude,longtitude) and zoomed just enough to show them (deltas)
      newRegion.latitude = (markerFromCoordinates.latitude+markerToCoordinates.latitude)/2;
      newRegion.longitude = (markerFromCoordinates.longitude+markerToCoordinates.longitude)/2;
      newRegion.latitudeDelta = Math.abs(markerToCoordinates.latitude-markerFromCoordinates.latitude)+1;
      newRegion.longitudeDelta = Math.abs(markerToCoordinates.longitude-markerFromCoordinates.longitude)+1;
    }
    // Otherwise, if only one location was chosen, we just change region latitude/longitude to it
    else if(markerFromCoordinates.latitude > 0){ 
      newRegion = {...newRegion, ... markerFromCoordinates};
    }
    else if(markerToCoordinates.latitude > 0){   
      newRegion = {...newRegion, ... markerToCoordinates};
    }
    setRegion(newRegion);
    setChangeRegion(!changeRegion); // Here we call our functional variable as changing region alone is not big enough change to trigger useEffect for moving mapview
  },[markerFromCoordinates,markerToCoordinates]);

  const datePickerAction = (event: DateTimePickerEvent, newDate: Date)=>{
    setDate(newDate);
    setShowDatePicker(false);
  }

  const timePickerAction = (event: DateTimePickerEvent, newDate: Date)=>{
    setTime(newDate);
    setShowTimePicker(false);
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar style="light" backgroundColor="#2B2D42" />
      {/* Map portion */}
      <View style={styles.topCont}>
        <MapView style={{flex: 1}} initialRegion={region} ref={mapRef}>
          {from==="" ? <></> : <Marker pinColor="#2B2D42" coordinate={markerFromCoordinates}></Marker>}
          {to==="" ? <></> : <Marker pinColor="#D90429" coordinate={markerToCoordinates}></Marker>}
        </MapView>
      </View>

      {/* Form portion */}
      <View style={styles.botCont}>
        <View>          
          {/* List of cities to choose starting location */}
          <Text style={[styles.label, styles.textDark]}>From?</Text>
          <ScrollView>
            <ListItem.Accordion containerStyle={styles.list}
              content={
                  <ListItem.Content>
                    <ListItem.Title style={[styles.textDark, {fontWeight: "bold"}]}>{from}</ListItem.Title>
                  </ListItem.Content>
              }
              isExpanded={fromExpanded}
              onPress={() => {
                setFromExpanded(!fromExpanded);
              }}
            >
              {cities.map((city, i) => (
                <ListItem containerStyle={styles.listItem} key={i} bottomDivider onPress={()=> {setFrom(city);setFromExpanded(false)}}>
                  <ListItem.Content>
                    <ListItem.Title style={[styles.textDark, styles.listText]}>{city}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              ))}
              <View style={{paddingBottom: 150}}></View>
            </ListItem.Accordion>
          </ScrollView>
        </View>
        <View>      
          {/* List of Cities to choose destination */}
          <Text style={[styles.label, styles.textDark]}>Where are you going?</Text>
          <ScrollView>
            <ListItem.Accordion containerStyle={styles.list}
              content={
                  <ListItem.Content>
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
              <View style={{paddingBottom: 150}}></View>
            </ListItem.Accordion>
          </ScrollView>
        </View>        
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <View style={{flex: 1, marginRight: 16}}>
            <Text style={[styles.secondLabel, styles.textDark]}>Seats</Text>
            <TextInput inputMode="numeric" keyboardType='numeric' value={seats.toString()} onChangeText={(e)=>setSeats(e)} style={styles.input}></TextInput>
          </View>
          <View style={{flex: 2}}>
            <Text style={[styles.secondLabel, styles.textDark]}>Date</Text>
            {/* ReadOnly input that displays datepicker on click */}
            <Pressable onPressIn={()=>setShowDatePicker(true)}><TextInput readOnly={true} style={styles.input} value={date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()}></TextInput></Pressable>
            {showDatePicker && 
            <RNDateTimePicker value={new Date()} timeZoneName={'Europe/Helsinki'} 
                    minimumDate={new Date()} maximumDate={new Date(2030, 10, 20)}
                    onChange={datePickerAction}
            /> }
          </View>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <View style={{flex: 1, marginRight: 16}}>
            <Text style={[styles.secondLabel, styles.textDark]}>Price (€)</Text>
            <TextInput inputMode="numeric" keyboardType='numeric' value={price.toString()} onChangeText={(e)=>setPrice(e)} style={styles.input}></TextInput>
          </View>
          <View style={{flex: 2}}>
            <Text style={[styles.secondLabel, styles.textDark]}>Time</Text>
            {/* ReadOnly input that displays datepicker on click */}
            <Pressable onPressIn={()=>setShowTimePicker(true)}><TextInput readOnly={true} style={styles.input} value={time.getHours()+':'+(time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes())}></TextInput></Pressable>
            {showTimePicker && 
            <RNDateTimePicker is24Hour={true} mode="time" value={new Date(dateNow.getTime() + 3600000)} timeZoneName={'Europe/Helsinki'} 
                    minimumDate={new Date(dateNow.getTime() + 3600000)} maximumDate={new Date(2030, 10, 20)}
                    onChange={timePickerAction}
            /> }
          </View>
        </View>
        <Text style={[styles.label,{color: "#D90429", textAlign: "center"}]}>{error != "" ? error : null}</Text>
        <Pressable style={[styles.button, styles.buttonPrimary]} onPress={trySubmit}>
          <Text style={[{color: "#EDF2F4"}, styles.buttonLabel]}>Submit ride</Text>
        </Pressable>
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
  },
  listText: {
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
  },
  secondLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  input: {
    borderRadius: 4,
    borderColor: "#8D99AE",
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 8,
    textAlign: "center",
    color: "#333333",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 8,
    borderBottomWidth: 2,
    width: "100%",
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
});

