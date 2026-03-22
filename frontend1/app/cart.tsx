import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "@/store/slices/cartSlice";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function CartScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* 🔥 HELPER */
  const getPayload = (item: any) => ({
    subServiceId: item.subServiceId,
    serviceId: item.serviceId,
    bookingType: item.bookingType,
  });

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <StatusBar barStyle="dark-content" />

        <Ionicons name="cart-outline" size={80} color="#CBD5E1" />

        <Text style={styles.emptyTitle}>
          Your cart is empty
        </Text>

        <Text style={styles.emptySub}>
          Browse services and add items to get started
        </Text>

        <Pressable
          style={styles.browseButton}
          onPress={() => router.push("/services")}
        >
          <Text style={styles.browseText}>
            Explore Services
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={items}
        keyExtractor={(item) =>
          `${item.subServiceId || item.serviceId}_${item.bookingType}`
        }
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 160,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const itemTotal = item.price * item.quantity;

          return (
            <View style={styles.card}>
              {/* TOP */}
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceName}>
                    {item.name}
                  </Text>

                  <Text style={styles.metaText}>
                    {item.duration} mins
                  </Text>
                </View>

                {/* REMOVE */}
                <Pressable
                  onPress={() =>
                    dispatch(removeFromCart(getPayload(item)))
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#94A3B8"
                  />
                </Pressable>
              </View>

              {/* BOTTOM */}
              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.unitPrice}>
                    ₹{item.price} / service
                  </Text>

                  <Text style={styles.totalPrice}>
                    ₹{itemTotal}
                  </Text>
                </View>

                {/* 🔥 QTY CONTROLS */}
                <View style={styles.qtyContainer}>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() =>
                      dispatch(decreaseQty(getPayload(item)))
                    }
                  >
                    <Ionicons
                      name="remove"
                      size={18}
                      color="#0A84FF"
                    />
                  </Pressable>

                  <Text style={styles.qtyText}>
                    {item.quantity}
                  </Text>

                  <Pressable
                    style={styles.qtyButton}
                    onPress={() =>
                      dispatch(increaseQty(getPayload(item)))
                    }
                  >
                    <Ionicons
                      name="add"
                      size={18}
                      color="#0A84FF"
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* ===== CHECKOUT ===== */}
      <View style={styles.checkoutContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal
          </Text>

          <Text style={styles.summaryPrice}>
            ₹{subtotal}
          </Text>
        </View>

        

        <View style={styles.divider} />

        <Pressable
          style={styles.checkoutButton}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutText}>
            Proceed to Checkout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  /* ===== EMPTY STATE ===== */

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#F8FAFC",
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  emptySub: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 6,
    textAlign: "center",
  },

  browseButton: {
    marginTop: 24,
    backgroundColor: "#0A84FF",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },

  browseText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  /* ===== CART ITEM CARD ===== */

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 22,
    marginBottom: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  serviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  metaText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },

  unitPrice: {
    fontSize: 13,
    color: "#64748B",
  },

  totalPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#16A34A",
    marginTop: 4,
  },

  /* ===== QTY CONTROLS ===== */

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF6FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },

  qtyButton: {
    padding: 8,
  },

  qtyText: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 14,
    color: "#0F172A",
  },

  /* ===== CHECKOUT SECTION ===== */

  checkoutContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontSize: 15,
    color: "#64748B",
  },

  summaryPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },

  checkoutButton: {
    backgroundColor: "#0178BD",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  checkoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});