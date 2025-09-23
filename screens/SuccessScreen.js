import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  useWindowDimensions,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuccessScreen({ navigation }) {
  const { width } = useWindowDimensions();


  const SLIDER_CONTAINER_WIDTH = width * 0.8;
  const SLIDE_RANGE = SLIDER_CONTAINER_WIDTH - 60;


  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);


  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx >= 0 && gesture.dx <= SLIDE_RANGE) {
          slideX.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SLIDE_RANGE * 0.9) {
        
          Animated.timing(slideX, {
            toValue: SLIDE_RANGE,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            navigation.replace("Home");
          });
        } else {
          // Snap back
          Animated.spring(slideX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;


  const bgColor = slideX.interpolate({
    inputRange: [0, SLIDE_RANGE || 1],
    outputRange: ["#fff", "#16A34A"],
  });

  return (
    <SafeAreaView style={styles.container}>
     
      <Animated.Text
        style={[styles.title, { transform: [{ scale: scaleAnim }] }]}
      >
        ✨🎉 Payment Successful ✨🎉
      </Animated.Text>

      
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Thank you for using PaymentApp!
      </Animated.Text>

      
      <View style={[styles.sliderContainer, { width: SLIDER_CONTAINER_WIDTH }]}>
        <Animated.View
          style={[styles.sliderBackground, { backgroundColor: bgColor }]}
        />
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.sliderThumb, { transform: [{ translateX: slideX }] }]}
        >
          <Text style={styles.thumbText}>→</Text>
        </Animated.View>
        <Text style={styles.sliderText}>Slide to go Home</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D1FAE5", // soft green
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#047857",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#065F46",
    textAlign: "center",
    marginBottom: 40,
  },
  sliderContainer: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    overflow: "hidden",
    justifyContent: "center",
    position: "relative",
  },
  sliderBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
  },
  sliderThumb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  thumbText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#16A34A",
  },
  sliderText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: "#065F46",
    fontWeight: "600",
    fontSize: 16,
  },
});
