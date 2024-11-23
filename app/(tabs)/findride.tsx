import { Redirect, useRouter } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function FindRide() {


  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: -30.559483,
          longitude: 22.937506,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        }}
        zoomControlEnabled={true}
        mapType={'standard'}
        style={styles.container}>
        <Marker
          coordinate={{
          latitude: -30.559483,
          longitude: 22.937506,
          }}
        >

        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF2F4",
    padding: 16,
  },
  secondaryCont: {
    flex: 1, 
    justifyContent: "space-evenly", 
    alignItems: "center",
  },
  logo: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
  },
  textDark: {
    color: "#333333",
    textAlign: "center",
  },
  textLight: {
    color: "#EDF2F4",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    boxSizing: "border-box",
    gap: 32,
    borderRadius: 8,
    borderBottomWidth: 2,
    width: "100%"
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
  buttonSecondary: {
    backgroundColor: '#8D99AE',
    borderBottomColor: "#333333",
  },
});