import { Button } from "react-native";
import { removeToken } from "@/utils/auth";
import { router } from "expo-router";

export default function Profile() {

  const logout = async () => {

    await removeToken();

    router.replace("/login");

  };

  return <Button title="Logout" onPress={logout} />;
}