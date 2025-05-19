import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

const API_URL =
  "https://admin-dash-45a67badz-arunsudhakar18s-projects.vercel.app"; // Your actual deployment URL

export default function Index() {
  const router = useRouter();
  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      if (!usn || !password) {
        setError("Please enter both USN and password");
        return;
      }

      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/student-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usn, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push({
        pathname: "/home",
        params: {
          studentData: JSON.stringify(data.student),
          message: data.message,
        },
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}

      <TextInput
        placeholder="Enter USN"
        value={usn}
        onChangeText={setUsn}
        style={{
          width: "100%",
          height: 50,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 15,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: "100%",
          height: 50,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: "#007bff",
          paddingVertical: 12,
          paddingHorizontal: 25,
          borderRadius: 5,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontSize: 16 }}>Enter</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
