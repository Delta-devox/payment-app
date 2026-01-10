import React, { useEffect, useRef, useContext, useState } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NotificationContext } from "../context/NotificationContext";

const { width } = Dimensions.get("window");

const ICON_BY_TYPE = {
  success: "check-circle-outline",
  error: "alert-circle-outline",
  info: "information-outline",
  warn: "alert-outline",
};

export default function Notification() {
  const { payLoad, hideNotification } = useContext(NotificationContext);

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (payLoad) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 16,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -120,
          duration: 320,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    }
  }, [payLoad]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !!payLoad,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 8,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -20) hideNotification();
      },
    })
  ).current;

  if (!visible) return null;

  const type = payLoad?.type || "info";
  const iconName = ICON_BY_TYPE[type] || ICON_BY_TYPE.info;
  const bgColors = {
    success: ["#ECFDF5", "#10B981"],
    error: ["#FEE2E2", "#EF4444"],
    warn: ["#FEF3C7", "#F59E0B"],
    info: ["#DBEAFE", "#3B82F6"],
  }[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => hideNotification()}
        style={styles.touchWrap}
        {...panResponder.panHandlers}
      >
        <View style={[styles.card, { borderLeftColor: bgColors ? bgColors[1] : "#10B981" }]}>
          <View style={styles.left}>
            <View
              style={[styles.iconWrap, { borderColor: bgColors ? bgColors[1] : "#10B981" }]}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={22}
                color={bgColors ? bgColors[1] : "#10B981"}
              />
            </View>
          </View>
          <View style={styles.content}>
            <Text numberOfLines={1} style={styles.title}>{payLoad?.title}</Text>
            <Text numberOfLines={2} style={styles.message}>{payLoad?.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  touchWrap: { width: width - 24 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
  },
  left: { marginRight: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", color: "#064E3B" },
  message: { fontSize: 14, color: "#374151", marginTop: 4 },
});
