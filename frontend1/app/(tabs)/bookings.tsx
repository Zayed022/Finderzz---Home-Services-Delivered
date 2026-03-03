import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    const data = await AsyncStorage.getItem("guest_bookings");
    setBookings(data ? JSON.parse(data) : []);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) {
    return <BookingsSkeleton />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>My Bookings</Text>
          <Text style={styles.subHeader}>
            {bookings.length} Total Bookings
          </Text>
        </View>

        {/* EMPTY STATE */}
        {bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={60}
              color="#CBD5E1"
            />
            <Text style={styles.emptyTitle}>
              No bookings yet
            </Text>
            <Text style={styles.emptySubtitle}>
              Your confirmed bookings will appear here.
            </Text>
          </View>
        ) : (
          bookings.map((booking: any) => {
            const statusColor =
              booking.status === "pending"
                ? "#F59E0B"
                : booking.status === "completed"
                ? "#22C55E"
                : "#0A84FF";

            return (
              <View key={booking._id} style={styles.card}>
                {/* Top Row */}
                <View style={styles.topRow}>
                  <Text style={styles.bookingId}>
                    #{booking._id.slice(-6).toUpperCase()}
                  </Text>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${statusColor}15` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusColor },
                      ]}
                    >
                      {booking.status?.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Schedule */}
                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color="#64748B"
                  />
                  <Text style={styles.infoText}>
                    {new Date(
                      booking.scheduledDate
                    ).toDateString()} • {booking.timeSlot}
                  </Text>
                </View>

                {/* Services Preview */}
                {booking.services?.length > 0 && (
                  <Text style={styles.servicesPreview}>
                    {booking.services
                      .slice(0, 2)
                      .map(
                        (s: any) =>
                          s.subServiceId?.name || "Service"
                      )
                      .join(", ")}
                    {booking.services.length > 2 && " + more"}
                  </Text>
                )}

                {/* Divider */}
                <View style={styles.divider} />

                {/* Bottom Row */}
                <View style={styles.bottomRow}>
                  <Text style={styles.totalLabel}>
                    Total Paid
                  </Text>
                  <Text style={styles.totalValue}>
                    ₹{booking.totalPrice}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </>
  );
}

/* ---------------- Skeleton ---------------- */

function BookingsSkeleton() {
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER SKELETON */}
        <View style={styles.headerContainer}>
          <View
            style={{
              width: 180,
              height: 28,
              borderRadius: 6,
              backgroundColor: "#E5E7EB",
              marginTop: 30,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              width: 140,
              height: 14,
              borderRadius: 4,
              backgroundColor: "#E5E7EB",
            }}
          />
        </View>

        {/* BOOKING CARD SKELETONS */}
        {[1, 2, 3].map((_, i) => (
          <View key={i} style={styles.card}>
            {/* Top Row */}
            <View style={styles.topRow}>
              <View
                style={{
                  width: 120,
                  height: 14,
                  borderRadius: 4,
                  backgroundColor: "#E5E7EB",
                }}
              />

              <View
                style={{
                  width: 80,
                  height: 28,
                  borderRadius: 20,
                  backgroundColor: "#E5E7EB",
                }}
              />
            </View>

            {/* Schedule */}
            <View
              style={{
                marginTop: 14,
                width: "70%",
                height: 14,
                borderRadius: 4,
                backgroundColor: "#E5E7EB",
              }}
            />

            {/* Services Preview */}
            <View
              style={{
                marginTop: 12,
                width: "60%",
                height: 12,
                borderRadius: 4,
                backgroundColor: "#E5E7EB",
              }}
            />

            {/* Divider */}
            <View style={styles.divider} />

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
              <View
                style={{
                  width: 90,
                  height: 14,
                  borderRadius: 4,
                  backgroundColor: "#E5E7EB",
                }}
              />
              <View
                style={{
                  width: 70,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: "#E5E7EB",
                }}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerContainer: {
    marginBottom: 24,
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
    marginTop:30,
  },

  subHeader: {
    marginTop: 6,
    color: "#64748B",
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    color: "#0F172A",
  },

  emptySubtitle: {
    marginTop: 6,
    textAlign: "center",
    color: "#64748B",
    paddingHorizontal: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 22,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bookingId: {
    fontWeight: "700",
    color: "#0F172A",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },

  infoText: {
    color: "#475569",
  },

  servicesPreview: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748B",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontWeight: "600",
    color: "#334155",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0A84FF",
  },
});