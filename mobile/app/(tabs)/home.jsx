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
      quality: 1,
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

      // Create form data for image upload if exists
      let imageUrl = null;
      if (imageUri) {
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg",
          name: "upload.jpg",
        });

        // Upload image first
        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // Create post
      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: description,
          imageUrl,
          studentUsn: user.usn,
        }),
      });

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
              style={[
                styles.input,
                { backgroundColor: "#f9fafb", color: "#6b7280" },
              ]}
              value={user?.usn}
              editable={false}
            />

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
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
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
    justifyContent: "center",
    alignItems: "center",
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
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    elevation: 6,
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
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  cameraButton: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  cameraText: {
    fontSize: 16,
    color: "#1e40af",
  },
  previewImage: {
    height: 120,
    width: "100%",
    borderRadius: 8,
    marginTop: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    padding: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  cancelText: {
    color: "#1f2937",
  },
  submitBtn: {
    padding: 10,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
  imagePreviewContainer: {
    position: "relative",
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageButton: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 2,
    elevation: 2,
  },
  submitBtnDisabled: {
    backgroundColor: "#93c5fd",
  },
});
