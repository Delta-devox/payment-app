import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  StyleSheet,
} from "react-native";

export default function AmountScreen({ route, navigation }) {
  const { scannedData, mobile: mobileParam } = route.params || {};
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const sliderAnim = useRef(new Animated.Value(300)).current;

  
  const mobileOrUpi = scannedData?.upiId || mobileParam || "Unknown";

  const handleTransaction = () => {
    if (!amount) {
      return alert("Please Enter amount");
    }
   
    navigation.navigate("Auth", {
      mobile: mobileOrUpi,
      amount,
      note,
    });
  };

  useEffect(() => {
    Animated.spring(sliderAnim, {
      toValue: 0,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Animated.View style={{ transform: [{ translateY: sliderAnim }] }}>
        {/* Recipient Card */}
        <View style={styles.recipientCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(scannedData?.name || mobileParam || "U")[0].toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.label}>Paying to</Text>
            <Text style={styles.recipientText}>
              {scannedData?.name || mobileParam || "Unknown"}
            </Text>
          </View>
        </View>

        {/* Amount input */}
        <TextInput
          style={styles.amountInput}
          placeholder="₹0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#A3A3A3"
        />

        {/* Note input */}
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note (optional)"
          value={note}
          onChangeText={setNote}
          placeholderTextColor="#A3A3A3"
        />

        {/* Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleTransaction}>
          <Text style={styles.nextButtonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    padding: 20,
  },
  recipientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  recipientText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#047857",
  },
  amountInput: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    fontSize: 32,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 16,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  noteInput: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    color: "#065F46",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    elevation: 2,
    shadowRadius: 3,
  },
  nextButton: {
    backgroundColor: "#059669",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
});
