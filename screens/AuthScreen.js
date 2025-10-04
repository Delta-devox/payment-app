import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function AuthScreen({ route, navigation }) {
  const { name, mobile, amount, note } = route.params || {};
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(null);

  // Animation refs
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(-150)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Biometric Auth
  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supported = await LocalAuthentication.isEnrolledAsync();
      if (hasHardware && supported) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate to pay",
          fallbackLabel: "Use PIN",
          disableDeviceFallback: true,
        });
        if (result.success) {
          navigation.replace("Success", { name, mobile, amount, note });
        } else setShowPin(true);
      } else setShowPin(true);
    })();
  }, []);

  // Animations
  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(cardAnim, {
        toValue: 0,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
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
      ]),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    if (!showPin) pulseLoop.start();
    return () => pulseLoop.stop();
  }, [showPin]);

  const handlePinSubmit = useCallback(() => {
    if (pin.length !== 4) return alert("Enter 4-digit PIN");
    navigation.replace("Success", { name, mobile, amount, note });
  }, [pin]);

  const renderPinInputs = () => {
    const pinArray = pin.split("");
    return [...Array(4)].map((_, i) => (
      <View
        key={i}
        style={[
          styles.pinCircle,
          focusedIndex === i && { borderColor: "#10B981", shadowOpacity: 0.4, shadowRadius: 8 },
        ]}
      >
        <Text style={styles.pinText}>{pinArray[i] ? "●" : ""}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={28} color="#064E3B" />
      </Pressable>

      {/* Floating Amount */}
      <Animated.View style={[styles.amountContainer, { transform: [{ translateY: cardAnim }] }]}>
        <Text style={styles.amountText}>₹{amount}</Text>
      </Animated.View>

      {/* Summary Card */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={["rgba(255,255,255,0.7)", "rgba(255,255,255,0.3)"]}
          style={styles.gradientCard}
        >
          <Text style={styles.payToLabel}>Paying to</Text>
          <Text style={styles.recipientName}>{name}</Text>
          {name !== mobile && <Text style={styles.recipientId}>{mobile}</Text>}
          {note && <Text style={styles.noteText}>{note}</Text>}
        </LinearGradient>
      </Animated.View>

      {/* Auth Section */}
      <Animated.View style={[styles.authContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {showPin ? (
          <>
            <Text style={styles.pinLabel}>Enter your UPI PIN</Text>
            <View style={styles.pinRow}>{renderPinInputs()}</View>
            <TextInput
              style={styles.hiddenInput}
              keyboardType="number-pad"
              maxLength={4}
              autoFocus
              value={pin}
              onChangeText={setPin}
              onFocus={() => setFocusedIndex(pin.length)}
              onBlur={() => setFocusedIndex(null)}
            />
            <LinearGradient colors={["#059669", "#10B981"]} style={styles.confirmButton}>
              <Pressable onPress={handlePinSubmit} style={{ width: "100%", alignItems: "center" }}>
                <Text style={styles.confirmText}>Confirm Payment</Text>
              </Pressable>
            </LinearGradient>
          </>
        ) : (
          <>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <MaterialCommunityIcons name="fingerprint" size={100} color="#10B981" />
            </Animated.View>
            <Text style={styles.fingerprintText}>Use Biometrics</Text>
            <Pressable style={styles.usePinButton} onPress={() => setShowPin(true)}>
              <Text style={styles.usePinText}>Use PIN Instead</Text>
            </Pressable>
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6FFFA",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: (Platform.OS === "android" ? StatusBar.currentHeight : 0) + 15,
    left: 20,
    zIndex: 10,
  },
  amountContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  amountText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#065F46",
    textAlign: "center",
  },
  card: {
    width: width * 0.85,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 30,
  },
  payToLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },
  recipientName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#065F46",
    marginBottom: 2,
  },
  recipientId: {
    fontSize: 16,
    color: "#047857",
    marginBottom: 6,
  },
  noteText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#6B7280",
    marginTop: 12,
    textAlign: "center",
  },
  authContainer: {
    width: width * 0.85,
    alignItems: "center",
    marginTop: 30,
  },
  pinLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 20,
  },
  pinRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  pinCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  pinText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065F46",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  confirmButton: {
    borderRadius: 20,
    width: "100%",
    marginTop: 25,
    overflow: "hidden",
    paddingVertical: 20,
    alignItems: "center",
  },
  confirmText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  fingerprintText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#065F46",
    marginTop: 20,
  },
  usePinButton: {
    marginTop: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  usePinText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
});
