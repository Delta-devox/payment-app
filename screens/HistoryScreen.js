import React, { useEffect, useRef } from "react";
import { ScrollView, Text, Animated, View, StyleSheet, StatusBar, Platform } from "react-native";
import TransactionCard from "../components/TransactionCard";

export default function HistoryScreen() {
  const transactions = [
    { name: "Sarah M.", type: "paid", amount: "-₹150", status: "success" },
    { name: "Jane D.", type: "received", amount: "+₹500", status: "success" },
    { name: "Mohan S.", type: "paid", amount: "-₹200", status: "failed" },
    { name: "Coffee Shop", type: "paid", amount: "-₹120", status: "success" },
    { name: "Lekha M.", type: "paid", amount: "-₹180", status: "failed" },
    { name: "Roopesh", type: "received", amount: "+₹750", status: "success" },
    { name: "Anita K.", type: "received", amount: "+₹300", status: "success" },
    { name: "Rohan P.", type: "paid", amount: "-₹250", status: "failed" },
    { name: "Vikram S.", type: "received", amount: "+₹600", status: "success" },
    { name: "Priya T.", type: "paid", amount: "-₹400", status: "success" },
    { name: "Amit R.", type: "received", amount: "+₹200", status: "success" },
    { name: "Neha S.", type: "paid", amount: "-₹350", status: "failed" },
    { name: "Kiran P.", type: "received", amount: "+₹450", status: "success" },
    { name: "Ritu M.", type: "paid", amount: "-₹500", status: "failed" },
    { name: "Sunny K.", type: "received", amount: "+₹700", status: "success" },
  ];

  const animValues = useRef(transactions.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animValues.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        delay: i * 100, // stagger animation
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {transactions.map((tx, i) => (
        <Animated.View
          key={i}
          style={{
            opacity: animValues[i],
            transform: [
              {
                translateX: animValues[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [i % 2 === 0 ? -50 : 50, 0], // slide from left/right alternately
                }),
              },
              {
                translateY: animValues[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0], // slide up slightly
                }),
              },
            ],
          }}
        >
          <TransactionCard tx={tx} />
        </Animated.View>
      ))}
      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 16,
    paddingHorizontal: 16,
    backgroundColor: "#F0FDF4",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 16,
  },
});
