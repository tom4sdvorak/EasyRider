import { Redirect, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable, Button, TextInput, FlatList, ScrollView} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from "react";
import { getCities, getLatLng } from "../hooks/location";
import { saveRide } from "../hooks/storage";
import { ListItem } from '@rneui/themed';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

interface RideData {
  from: string,
  to: string,
  seatsTotal: number,
  seatsTaken: number,
  price: number,
  date: Date,
  participants: []
}

export default function RideDetails() {
  const [region, setRegion] = useState({
    latitude: 62.3100964,
    longitude: 25.6890595,
    latitudeDelta: 3,
    longitudeDelta: 3,
  });

  const { params } = useRoute();
  console.log("Local params: " + local);

    return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#2B2D42" />
      <Stack.Screen
        options={{
          title: local
        }}
      />
      <View style={styles.topCont}>

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

