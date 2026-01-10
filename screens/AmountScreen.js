import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Animated,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function AmountScreen({ route, navigation }) {
  const { scannedData, mobile: mobileParam } = route.params || {};
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const sliderAnim = useRef(new Animated.Value(300)).current;
  const borderAnim = useRef(new Animated.Value(0)).current; 
  const { width } = useWindowDimensions();

  const recipientName = scannedData?.name || mobileParam || "Unknown";
  const recipientId = scannedData?.upiId || mobileParam || "Unknown";

  const getAvatarColor = (name) => {
    const colors = ["#059669", "#047857", "#0F766E", "#065F46"];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  const handleProceed = useCallback(() => {
    if (!amount) return alert("Please enter an amount to proceed.");
    setShowConfirm(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(borderAnim, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ])
    ).start();
  }, [amount]);

  const handleConfirmPayment = useCallback(() => {
    setShowConfirm(false);
    const enteredAmount = parseFloat(amount);
    if(isNaN(enteredAmount) || enteredAmount <= 0) {
      return alert("Please enter a valid amount.");
    }

    
    navigation.navigate("Auth", {
      name: recipientName,
      mobile: recipientId,
      amount,
      note,
    });
  }, [amount, note, recipientName, recipientId]);

  useEffect(() => {
    Animated.spring(sliderAnim, {
      toValue: 0,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  };

  const inputStyle = (inputName) => [
    styles.inputBase,
    shadowStyle,
    focusedInput === inputName && { borderColor: "#059669", borderWidth: 2 },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View
        style={[{ transform: [{ translateY: sliderAnim }] }, { width: "100%" }]}
      >
     
        <View style={[styles.recipientCard, shadowStyle]}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(recipientName) }]}>
            <Text style={styles.avatarText}>{(recipientName || "U")[0].toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.label}>Paying to</Text>
            <Text style={styles.recipientText}>{recipientName}</Text>
          </View>
        </View>

        {/* Amount Input */}
        <TextInput
          style={inputStyle("amount")}
          placeholder="₹0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#A3A3A3"
          onFocus={() => setFocusedInput("amount")}
          onBlur={() => setFocusedInput(null)}
        />

        
        <TextInput
          style={inputStyle("note")}
          placeholder="Add a note (optional)"
          value={note}
          onChangeText={setNote}
          placeholderTextColor="#A3A3A3"
          onFocus={() => setFocusedInput("note")}
          onBlur={() => setFocusedInput(null)}
        />

       
        <Pressable
          style={({ pressed }) => [styles.nextButton, pressed && { opacity: 0.7 }]}
          onPress={handleProceed}
        >
          <Text style={styles.nextButtonText}>Proceed to Pay</Text>
        </Pressable>
      </Animated.View>

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={showConfirm}
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={{ borderRadius: 16, padding: 3 }}>
            <LinearGradient
              colors={["#10B981", "#047857"]}
              start={[0, 0]}
              end={[1, 1]}
              style={{ borderRadius: 16 }}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Confirm Payment</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to pay{" "}
                  <Text style={styles.modalAmount}>₹{amount}</Text> to {recipientName}?
                </Text>

                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalButton, { backgroundColor: "#E5E7EB" }]}
                    onPress={() => setShowConfirm(false)}
                  >
                    <Text style={[styles.modalButtonText, { color: "#374151" }]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, { backgroundColor: "#059669" }]}
                    onPress={handleConfirmPayment}
                  >
                    <Text style={styles.modalButtonText}>Confirm</Text>
                  </Pressable>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center", padding: 20 },
  recipientCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", padding: 20, borderRadius: 16, marginBottom: 24 },
  avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginRight: 15 },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 20 },
  label: { fontSize: 14, fontWeight: "500", color: "#6B7280" },
  recipientText: { fontSize: 18, fontWeight: "800", color: "#047857" },
  inputBase: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 16, fontSize: 20, fontWeight: "700", color: "#065F46", marginBottom: 16, textAlign: "center" },
  nextButton: { backgroundColor: "#059669", paddingVertical: 16, borderRadius: 16, alignItems: "center", marginTop: 8 },
  nextButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalContainer: { width: "100%", padding: 24, backgroundColor: "#fff", borderRadius: 16, justifyContent: "center", alignItems: "center" },
  modalTitle: { fontSize: 28, fontWeight: "700", color: "#065F46", marginBottom: 16 },
  modalText: { fontSize: 18, color: "#374151", textAlign: "center", marginBottom: 32, lineHeight: 26 },
  modalAmount: { fontWeight: "700", color: "#059669" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  modalButton: { flex: 1, paddingVertical: 16, marginHorizontal: 6, borderRadius: 12, alignItems: "center" },
  modalButtonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
