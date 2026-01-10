import React, { useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  useWindowDimensions,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NotificationContext } from "../context/NotificationContext";
import { MoneyContext } from "../context/MoneyContext";

export default function SuccessScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
  const { showNotification } = useContext(NotificationContext);
  const { balance, setBalance } = useContext(MoneyContext);

  const { name = "Recipient", mobile, amount = 0 } = route.params || {};
  const recipientIdentifier = mobile || name;

  const THUMB_SIZE = 80;
  const SLIDER_CONTAINER_WIDTH = width * 0.85;
  const SLIDE_RANGE = SLIDER_CONTAINER_WIDTH - THUMB_SIZE;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(0)).current;

 
  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }).start();
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, delay: 400, useNativeDriver: true }).start();

    showNotification({
      title: "Payment Successful",
      message: `₹${amount} sent to ${recipientIdentifier}`,
      type: "success",
      duration: 3000,
    });

    const enteredAmount = parseFloat(amount);
    if (!isNaN(enteredAmount) && enteredAmount > 0) {
      setBalance(prev => {
        const prevBalance = typeof prev === "number" ? prev : Number(prev) || 0;
        return Math.max(prevBalance - enteredAmount, 0);
      });
    }

    
    const sendSms = async () => {
      if (!mobile) return;

  
      const formattedMobile = mobile.startsWith("+") ? mobile : `+91${mobile}`;

      try {
        const response = await fetch("http://192.168.1.2:5000/send-sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: formattedMobile, amount, name }),
        });

        const data = await response.json();
        if (data.success) {
          console.log("SMS sent successfully:", data.sid);
        } else {
          console.warn("SMS failed:", data.error);
        }
      } catch (error) {
        console.error(" Error sending SMS:", error);
      }
    };

    sendSms();
  }, [amount, mobile, name]);

  // Slider logic
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx >= 0 && gesture.dx <= SLIDE_RANGE) {
          slideX.setValue(gesture.dx);
          fillAnim.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SLIDE_RANGE * 0.9) {
          Animated.timing(slideX, { toValue: SLIDE_RANGE, duration: 200, useNativeDriver: false }).start(() =>
            navigation.replace("Home")
          );
          Animated.timing(fillAnim, { toValue: SLIDE_RANGE, duration: 200, useNativeDriver: false }).start();
        } else {
          Animated.spring(slideX, { toValue: 0, useNativeDriver: false }).start();
          Animated.spring(fillAnim, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const bgColor = fillAnim.interpolate({
    inputRange: [0, SLIDE_RANGE || 1],
    outputRange: ["#fff", "#16A34A"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Text style={[styles.title, { transform: [{ scale: scaleAnim }] }]}>
        Payment Successful! 🎉
      </Animated.Text>

      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        ₹{amount} sent to {recipientIdentifier}
      </Animated.Text>

      <View style={[styles.sliderContainer, { width: SLIDER_CONTAINER_WIDTH, height: THUMB_SIZE }]}>
        <Animated.View style={[styles.sliderBackground, { backgroundColor: bgColor, width: fillAnim }]} />
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.sliderThumb,
            { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: THUMB_SIZE / 2, transform: [{ translateX: slideX }] },
          ]}
        >
          <MaterialCommunityIcons name="arrow-right" size={36} color="#16A34A" />
        </Animated.View>
        <Text style={styles.sliderText}>Slide to go Home</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D1FAE5", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#047857", textAlign: "center", marginBottom: 12 },
  subtitle: { fontSize: 18, color: "#065F46", textAlign: "center", marginBottom: 40 },
  sliderContainer: { borderRadius: 40, backgroundColor: "#fff", overflow: "hidden", justifyContent: "center", position: "relative" },
  sliderBackground: { ...StyleSheet.absoluteFillObject, borderRadius: 40, left: 0 },
  sliderThumb: { backgroundColor: "#fff", justifyContent: "center", alignItems: "center", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, position: "absolute", left: 0 },
  sliderText: { position: "absolute", width: "100%", textAlign: "center", color: "#065F46", fontWeight: "600", fontSize: 16 },
});
