import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  PanResponder,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function ModernSidebar({ isOpen, onClose }) {
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const [accounts, setAccounts] = useState([
    { id: 1, name: "SBI", current: true },
    { id: 2, name: "HDFC", current: false },
    { id: 3, name: "ICICI", current: false },
  ]);

  const [draggingIndex, setDraggingIndex] = useState(null);
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  // Drag swap logic
  const handleSwap = (index) => {
    const currentIndex = accounts.findIndex((a) => a.current);
    if (index !== currentIndex) {
      const newAccounts = [...accounts];
      [newAccounts[currentIndex], newAccounts[index]] = [
        newAccounts[index],
        newAccounts[currentIndex],
      ];
      newAccounts.forEach((a, i) => (a.current = i === 0));
      setAccounts(newAccounts);
    }
    setDraggingIndex(null);
  };

  const menus = [
    { id: 1, label: "Change Account", icon: "account-circle-outline" },
    { id: 2, label: "Payments", icon: "currency-inr" },
    { id: 3, label: "Transaction History", icon: "history" },
    { id: 4, label: "Offers & Rewards", icon: "gift-outline" },
    { id: 5, label: "Bank Accounts", icon: "bank-outline" },
    { id: 6, label: "Settings", icon: "cog-outline" },
    { id: 7, label: "Help & Support", icon: "help-circle-outline" },
    { id: 8, label: "Logout", icon: "logout" },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && <Pressable style={styles.overlay} onPress={onClose} />}

      {/* Sidebar */}
      <Animated.View
        style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
      >
        {/* User Info */}
        <View style={styles.userSection}>
          <MaterialCommunityIcons
            name="account-circle"
            size={90}
            color="#16A34A"
          />
          <Text style={styles.userName}>AB</Text>
          <Text style={styles.userEmail}>ab@upi90989.com</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          {/* Bank Accounts */}
          <Text style={styles.sectionTitle}>Bank Accounts</Text>
          {accounts.map((acc, i) => (
            <Pressable
              key={acc.id}
              onPress={() => handleSwap(i)}
              style={[
                styles.accountCard,
                acc.current && styles.currentAccount,
                draggingIndex === i && { opacity: 0.7 },
              ]}
            >
              <MaterialCommunityIcons
                name="bank"
                size={26}
                color={acc.current ? "#FFF" : "#16A34A"}
              />
              <Text
                style={[
                  styles.accountText,
                  acc.current && { color: "#FFF", fontWeight: "600" },
                ]}
              >
                {acc.name} {acc.current ? "(Current)" : ""}
              </Text>
            </Pressable>
          ))}

          {/* Menu Items */}
          <Text style={styles.sectionTitle}>Menu</Text>
          {menus.map((m) => (
            <Pressable key={m.id} style={styles.menuItem}>
              <MaterialCommunityIcons
                name={m.icon}
                size={26}
                color="#065F46"
              />
              <Text style={styles.menuText}>{m.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.85,
    height: height,
    backgroundColor: "#E6FFFA",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 40,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  userSection: { alignItems: "center", marginBottom: 30 },
  userName: { fontSize: 22, fontWeight: "700", color: "#065F46", marginTop: 12 },
  userEmail: { fontSize: 15, color: "#047857", marginTop: 6 },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#047857",
    marginVertical: 12,
    paddingLeft: 6,
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  currentAccount: {
    backgroundColor: "#16A34A",
  },
  accountText: {
    fontSize: 17,
    marginLeft: 14,
    color: "#065F46",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  menuText: {
    fontSize: 17,
    marginLeft: 14,
    color: "#065F46",
    fontWeight: "500",
  },
});
