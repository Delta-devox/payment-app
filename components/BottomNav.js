import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function BottomNav({ active, navigation, openSidebar }) {
  const tabs = [
    { name: "Home", icon: "home" },
    { name: "History", icon: "history" },
    { name: "Offers", icon: "gift-outline" },
    { name: "Profile", icon: "account-circle-outline" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, i) => {
        const isActive = active === tab.name;
        const scale = useRef(new Animated.Value(isActive ? 1.2 : 1)).current;

        const handlePress = () => {
          if (tab.name === "Profile" && openSidebar) {
            openSidebar(); // open sidebar instead of navigating
          } else {
            navigation.navigate(tab.name);
          }

          Animated.spring(scale, {
            toValue: 1.2,
            friction: 3,
            useNativeDriver: true,
          }).start(() =>
            Animated.spring(scale, {
              toValue: 1,
              friction: 3,
              useNativeDriver: true,
            }).start()
          );
        };

        return (
          <Pressable
            key={i}
            style={({ pressed }) => [
              styles.tabButton,
              pressed && { opacity: 0.7 },
            ]}
            onPress={handlePress}
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <MaterialCommunityIcons
                name={tab.icon}
                size={28}
                color={isActive ? "#0F766E" : "#9CA3AF"}
              />
            </Animated.View>
            <Text style={[styles.tabText, isActive && styles.activeText]}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
