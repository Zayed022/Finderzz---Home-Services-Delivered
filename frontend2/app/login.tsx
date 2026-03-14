import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import API from "@/services/api";
import * as SecureStore from "expo-secure-store";
import { saveToken } from "@/utils/auth";

export default function Login() {

  const [phone,setPhone] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const login = async () => {

    if(!phone || !password){
      Alert.alert("Error","Please enter phone and password");
      return;
    }

    try {
      setLoading(true);
    
      const res = await API.post("/worker/login", {
        phone,
        password
      });
      
      console.log("FULL RESPONSE:", res);
      console.log("RESPONSE DATA:", res.data);
      
      const token = res.data?.token;
      
      if (!token) {
        throw new Error("Token not received");
      }
      
      await saveToken(String(token));
      
      await SecureStore.setItemAsync(
        "worker",
        JSON.stringify(res.data.worker)
      );
      
      router.replace("/(tabs)");
    
    } catch (err:any) {
    
      console.log("AXIOS ERROR:", err);
      console.log("MESSAGE:", err.message);
      console.log("REQUEST:", err.request);
      console.log("RESPONSE:", err.response);
    
      Alert.alert(
        "Login Failed",
        err?.response?.data?.message || err?.message || "Network Error"
      );
    
    } finally {
      setLoading(false);
    }
  };

  return (

    <View style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>
        Worker Login
      </Text>

      <Text style={styles.subtitle}>
        Login to manage your jobs
      </Text>

      {/* Card */}
      <View style={styles.card}>

        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#9ca3af"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={login}
          disabled={loading}
        >

          {loading ? (
            <ActivityIndicator color="#fff"/>
          ) : (
            <Text style={styles.loginText}>
              Login
            </Text>
          )}

        </TouchableOpacity>

      </View>

      {/* Register Link */}

      <View style={styles.registerRow}>

        <Text style={styles.registerText}>
          Don't have an account?
        </Text>

        <TouchableOpacity
          onPress={()=>router.push("/register")}
        >
          <Text style={styles.registerButton}>
            Register
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    padding:25,
    backgroundColor:"#f5f6fa"
  },

  title:{
    fontSize:28,
    fontWeight:"bold",
    textAlign:"center",
    marginBottom:5
  },

  subtitle:{
    textAlign:"center",
    color:"#666",
    marginBottom:30
  },

  card:{
    backgroundColor:"#fff",
    padding:20,
    borderRadius:12,
    shadowColor:"#000",
    shadowOpacity:0.1,
    shadowOffset:{width:0,height:4},
    elevation:5
  },

  input:{
    borderWidth:1,
    borderColor:"#ddd",
    borderRadius:8,
    padding:12,
    marginBottom:15
  },

  loginButton:{
    backgroundColor:"#2563eb",
    padding:14,
    borderRadius:8,
    alignItems:"center"
  },

  loginText:{
    color:"#fff",
    fontWeight:"bold",
    fontSize:16
  },

  registerRow:{
    flexDirection:"row",
    justifyContent:"center",
    marginTop:25
  },

  registerText:{
    color:"#666"
  },

  registerButton:{
    color:"#2563eb",
    fontWeight:"bold",
    marginLeft:5
  }

});