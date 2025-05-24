import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { useUser } from "../context/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import Header from "../components/Header";

const API_URL = "https://admin-dash-ecru.vercel.app";

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [dateTime, setDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const openCamera = async () => {
    // Ask for camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert("Error", "Camera permission is required!");
      return;
    }
    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7, // Reduced quality for better performance
      base64: true, // Enable base64
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleOpenModal = () => {
    const now = new Date();
    setDateTime(now.toLocaleString());
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in both title and description.");
      return;
    }

    if (!user?.usn) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert image to base64 if exists
      let imageBase64 = null;
      if (imageUri) {
        try {
          const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          imageBase64 = `data:image/jpeg;base64,${base64}`;
        } catch (error) {
          console.error("Error converting image to base64:", error);
          Alert.alert("Error", "Failed to process image. Please try again.");
          return;
        }
      }

      // Create post with base64 image
      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: description,
          imageBase64,
          studentUsn: user.usn,
        }),
      });
      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setImageUri(null);
      setModalVisible(false);
      Alert.alert("Success", "Your post has been submitted successfully!");
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Report Issue" />
      <TouchableOpacity style={styles.plusButton} onPress={handleOpenModal}>
        <Icon name="add" size={36} color="#fff" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report a Problem</Text>

            {/* Show date and time */}
            <Text style={{ color: "#6b7280", marginBottom: 8 }}>
              {dateTime}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Title"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Enter Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            {/* Show image preview with cross icon if imageUri exists */}
            {imageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImageUri(null)}
                >
                  <MaterialIcons name="cancel" size={28} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={openCamera}
              >
                <Text style={styles.cameraText}>📷 Attach Optional Proof</Text>
              </TouchableOpacity>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  isSubmitting && styles.submitBtnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.submitText}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  plusButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#3b82f6",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 4,
  },
  cameraButton: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  cameraText: {
    color: "#4b5563",
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  cancelText: {
    color: "#4b5563",
    textAlign: "center",
    fontSize: 16,
  },
  submitBtn: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
