import React from "react";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getToken } from "@/utils/auth";

export default function RootLayout() {

  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();

      if (token) {
        setInitialRoute("(tabs)");
      } else {
        setInitialRoute("login");
      }
    };

    checkAuth();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{ headerShown:false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}