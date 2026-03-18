import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartPreviewBar() {
  const router = useRouter();
  const items = useAppSelector((state) => state.cart.items);

  if (items.length === 0) return null;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalQty = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <SafeAreaView edges={["bottom"]} style={styles.wrapper}>
      <Pressable
        onPress={() => router.push("/cart")}
        style={({ pressed }) => [
          styles.container,
          pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
        ]}
      >
        <View style={styles.left}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{totalQty}</Text>
          </View>

          <View>
            <Text style={styles.smallText}>View Cart</Text>
            <Text style={styles.price}>₹{total}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  container: {
    backgroundColor: "#368DC5",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#0A84FF",
    shadowOpacity: 0.35,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  countBadge: {
    backgroundColor: "#FFFFFF",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  countText: {
    fontWeight: "700",
    color: "#0A84FF",
  },
  smallText: {
    color: "#E0EDFF",
    fontSize: 12,
  },
  price: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});