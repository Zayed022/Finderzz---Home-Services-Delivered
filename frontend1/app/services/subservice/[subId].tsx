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

  /* ================= CART MATCH ================= */

  const serviceCartItem = cartItems.find(
    (item) =>
      item.subServiceId === data._id &&
      item.bookingType === "service"
  );

  const inspectionCartItem = cartItems.find(
    (item) =>
      item.subServiceId === data._id &&
      item.bookingType === "inspection"
  );

  /* ================= ACTIONS ================= */

  const addService = () =>
    dispatch(
      addToCart({
        subServiceId: data._id,
        name: data.name,
        price: data.customerPrice,
        duration: data.durationEstimate,
        bookingType: "service",
        quantity: 1,
      })
    );

  const addInspection = () =>
    dispatch(
      addToCart({
        subServiceId: data._id,
        name: `${data.name} (Inspection)`,
        price: data.inspectionPrice,
        duration: data.inspectionDuration,
        bookingType: "inspection",
        quantity: 1,
      })
    );

  const increaseService = () =>
    dispatch(
      increaseQty({
        subServiceId: data._id,
        bookingType: "service",
      })
    );

  const decreaseService = () =>
    dispatch(
      decreaseQty({
        subServiceId: data._id,
        bookingType: "service",
      })
    );

  const increaseInspection = () =>
    dispatch(
      increaseQty({
        subServiceId: data._id,
        bookingType: "inspection",
      })
    );

  const decreaseInspection = () =>
    dispatch(
      decreaseQty({
        subServiceId: data._id,
        bookingType: "inspection",
      })
    );

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
  
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
          
          {/* 🔥 HERO */}
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
                <Ionicons name="search" size={14} color="#B45309" />
                <Text style={styles.badgeText}>
                  Inspection Available
                </Text>
              </View>
            )}
  
            {/* META */}
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={14} color="#64748B" />
                <Text style={styles.metaText}>
                  {data.durationEstimate} mins
                </Text>
              </View>
  
              <View style={styles.metaChip}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#64748B" />
                <Text style={styles.metaText}>
                  Verified Professional
                </Text>
              </View>
            </View>
  
            {/* TRUST */}
            <View style={styles.trustBox}>
              <Text style={styles.trustText}>✔ 100% Verified Professionals</Text>
              <Text style={styles.trustText}>✔ Transparent Pricing</Text>
              <Text style={styles.trustText}>✔ Service Warranty Included</Text>
            </View>
          </View>
  
          {/* 🔥 DESCRIPTION CARD */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Service Details</Text>
  
            <Text style={styles.description}>
              {data.description ||
                "Professional service delivered by trained experts using high-quality tools."}
            </Text>
  
            <Text style={styles.infoNote}>
              Final pricing may vary after inspection.
            </Text>
  
            <View style={styles.row}>
              <Text style={styles.label}>Service Fee</Text>
              <Text style={styles.value}>₹{data.customerPrice}</Text>
            </View>
          </View>
  
        </ScrollView>
  
        {/* 🔥 FIXED BOTTOM CTA */}
        <View style={styles.bottomBar}>
          {!serviceCartItem ? (
            <Pressable style={styles.primaryBtn} onPress={addService}>
              <Text style={styles.primaryText}>
                Add Service • ₹{data.customerPrice}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.stepperBottom}>
              <Pressable onPress={decreaseService} style={styles.stepBtn}>
                <Ionicons name="remove" size={22} color="#0A84FF" />
              </Pressable>
  
              <Text style={styles.qty}>
                {serviceCartItem.quantity}
              </Text>
  
              <Pressable onPress={increaseService} style={styles.stepBtn}>
                <Ionicons name="add" size={22} color="#0A84FF" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

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

  trustBox: {
    marginTop: 16,
  },

  trustText: {
    fontSize: 12,
    color: "#16A34A",
    marginBottom: 4,
    fontWeight: "600",
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
    marginBottom: 10,
    lineHeight: 20,
  },

  infoNote: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 10,
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

  inspectInfoBox: {
    backgroundColor: "#FFFBEB",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  inspectInfoText: {
    fontSize: 13,
    color: "#92400E",
    fontWeight: "600",
  },

  inspectInfoSub: {
    fontSize: 12,
    color: "#B45309",
    marginTop: 6,
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
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  
  stepperBottom: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF6FF",
    borderRadius: 20,
    paddingVertical: 10,
  },
});