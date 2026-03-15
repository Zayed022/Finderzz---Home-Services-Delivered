
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { useState } from "react";

export default function VerticalRequest() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState<any>({});
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["vertical", id],
    queryFn: async () => {
      const res = await API.get(`/vertical/vertical/${id}`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!data) return null;

  const validate = () => {
    if (!phone) {
      Alert.alert("Missing Field", "Phone number is required");
      return false;
    }

    if (phone.length < 10) {
      Alert.alert("Invalid Phone", "Enter a valid phone number");
      return false;
    }

    for (const field of data.dynamicFields) {
      if (field.required && !formData[field.name]) {
        Alert.alert("Missing Field", `${field.label} is required`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      await API.post("/vertical/request", {
        verticalId: id,
        phone: phone,
        responses: formData,
      });

      Alert.alert("Success", "Your request has been submitted.");

      router.back();
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: any) => {
    const isTextarea = field.type === "textarea";

    return (
      <View key={field.name} style={styles.fieldContainer}>
        <Text style={styles.label}>{field.label}</Text>

        <TextInput
          multiline={isTextarea}
          numberOfLines={isTextarea ? 4 : 1}
          style={[styles.input, isTextarea && styles.textArea]}
          placeholder={`Enter ${field.label}`}
          value={formData[field.name] || ""}
          onChangeText={(value) =>
            setFormData({
              ...formData,
              [field.name]: value,
            })
          }
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{data.name}</Text>

        {data.description && (
          <Text style={styles.subtitle}>{data.description}</Text>
        )}

        {/* Phone Number Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Dynamic Fields */}
        {data.dynamicFields.map(renderField)}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting ? "Submitting..." : "Post Request"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 20,
  },

  fieldContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },

  submitBtn: {
    backgroundColor: "#0A84FF",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
