import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useUser  } from "./context/UserContext";
export default function Index() {
  const router = useRouter();
  const { globalSaveUsn } = useUser();

  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // You can add validation or backend call here
    if (usn && password) {
      globalSaveUsn(usn);
      router.push("/home");
    } else {
      alert("Please enter both USN and password");
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
        style={{
          backgroundColor: "#007bff",
          paddingVertical: 12,
          paddingHorizontal: 25,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
}
