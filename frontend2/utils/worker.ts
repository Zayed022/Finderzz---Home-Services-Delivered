import * as SecureStore from "expo-secure-store";

export const getWorker = async () => {

  const worker = await SecureStore.getItemAsync("worker");

  return worker ? JSON.parse(worker) : null;

};

export const removeWorker = async () => {

  await SecureStore.deleteItemAsync("worker");

};