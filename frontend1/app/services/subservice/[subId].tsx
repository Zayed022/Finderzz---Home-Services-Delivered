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

  const cartItems = useAppSelector((state) => state.cart.items);

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

  const serviceCartItem = cartItems.find(
    (item) =>
      item._id === data._id &&
      item.bookingType === "service"
  );

  const inspectionCartItem = cartItems.find(
    (item) =>
      item._id === data._id &&
      item.bookingType === "inspection"
  );

  const addService = () => {
    dispatch(
      addToCart({
        _id: data._id,
        name: data.name,
        price: data.customerPrice,
        duration: data.durationEstimate,
        bookingType: "service",
      })
    );
  };

  const addInspection = () => {
    dispatch(
      addToCart({
        _id: data._id,
        name: `${data.name} (Inspection)`,
        price: data.inspectionPrice,
        duration: data.inspectionDuration,
        bookingType: "inspection",
      })
    );
  };

  const increaseService = () =>
    dispatch(increaseQty(data._id));

  const decreaseService = () => {
    if (serviceCartItem?.quantity === 1) {
      dispatch(removeFromCart(data._id));
    } else {
      dispatch(decreaseQty(data._id));
    }
  };

  const increaseInspection = () =>
    dispatch(increaseQty(data._id));
  
  const decreaseInspection = () => {
    if (inspectionCartItem?.quantity === 1) {
      dispatch(removeFromCart(data._id));
    } else {
      dispatch(decreaseQty(data._id));
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* HERO */}
          <View style={styles.hero}>
            <Text style={styles.title}>{data.name}</Text>

            <Text style={styles.price}>
              ₹{data.customerPrice}
            </Text>

            <Text style={styles.subPrice}>
              Inclusive of platform fee
            </Text>

            {data.inspectionAvailable && (
              <View style={styles.badge}>
                <Ionicons
                  name="search"
                  size={14}
                  color="#B45309"
                />
                <Text style={styles.badgeText}>
                  Inspection Available
                </Text>
              </View>
            )}

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

          {/* SERVICE CARD */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Book Service
            </Text>

            {data.description && (
              <Text style={styles.description}>
                {data.description}
              </Text>
            )}

            <View style={styles.row}>
              <Text style={styles.label}>
                Service Fee
              </Text>
              <Text style={styles.value}>
                ₹{data.customerPrice}
              </Text>
            </View>

            {!serviceCartItem ? (
              <Pressable
                style={styles.primaryBtn}
                onPress={addService}
              >
                <Text style={styles.primaryText}>
                  Add Service
                </Text>
              </Pressable>
            ) : (
              <View style={styles.stepper}>
                <Pressable
                  onPress={decreaseService}
                  style={styles.stepBtn}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color="#0A84FF"
                  />
                </Pressable>

                <Text style={styles.qty}>
                  {serviceCartItem.quantity}
                </Text>

                <Pressable
                  onPress={increaseService}
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

          {/* INSPECTION CARD */}
          {data.inspectionAvailable && (
            <View style={styles.card}>
              <View style={styles.inspectHeader}>
                <Ionicons
                  name="search-outline"
                  size={18}
                  color="#F59E0B"
                />
                <Text style={styles.sectionTitle}>
                  Request Inspection
                </Text>
              </View>

              {data.inspectionDescription && (
                <Text style={styles.description}>
                  {data.inspectionDescription}
                </Text>
              )}

              <View style={styles.row}>
                <Text style={styles.label}>
                  Inspection Fee
                </Text>
                <Text style={styles.inspectPrice}>
                  ₹{data.inspectionPrice}
                </Text>
              </View>

              {!inspectionCartItem ? (
  <Pressable
    style={styles.inspectBtn}
    onPress={addInspection}
  >
    <Text style={styles.inspectBtnText}>
      Request Inspection
    </Text>
  </Pressable>
) : (
  <View style={styles.stepper}>
    <Pressable
      onPress={decreaseInspection}
      style={styles.stepBtn}
    >
      <Ionicons
        name="remove"
        size={20}
        color="#F59E0B"
      />
    </Pressable>

    <Text style={styles.qty}>
      {inspectionCartItem.quantity}
    </Text>

    <Pressable
      onPress={increaseInspection}
      style={styles.stepBtn}
    >
      <Ionicons
        name="add"
        size={20}
        color="#F59E0B"
      />
    </Pressable>
  </View>
)}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  hero: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
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

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "600",
    color: "#92400E",
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
  },

  metaText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#334155",
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 14,
    lineHeight: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: { fontSize: 14, color: "#64748B" },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16A34A",
  },

  inspectHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },

  inspectPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F59E0B",
  },

  primaryBtn: {
    backgroundColor: "#0A84FF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  primaryText: {
    color: "#FFF",
    fontWeight: "700",
  },

  inspectBtn: {
    marginTop: 14,
    backgroundColor: "#F59E0B",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  inspectBtnText: {
    color: "#FFF",
    fontWeight: "700",
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF6FF",
    borderRadius: 18,
    paddingHorizontal: 12,
    justifyContent: "center",
  },

  stepBtn: { padding: 10 },

  qty: {
    fontSize: 16,
    fontWeight: "700",
    width: 40,
    textAlign: "center",
  },
});