import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const openCamera = async () => {
    // Ask for camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      alert('Camera permission is required!');
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

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both title and description.');
      return;
    }
    // Handle form submission here (send to backend or store)
    console.log({ title, description, imageUri });
    // Reset form
    setTitle('');
    setDescription('');
    setImageUri(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={36} color="#fff" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report a Problem</Text>

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

            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            )}

            <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
              <Text style={styles.cameraText}>📷 Attach Optional Proof</Text>
            </TouchableOpacity>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  plusButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 6
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#111'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8
  },
  cameraButton: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center'
  },
  cameraText: {
    fontSize: 16,
    color: '#1e40af'
  },
  previewImage: {
    height: 120,
    width: '100%',
    borderRadius: 8,
    marginTop: 10
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  cancelBtn: {
    padding: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    width: '45%',
    alignItems: 'center'
  },
  cancelText: {
    color: '#1f2937'
  },
  submitBtn: {
    padding: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    width: '45%',
    alignItems: 'center'
  },
  submitText: {
    color: '#fff',
    fontWeight: '600'
  }
});
