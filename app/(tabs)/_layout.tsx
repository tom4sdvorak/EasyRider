import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#D90429",
        tabBarInactiveTintColor: "#EDF2F4",
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="findride"
        options={{
          title: 'Find Ride',
          tabBarIcon: () => <AntDesign name="search1" size={24} color="#EDF2F4" />,
          tabBarLabel: ({focused, color}) => <Text style={[{borderBottomWidth: focused ? 1 : 0}, styles.tab]}>Find Ride</Text>,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => <AntDesign name="home" size={24} color="#EDF2F4" />,
          tabBarLabel: ({focused, color}) => <Text style={[{borderBottomWidth: focused ? 1 : 0}, styles.tab]}>Home</Text>,
        }}
      />
      <Tabs.Screen
        name="addride"
        options={{
          title: 'Add Ride',
          tabBarIcon: () => <AntDesign name="pluscircleo" style={styles.icon} size={24} color="#EDF2F4" />,
          tabBarLabel: ({focused, color}) => <Text style={[{borderBottomWidth: focused ? 1 : 0}, styles.tab]}>Add Ride</Text>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#2B2D42",
    height: 64,
  },
  tab: {
    fontSize: 14,
    lineHeight: 20,
    borderColor: "#D90429",
    color: "#EDF2F4",
  },
  icon: {
  },
  tabItem: {
  }
});