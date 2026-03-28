import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import API from "@/services/api";
import { getWorker } from "@/utils/worker";

export default function CreateQuotation() {
  const [image, setImage] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [clientName, setClientName] = useState("");
  const [workerName, setWorkerName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load worker name
  useEffect(() => {
    const loadWorker = async () => {
      const worker = await getWorker();
      if (worker) {
        setWorkerName(worker.name);
      }
    };
    loadWorker();
  }, []);

  // 📸 Pick Image
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // 🚀 Submit
  const submitQuotation = async () => {
    try {
      if (!image) {
        return Alert.alert("Error", "Quotation image is required");
      }

      if (!clientName) {
        return Alert.alert("Error", "Client name is required");
      }

      if (!price) {
        return Alert.alert("Error", "Estimated price is required");
      }

      setLoading(true);

      const formData = new FormData();

      formData.append("description", description);
      formData.append("estimatedPrice", price);
      formData.append("workerName", workerName);
      formData.append("clientName", clientName);

      formData.append("quotationImages", {
        uri: image.uri,
        name: "quotation.jpg",
        type: "image/jpeg",
      } as any);

      await API.post("/quotation/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Quotation submitted!");

      // Reset
      setImage(null);
      setDescription("");
      setPrice("");
      setClientName("");

    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Failed to submit quotation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Quotation</Text>

      {/* Worker Name (Read Only) */}
      <Text style={styles.label}>Worker</Text>
      <TextInput
        style={[styles.input, { backgroundColor: "#e5e7eb" }]}
        value={workerName}
        editable={false}
      />

      {/* Client Name */}
      <Text style={styles.label}>Client Name</Text>
      <TextInput
        placeholder="Enter client name"
        style={styles.input}
        value={clientName}
        onChangeText={setClientName}
      />

      {/* IMAGE */}
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.preview} />
        ) : (
          <Text>Capture Quotation Image</Text>
        )}
      </TouchableOpacity>

      {/* DESCRIPTION */}
      <TextInput
        placeholder="Description (optional)"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      {/* PRICE */}
      <TextInput
        placeholder="Estimated Price"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* SUBMIT */}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={submitQuotation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Quotation</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#f4f6f8",
    },
  
    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 20,
    },
    label: {
        fontWeight: "600",
        marginBottom: 6,
      },


      
  
    imageBox: {
      height: 200,
      backgroundColor: "#e5e7eb",
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
  
    preview: {
      width: "100%",
      height: "100%",
      borderRadius: 12,
    },
  
    input: {
      backgroundColor: "#fff",
      padding: 14,
      borderRadius: 10,
      marginBottom: 12,
    },
  
    submitBtn: {
      backgroundColor: "#16a34a",
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 10,
    },
  
    submitText: {
      color: "#fff",
      fontWeight: "700",
    },
  });