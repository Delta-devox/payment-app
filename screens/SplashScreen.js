  import React, { useEffect, useRef } from "react";
  import { View, Image, Text, Animated, StyleSheet } from "react-native";

  export default function SplashScreen({ navigation }) {
    const scaleAnim = useRef(new Animated.Value(0)).current; // for logo scale
    const fadeAnim = useRef(new Animated.Value(0)).current; // for text fade

    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }).start();

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => navigation.replace("Home"), 2000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <View style={styles.container}>
        <Animated.Image
          source={require("../assets/plogo .png")}
          style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
          resizeMode="contain"
        />
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          Fast Payment
        </Animated.Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#10B981", 
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
    width: 230,
    height: 230,
    borderRadius: 115, 
  },
    title: {
      marginTop: 16,
      fontSize: 26,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
  });
