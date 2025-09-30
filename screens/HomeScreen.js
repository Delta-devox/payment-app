import React, { useState, useRef, useEffect, useContext } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "../components/BottomNav";
import TransactionCard from "../components/TransactionCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionContext } from "../context/TransactionContext";
import EnhancedSidebar from "../components/Sidebar";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [mobile, setMobile] = useState("");
  const animValues = useRef([...Array(6)].map(() => new Animated.Value(0))).current;
  const { transaction } = useContext(TransactionContext);
  const recentTx = transaction.slice(0, 4);
  const [sidebarOpen, setOpen] = useState(false);

  const actions = [
    { name: "Scan QR", icon: "qrcode-scan" },
    { name: "Pay Bills", icon: "file-document-outline" },
    { name: "Recharge", icon: "cellphone" },
    { name: "Balance", icon: "wallet-outline" },
    { name: "Request Money", icon: "bank-transfer" },
    { name: "Split Bill", icon: "account-group-outline" },
  ];

  const offers = [
    { id: 1, title: "10% Cashback on Recharge", colors: ["#6EE7B7", "#3B82F6"] },
    { id: 2, title: "Flat ₹50 off on Bills", colors: ["#FECACA", "#F87171"] },
    { id: 3, title: "Refer & Earn ₹100", colors: ["#FDE68A", "#F59E0B"] },
  ];

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
    if (!mobile) return Alert.alert("Error", "Please enter mobile number");
    if (!/^\d{10}$/.test(mobile)) return Alert.alert("Error", "Mobile number must be exactly 10 digits");
    navigation.navigate("Amount", { mobile });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDF4" />

      {/* Header */}
      <LinearGradient
        colors={["#16A34A", "#22C55E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity>
          <MaterialCommunityIcons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Greeting Card */}
        <LinearGradient
          colors={["#22C55E", "#10B981"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.greetingCard}
        >
          <Text style={styles.greetingText}>Good Morning, AB 👋</Text>
          <Text style={styles.greetingBalance}>Balance: ₹5,430</Text>
        </LinearGradient>

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsScroll} contentContainerStyle={{padding:10,marginBottom:5}}>
          {actions.map((a, i) => (
            <Animated.View
              key={i}
              style={{
                opacity: animValues[i],
                transform: [
                  {
                    translateY: animValues[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
                  },
                ],
              }}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
                android_ripple={{ color: "#A7F3D0", borderless: true }}
                onPress={() => {
                  if (a.name === "Scan QR") navigation.navigate("QrScanner");
                  else Alert.alert(a.name, "Feature coming soon!");
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16, padding:10 }}>
          {offers.map((offer) => (
            <LinearGradient
              key={offer.id}
              colors={offer.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.offerCard}
            >
              <Text style={styles.offerText}>{offer.title}</Text>
            </LinearGradient>
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

      <EnhancedSidebar isOpen={sidebarOpen} onClose={() => setOpen(false)} />
      <BottomNav active="Home" navigation={navigation} openSidebar={() => setOpen(true)} />
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6FFFA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  iconButton: { padding: 10, borderRadius: 12, backgroundColor: "#10B98180" },
  scrollContainer: { paddingHorizontal: 16, paddingTop: 12 },
  greetingCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  greetingText: { color: "#fff", fontSize: 20, fontWeight: "600" },
  greetingBalance: { color: "#D1FAE5", fontSize: 18, fontWeight: "500", marginTop: 6 },
  payCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#047857", marginBottom: 14 },
  payRow: { flexDirection: "row", alignItems: "center" },
  payInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    fontSize: 16,
    color: "#065F46",
    marginRight: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  payButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  payButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  actionsScroll: { marginBottom: 20 },
  actionButton: {
    marginRight: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  actionText: { marginTop: 8, fontSize: 12, color: "#047857", fontWeight: "500" },
  offerCard: {
    width: width * 0.62,
    borderRadius: 20,
    marginRight: 14,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  offerText: { fontSize: 14, fontWeight: "500", color: "#fff", textAlign: "center" },
  transactionSection: { marginTop:10,marginBottom: 24 },
});
