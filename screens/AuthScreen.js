import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// --- Helpers ---
function maskMobile(number) {
  if (!number || typeof number !== "string") return "Unknown";
  if (number.length < 4) return number;
  const last4 = number.slice(-4);
  return `+91 XXXXX${last4}`;
}

function maskUPI(upi) {
  if (!upi || typeof upi !== "string") return "Unknown";
  const parts = upi.split("@");
  if (parts.length !== 2) return upi;
  const name = parts[0];
  const masked = name.slice(0, 2) + "***";
  return masked + "@" + parts[1];
}

// --- Component ---
export default function AuthScreen({ route, navigation }) {
  const { mobile: mobileParam, amount, note } = route.params || {};

  // Determine if it's a mobile number or UPI ID
  const mobile =
    typeof mobileParam === "string"
      ? mobileParam
      : mobileParam?.upiId || mobileParam?.mobile || "Unknown";

  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");

  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- Biometric Authentication ---
  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supported = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && supported) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate to pay",
          fallbackLabel: "Use PIN",
        });
        if (result.success) {
          navigation.replace("Success", { mobile, amount, note });
        } else setShowPin(true);
      } else setShowPin(true);
    })();
  }, []);

  // --- Animate PIN / fingerprint view ---
  useEffect(() => {
    if (showPin) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showPin]);

  const handlePinSubmit = () => {
    if (pin.length !== 4) return alert("Enter 4-digit PIN");
    navigation.replace("Success", { mobile, amount, note });
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="#065F46" />
      </TouchableOpacity>

      {/* Amount */}
      <Text style={styles.amountText}>₹{amount}</Text>

      {/* Recipient */}
      <Text style={styles.mobileText}>
        Paying to: {mobile.includes("@") ? maskUPI(mobile) : maskMobile(mobile)}
      </Text>

      {/* Note */}
      {note ? <Text style={styles.noteText}>Note: {note}</Text> : null}

      {showPin ? (
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <Text style={styles.label}>Enter your UPI PIN</Text>
          <TextInput
            placeholder="●●●●"
            maxLength={4}
            secureTextEntry={true}
            keyboardType="number-pad"
            style={styles.pinInput}
            value={pin}
            onChangeText={setPin}
            placeholderTextColor="#A3A3A3"
          />
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handlePinSubmit}
          >
            <Text style={styles.confirmText}>Confirm Payment</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <MaterialCommunityIcons
            name="fingerprint"
            size={100}
            color="#059669"
          />
          <Text style={styles.fingerprintText}>Touch fingerprint sensor</Text>
          <TouchableOpacity
            style={styles.usePinButton}
            onPress={() => setShowPin(true)}
          >
            <Text style={styles.usePinText}>Use PIN instead</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

// --- Styles ---
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  amountText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 8,
  },
  mobileText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 6,
  },
  noteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#6B7280",
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#065F46",
    textAlign: "center",
    marginBottom: 20,
  },
  pinInput: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#065F46",
    marginBottom: 24,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButton: {
    backgroundColor: "#059669",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  fingerprintText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    color: "#065F46",
    textAlign: "center",
  },
  usePinButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  usePinText: {
    color: "#059669",
    fontWeight: "600",
    fontSize: 16,
  },
};
