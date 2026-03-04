import * as SecureStore from "expo-secure-store";

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync("worker_token", token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync("worker_token");
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync("worker_token");
};