import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { saveToken } from "@/utils/auth";
import API from "@/services/api";

export default function Login() {

  const [phone, setPhone] = useState("");

  const login = async () => {
    try {
      const res = await API.post(
        "/worker/login",
        { phone }
      );

      if (res.data.success) {

        await saveToken(res.data.token);

        router.replace("/");

      }

    } catch (err:any) {

      Alert.alert(
        "Login Failed",
        err.response?.data?.message || "Something went wrong"
      );

    }
  };

  return (
    <View>

      <TextInput
        placeholder="Phone Number"
        onChangeText={setPhone}
      />

      <Button title="Login" onPress={login} />

    </View>
  );
}