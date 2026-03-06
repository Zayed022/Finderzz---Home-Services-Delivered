import * as SecureStore from "expo-secure-store";

export const getWorker = async () => {

  const worker = await SecureStore.getItemAsync("worker");

  console.log("SECURE STORE WORKER:", worker);

  return worker ? JSON.parse(worker) : null;

};