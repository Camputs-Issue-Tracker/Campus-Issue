import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

const Header = ({ title }) => {
  const { logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Header;
