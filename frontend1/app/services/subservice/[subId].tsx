import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Pressable,
  StatusBar,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "@/store/slices/cartSlice";

export default function SubServiceDetails() {
  const { subId } = useLocalSearchParams();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(
    (state) => state.cart.items
  );

  const { data, isLoading } = useQuery({
    queryKey: ["subservice-details", subId],
    queryFn: async () => {
      const res = await API.get(`/subService/${subId}`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  if (!data) return null;

  const cartItem = cartItems.find(
    (item) => item._id === data._id
  );

  const handleAdd = () => {
    dispatch(
      addToCart({
        _id: data._id,
        name: data.name,
        price: data.customerPrice,
        duration: data.durationEstimate,
        quantity: 1,
      })
    );
  };

  const handleIncrease = () =>
    dispatch(increaseQty(data._id));

  const handleDecrease = () => {
    if (cartItem?.quantity === 1) {
      dispatch(removeFromCart(data._id));
    } else {
      dispatch(decreaseQty(data._id));
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF"
        translucent={false} />
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* ===== HERO SECTION ===== */}
          <View style={styles.hero}>
            <Text style={styles.title}>
              {data.name}
            </Text>

            <Text style={styles.price}>
              ₹{data.customerPrice}
            </Text>

            <Text style={styles.subPrice}>
              Inclusive of platform fee
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color="#64748B"
                />
                <Text style={styles.metaText}>
                  {data.durationEstimate} mins
                </Text>
              </View>

              <View style={styles.metaChip}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={14}
                  color="#64748B"
                />
                <Text style={styles.metaText}>
                  Verified Professional
                </Text>
              </View>
            </View>
          </View>

          {/* ===== PRICING CARD ===== */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Pricing Details
            </Text>

            {data.platformFee !== undefined && (
              <View style={styles.row}>
                <Text style={styles.label}>
                  Platform Fee
                </Text>
                <Text style={styles.value}>
                  ₹{data.platformFee}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>
                Total Amount
              </Text>
              <Text style={styles.totalValue}>
                ₹{data.customerPrice}
              </Text>
            </View>
          </View>

          {/* ===== DESCRIPTION ===== */}
          {data.description && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                About this service
              </Text>
              <Text style={styles.description}>
                {data.description}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* ===== PREMIUM BOTTOM BAR ===== */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomPrice}>
              ₹{data.customerPrice}
            </Text>
            <Text style={styles.bottomSub}>
              Per service
            </Text>
          </View>

          {!cartItem ? (
            <Pressable
              style={styles.primaryBtn}
              onPress={handleAdd}
            >
              <Text style={styles.primaryText}>
                Add to Cart
              </Text>
            </Pressable>
          ) : (
            <View style={styles.stepper}>
              <Pressable
                onPress={handleDecrease}
                style={styles.stepBtn}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color="#0A84FF"
                />
              </Pressable>

              <Text style={styles.qty}>
                {cartItem.quantity}
              </Text>

              <Pressable
                onPress={handleIncrease}
                style={styles.stepBtn}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color="#0A84FF"
                />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  hero: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 6,
    marginTop:30
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },

  price: {
    fontSize: 26,
    fontWeight: "800",
    color: "#16A34A",
    marginTop: 8,
  },

  subPrice: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 18,
    gap: 12,
  },

  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
  },

  metaText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 22,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0F172A",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    color: "#64748B",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#16A34A",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bottomPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  bottomSub: {
    fontSize: 12,
    color: "#64748B",
  },

  primaryBtn: {
    backgroundColor: "#0A84FF",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF6FF",
    borderRadius: 18,
    paddingHorizontal: 12,
  },

  stepBtn: {
    padding: 10,
  },

  qty: {
    fontSize: 16,
    fontWeight: "700",
    width: 40,
    textAlign: "center",
  },
});