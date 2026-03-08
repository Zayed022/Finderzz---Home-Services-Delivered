import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Keep splash visible until we hide it manually
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    async function prepare() {

      // simulate loading resources (fonts/api/etc)
      await new Promise(resolve => setTimeout(resolve, 800));

      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </Provider>
  );
}