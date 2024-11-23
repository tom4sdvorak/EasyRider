import { Redirect, useRouter } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable, Button, TextInput, FlatList, ScrollView} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { getCities, getLatLng } from "../../hooks/location";
import { ListItem } from '@rneui/themed';
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function AddRide() {
  const [region, setRegion] = useState({
    latitude: 62.3100964,
    longitude: 25.6890595,
    latitudeDelta: 7,
    longitudeDelta: 7,
  });

  const [cities, setCities] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [fromExpanded, setFromExpanded] = useState(false);
  const [to, setTo] = useState("");
  const [toExpanded, setToExpanded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  

  useEffect(()=>{
    setCities(getCities());
  }, []);

  const trySubmit = ()=>{
    console.log("Pressed submit");

  }

  const getCoord = (type: String) => {
    console.log("Called coorindates"+type);
    if(type === "from" && from != ""){
      const data = getLatLng(from);
      return {latitude: data[0], longitude: data[1]}
    }
    else if(type === "to" && to != ""){
      const data = getLatLng(to);
      return {latitude: data[0], longitude: data[1]}
    }
    else{
      return {latitude: 0, longitude: 0}
    }
    
  }

  const datePickerAction = (event: DateTimePickerEvent, newDate: Date)=>{
    setDate(newDate);
    setShowDatePicker(false);
  }

  const timePickerAction = (event: DateTimePickerEvent, newDate: Date)=>{
    setTime(newDate);
    setShowTimePicker(false);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#2B2D42" />
      <View style={styles.topCont}>
        <MapView style={{flex: 1}} initialRegion={region}>
          {to==="" ? <></> : <Marker pinColor="#D90429" coordinate={getCoord("to")}></Marker>}
          {from==="" ? <></> : <Marker pinColor="#2B2D42" coordinate={getCoord("from")}></Marker>}
        </MapView>
      </View>
      <View style={styles.botCont}>
        <View style={{}}>
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
            </ListItem.Accordion>
          </ScrollView>
        </View>
        <View style={{width: "100%"}}>
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
            </ListItem.Accordion>
          </ScrollView>
        </View>

        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <View style={{flex: 1, marginRight: 16}}>
            <Text style={[styles.secondLabel, styles.textDark]}>Seats</Text>
            <TextInput inputMode="numeric" keyboardType='numeric' style={styles.input}></TextInput>
          </View>
          <View style={{flex: 2}}>
            <Text style={[styles.secondLabel, styles.textDark]}>Date</Text>
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
            <TextInput inputMode="numeric" keyboardType='numeric' style={styles.input}></TextInput>
          </View>
          <View style={{flex: 2}}>
            <Text style={[styles.secondLabel, styles.textDark]}>Date</Text>
            <Pressable onPressIn={()=>setShowTimePicker(true)}><TextInput readOnly={true} style={styles.input} value={time.getHours()+':'+(time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes())}></TextInput></Pressable>
            {showTimePicker && 
            <RNDateTimePicker mode="time" value={new Date()} timeZoneName={'Europe/Helsinki'} 
                    minimumDate={new Date()} maximumDate={new Date(2030, 10, 20)}
                    onChange={timePickerAction}
            /> }
          </View>
        </View>

        <Pressable style={[styles.button, styles.buttonPrimary]} onPress={trySubmit}>
          <Text style={[{color: "#EDF2F4"}, styles.buttonLabel]}>Submit ride</Text>
        </Pressable>
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

