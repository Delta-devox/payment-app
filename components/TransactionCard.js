import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function getAvatarColor(name) {
  const colors = [
    "#BBF7D0", // light green
    "#BFDBFE", // light blue
    "#E9D5FF", // light purple
    "#FDE68A", // light yellow
    "#FBCFE8", // light pink
    "#FED7AA", // light orange
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
  const bgColor = getAvatarColor(tx.name);

  return (
    <View style={styles.card}>
      {/* Avatar Circle */}
      <View style={[styles.avatar, { backgroundColor: bgColor }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      {/* Name & Status */}
      <View style={styles.details}>
        <Text style={styles.name}>{tx.name}</Text>
        {isFailed ? (
          <View style={styles.failedRow}>
            <MaterialCommunityIcons name="close-circle-outline" size={16} color="#DC2626" />
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
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#065F46",
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    color: "#064E3B",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  failedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  failedText: {
    color: "#DC2626",
    fontSize: 14,
    marginLeft: 4,
  },
  amount: {
    fontWeight: "600",
    fontSize: 16,
  },
});
