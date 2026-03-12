import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function RootLayout() {

  useEffect(() => {
    async function prepare() {
      try {
        // prevent splash from hiding automatically
        await SplashScreen.preventAutoHideAsync();

        // simulate loading resources
        await new Promise(resolve => setTimeout(resolve, 800));

      } catch (e) {
        console.warn(e);
      } finally {
        // always hide splash
        await SplashScreen.hideAsync();
      }
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