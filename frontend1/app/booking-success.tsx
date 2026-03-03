import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";

export default function BookingSuccessScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestBooking();
  }, []);

  const loadLatestBooking = async () => {
    const data = await AsyncStorage.getItem("guest_bookings");
    if (!data) {
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(data);
    setBooking(parsed[0]);
    dispatch(clearCart());
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text>No booking found.</Text>
      </View>
    );
  }

  const subtotal = booking.subtotal;
  const extraCharge = booking.extraCharge;
  const total = booking.totalPrice;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ===== PREMIUM HEADER ===== */}
        <LinearGradient
          colors={["#0A84FF", "#2563EB"]}
          style={styles.gradientHeader}
        >
          <View style={styles.iconCircle}>
            <Ionicons
              name="checkmark"
              size={40}
              color="#0A84FF"
            />
          </View>

          <Text style={styles.headerTitle}>
            Booking Confirmed
          </Text>

          <Text style={styles.headerSub}>
            Order #{booking._id.slice(-6).toUpperCase()}
          </Text>
        </LinearGradient>

        {/* ===== MAIN CONTENT ===== */}
        <View style={styles.contentContainer}>
          {/* Schedule */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Schedule
            </Text>

            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={18} color="#64748B" />
              <Text style={styles.rowText}>
                {new Date(
                  booking.scheduledDate
                ).toDateString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="time-outline" size={18} color="#64748B" />
              <Text style={styles.rowText}>
                {booking.timeSlot}
              </Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="location-outline" size={18} color="#64748B" />
              <Text style={styles.rowText}>
                {booking.areaId?.name}
              </Text>
            </View>
          </View>

          {/* Services */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Services
            </Text>

            {booking.services?.map((service: any, index: number) => (
              <View key={index} style={styles.serviceTile}>
                <View>
                  <Text style={styles.serviceName}>
                    {service.subServiceId?.name}
                  </Text>
                  <Text style={styles.serviceMeta}>
                    Qty {service.quantity}
                  </Text>
                </View>

                <Text style={styles.serviceAmount}>
                  ₹{service.price * service.quantity}
                </Text>
              </View>
            ))}
          </View>

          {/* Customer */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Customer
            </Text>
            <Text style={styles.detailPrimary}>
              {booking.customerDetails?.name}
            </Text>
            <Text style={styles.detailSecondary}>
              {booking.customerDetails?.phone}
            </Text>
          </View>

          {/* Address */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Service Address
            </Text>

            <Text style={styles.detailPrimary}>
              {booking.address?.houseNumber}
            </Text>

            {booking.address?.floorNumber && (
              <Text style={styles.detailSecondary}>
                Floor: {booking.address.floorNumber}
              </Text>
            )}

            {booking.address?.buildingName && (
              <Text style={styles.detailSecondary}>
                {booking.address.buildingName}
              </Text>
            )}

            {booking.address?.landmark && (
              <Text style={styles.detailSecondary}>
                Landmark: {booking.address.landmark}
              </Text>
            )}

            <Text style={styles.detailSecondary}>
              {booking.address?.fullAddress}
            </Text>
          </View>

          {/* Payment */}
          <View style={styles.priceCard}>
            <Text style={styles.cardTitle}>
              Payment Summary
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Service Charges
              </Text>
              <Text style={styles.priceValue}>
                ₹{subtotal}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Area Charges
              </Text>
              <Text style={styles.priceValue}>
                ₹{extraCharge}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>
                Total Paid
              </Text>
              <Text style={styles.totalValue}>
                ₹{total}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.primaryText}>
              Back to Home
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/my-bookings")}
          >
            <Text style={styles.secondaryText}>
              View My Bookings
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  gradientHeader: {
    paddingTop: 70,
    paddingBottom: 60,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },

  headerSub: {
    color: "#E0F2FE",
    marginTop: 6,
  },

  contentContainer: {
    padding: 20,
    marginTop: -40,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 24,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0F172A",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  rowText: {
    color: "#334155",
  },

  serviceTile: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },

  serviceName: {
    fontWeight: "600",
    color: "#0F172A",
  },

  serviceMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  serviceAmount: {
    fontWeight: "700",
    color: "#0F172A",
  },

  detailPrimary: {
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },

  detailSecondary: {
    color: "#64748B",
    marginBottom: 4,
  },

  priceCard: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  priceLabel: {
    color: "#475569",
  },

  priceValue: {
    color: "#0F172A",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0A84FF",
  },

  primaryButton: {
    backgroundColor: "#0A84FF",
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 14,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#0A84FF",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
  },

  secondaryText: {
    color: "#0A84FF",
    fontWeight: "600",
  },
});