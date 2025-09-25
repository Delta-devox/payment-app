import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import TransactionCard from "../components/TransactionCard";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [mobile, setMobile] = useState("");

  // Animation for quick actions
  const animValues = useRef([...Array(6)].map(() => new Animated.Value(0))).current;

  const actions = [
    { name: "Scan QR", icon: "qrcode-scan" },
    { name: "Pay Bills", icon: "file-document-outline" },
    { name: "Recharge", icon: "cellphone" },
    { name: "Balance", icon: "wallet-outline" },
    { name: "Request Money", icon: "bank-transfer" },
    { name: "Split Bill", icon: "account-group-outline" },
  ];

  const offers = [
    { id: 1, title: "10% Cashback on Recharge" },
    { id: 2, title: "Flat ₹50 off on Bills" },
    { id: 3, title: "Refer & Earn ₹100" },
  ];

  const recentTx = [
    { name: "Sarah M.", type: "paid", amount: "-₹150", status: "success" },
    { name: "Jane D.", type: "received", amount: "+₹500", status: "success" },
    { name: "Mohan S.", type: "paid", amount: "-₹200", status: "failed" },
    { name: "Dennis E.", type: "received", amount: "+₹500", status: "success" },
  ];

  // Animate quick actions on mount
  useEffect(() => {
    animValues.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        delay: i * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handlePay = () => {
    if (!mobile) {
      Alert.alert("Error", "Please enter mobile number");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      Alert.alert("Error", "Mobile number must be exactly 10 digits");
      return;
    }
    navigation.navigate("Amount", { mobile });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDF4" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialCommunityIcons name="menu" size={28} color="#065F46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Greeting Card */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingText}>Good Morning, AB 👋</Text>
          <Text style={styles.greetingBalance}>Balance: ₹5,430</Text>
        </View>

        {/* Pay Section */}
        <View style={styles.payCard}>
          <Text style={styles.sectionTitle}>Pay to mobile number</Text>
          <View style={styles.payRow}>
            <TextInput
              style={styles.payInput}
              placeholder="Enter 10-digit mobile number"
              keyboardType="number-pad"
              value={mobile}
              onChangeText={setMobile}
              placeholderTextColor="#A3A3A3"
              maxLength={10}
            />
            <TouchableOpacity style={styles.payButton} onPress={handlePay}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsScroll}>
          {actions.map((a, i) => (
            <Animated.View
              key={i}
              style={{
                opacity: animValues[i],
                transform: [
                  {
                    translateY: animValues[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <Pressable
                style={styles.actionButton}
                android_ripple={{ color: "#A7F3D0", borderless: true }}
                onPress={() => {
                  if (a.name === "Scan QR") {
                    navigation.navigate("QrScanner");
                  } else {
                    Alert.alert(a.name, "Feature coming soon!");
                  }
                }}
              >
                <MaterialCommunityIcons name={a.icon} size={28} color="#16A34A" />
                <Text style={styles.actionText}>{a.name}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Offers Section */}
        <Text style={styles.sectionTitle}>Offers & Rewards</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {offers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <Text style={styles.offerText}>{offer.title}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Recent Transactions */}
        <View style={styles.transactionSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTx.map((tx, i) => (
            <TransactionCard key={i} tx={tx} />
          ))}
        </View>
      </ScrollView>

      <BottomNav active="Home" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0FDF4" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 0,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#065F46" },
  iconButton: { padding: 8, borderRadius: 12, backgroundColor: "#ECFDF5" },
  scrollContainer: { paddingHorizontal: 16, paddingTop: 8 },
  greetingCard: {
    backgroundColor: "#16A34A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  greetingText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  greetingBalance: { color: "#D1FAE5", fontSize: 16, fontWeight: "500", marginTop: 4 },
  payCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#047857", marginBottom: 12 },
  payRow: { flexDirection: "row", alignItems: "center" },
  payInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#065F46",
    marginRight: 12,
  },
  payButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  payButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  actionsScroll: { marginBottom: 16 },
  actionButton: {
    marginRight: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  actionText: { marginTop: 6, fontSize: 12, color: "#047857" },
  offerCard: {
    width: width * 0.6,
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    marginRight: 12,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  offerText: { fontSize: 14, fontWeight: "500", color: "#065F46", textAlign: "center" },
  transactionSection: { marginBottom: 20 },
});
