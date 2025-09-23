import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function BottomNav({ active, navigation }) {
  const tabs = [
    { name: "Home", icon: "home" },
    { name: "History", icon: "history" },
    { name: "Offers", icon: "gift-outline" },
    { name: "Profile", icon: "account-circle-outline" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, i) => (
        <TouchableOpacity
          key={i}
          style={styles.tabButton}
          onPress={() => navigation.navigate(tab.name)}
        >
          <MaterialCommunityIcons
            name={tab.icon}
            size={28}
            color={active === tab.name ? "#0F766E" : "#6B7280"} // teal for active
          />
          <Text style={[styles.tabText, active === tab.name && styles.activeText]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  activeText: {
    color: "#0F766E",
    fontWeight: "600",
  },
});
