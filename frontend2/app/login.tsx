import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import { saveToken } from "@/utils/auth";
import API from "@/services/api";
import * as SecureStore from "expo-secure-store";

export default function Login() {

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
  
      const res = await API.post("/worker/login", {
        phone,
        password,
      });
  
      console.log("LOGIN RESPONSE:", res.data);
  
      await SecureStore.setItemAsync(
        "worker",
        JSON.stringify(res.data.worker)
      );
  
      await saveToken(res.data.token);
  
      router.replace("/(tabs)");
  
    } catch (err:any) {
  
      console.log("LOGIN ERROR:", err);
  
      Alert.alert(
        "Login Failed",
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={{ padding:20 }}>

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={{ borderWidth:1, marginBottom:10, padding:10 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth:1, marginBottom:20, padding:10 }}
      />

      <Button title="Login" onPress={login} />

    </View>
  );
}