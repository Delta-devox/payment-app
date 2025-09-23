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
  const { mobile } = route.params;
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const sliderAnim = useRef(new Animated.Value(300)).current;

  const handleNext = () => {
    if (!amount) return alert("Enter amount");
    navigation.navigate("Auth", { mobile, amount, note });
  };

  useEffect(() => {
    // Animate slider input on mount
    Animated.spring(sliderAnim, { toValue: 0, friction: 6, tension: 40, useNativeDriver: true }).start();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: sliderAnim }] }}>
        <Text style={styles.label}>Paying to: {mobile}</Text>

        <TextInput
          style={styles.amountInput}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#A3A3A3"
        />

        <TextInput
          style={styles.noteInput}
          placeholder="Add a note (optional)"
          value={note}
          onChangeText={setNote}
          placeholderTextColor="#A3A3A3"
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D1FAE5", // soft green background
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 12,
  },
  amountInput: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    fontSize: 28,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 16,
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
    shadowRadius: 3,
    elevation: 2,
  },
  nextButton: {
    backgroundColor: "#059669", // modern green
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
