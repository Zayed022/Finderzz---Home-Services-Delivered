import { View, Text, Pressable, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import API from "@/services/api";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams();
  const dispatch = useDispatch();

  const [request, response, promptAsync] =
    Google.useAuthRequest({
      clientId:
        "301444967472-sjoskpsqn3meddl52598mlja82lb0b9j.apps.googleusercontent.com",
        androidClientId:"301444967472-a4psrhndo3n90s8us13if3bbtsggleck.apps.googleusercontent.com"
    });

  useEffect(() => {
    const handleLogin = async () => {
      if (response?.type === "success") {
        const { authentication } = response;

        if (!authentication?.idToken) return;

        const res = await API.post("/users/google", {
          token: authentication.idToken,
        });

        const { token, user } = res.data;

        await SecureStore.setItemAsync("token", token);

        dispatch(setAuth({ user, token }));

        router.replace((redirect as string) || "/");
      }
    };

    handleLogin();
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Continue with Google</Text>

      <Pressable
        style={styles.button}
        disabled={!request}
        onPress={() => promptAsync({ useProxy: true })}
      >
        <Text style={styles.buttonText}>
          Sign in with Google
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#0A84FF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 18,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});