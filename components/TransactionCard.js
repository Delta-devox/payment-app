import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

function getAvatarColor(name) {
  const colors = [
    ["#BBF7D0", "#22C55E"],
    ["#BFDBFE", "#3B82F6"], 
    ["#E9D5FF", "#8B5CF6"], 
    ["#FDE68A", "#FACC15"], 
    ["#FBCFE8", "#EC4899"], 
    ["#FED7AA", "#F97316"], 
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function TransactionCard({ tx }) {
  const isFailed = tx.status === "failed";
  const initial = tx.name.charAt(0).toUpperCase();
  const avatarColors = getAvatarColor(tx.name);

  return (
    <View style={styles.card}>
      {/* Avatar Circle with Gradient */}
      <LinearGradient
        colors={avatarColors}
        style={styles.avatar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.avatarText}>{initial}</Text>
      </LinearGradient>

      {/* Name & Status */}
      <View style={styles.details}>
        <Text style={styles.name}>{tx.name}</Text>
        {isFailed ? (
          <View style={styles.failedBadge}>
            <MaterialCommunityIcons name="close-circle-outline" size={14} color="#DC2626" />
            <Text style={styles.failedText}>Payment Failed</Text>
          </View>
        ) : (
          <Text style={styles.subtitle}>
            You {tx.type} {tx.amount.replace("-", "").replace("+", "")}
          </Text>
        )}
      </View>

      {/* Amount */}
      <Text
        style={[
          styles.amount,
          isFailed
            ? { color: "#B91C1C" }
            : tx.type === "paid"
            ? { color: "#DC2626" }
            : { color: "#0F766E" },
        ]}
      >
        {tx.amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "700",
    fontSize: 20,
    color: "#fff",
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  failedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  failedText: {
    color: "#B91C1C",
    fontSize: 12,
    marginLeft: 4,
  },
  amount: {
    fontWeight: "700",
    fontSize: 16,
  },
});
