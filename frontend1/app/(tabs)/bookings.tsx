import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import API from "@/services/api";

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();

    // 🔥 Auto refresh every 10 sec
    const interval = setInterval(() => {
      refreshStatuses();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ================= LOAD BOOKINGS ================= */

  const loadBookings = async () => {
    const data = await AsyncStorage.getItem("guest_bookings");
    const parsed = data ? JSON.parse(data) : [];

    setBookings(parsed);
    setLoading(false);

    // fetch latest statuses after load
    fetchStatuses(parsed);
  };

  /* ================= FETCH STATUS ================= */

  const fetchStatuses = async (bookingList: any[]) => {
    try {
      const updated = await Promise.all(
        bookingList.map(async (booking) => {
          try {
            const res = await API.get(
              `/booking/status/${booking._id}`
            );

            return {
              ...booking,
              status: res.data.data.status, // 🔥 updated status
            };
          } catch (err) {
            return booking; // fallback
          }
        })
      );

      setBookings(updated);

      // update storage also (optional but good)
      await AsyncStorage.setItem(
        "guest_bookings",
        JSON.stringify(updated)
      );
    } catch (error) {
      console.log("Status fetch failed", error);
    }
  };

  /* ================= REFRESH ================= */

  const refreshStatuses = async () => {
    if (!bookings.length) return;
    fetchStatuses(bookings);
  };

  /* ================= INVOICE ================= */

  const openInvoice = async (invoiceUrl: string) => {
    try {
      const fullUrl = `https://finderzz-home-services-delivered.onrender.com${invoiceUrl}`;
      await WebBrowser.openBrowserAsync(fullUrl);
    } catch (error) {
      console.log("Invoice open failed", error);
    }
  };

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#F59E0B";
      case "assigned":
        return "#0A84FF";
      case "in_progress":
        return "#8B5CF6";
      case "completed":
        return "#16A34A";
      case "cancelled":
        return "#EF4444";
      default:
        return "#64748B";
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>

      {bookings.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="clipboard-outline" size={40} color="#94A3B8" />
          <Text style={styles.emptyText}>No bookings yet</Text>
        </View>
      ) : (
        bookings.map((booking: any) => (
          <View key={booking._id} style={styles.card}>
            
            {/* HEADER */}
            <View style={styles.topRow}>
              <Text style={styles.bookingId}>
                #{booking._id.slice(-6).toUpperCase()}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(booking.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(booking.status) },
                  ]}
                >
                  {booking.status.replace("_", " ")}
                </Text>
              </View>
            </View>

            {/* DATE */}
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={16} color="#64748B" />
              <Text style={styles.rowText}>
                {new Date(booking.scheduledDate).toDateString()}
              </Text>
            </View>

            {/* TIME */}
            <View style={styles.row}>
              <Ionicons name="time-outline" size={16} color="#64748B" />
              <Text style={styles.rowText}>{booking.timeSlot}</Text>
            </View>

            {/* SERVICES */}
            <View style={styles.servicesBox}>
              {booking.services?.map((service: any, index: number) => {
                const name =
                  service.bookingType === "inspection"
                    ? service.serviceId?.name ||
                      service.subServiceId?.name ||
                      "Inspection"
                    : service.subServiceId?.name || "Service";

                return (
                  <View key={index} style={styles.serviceRow}>
                    <Text style={styles.serviceName}>
                      {name} {service.bookingType === "inspection" && "(Inspection)"}
                    </Text>

                    <Text style={styles.serviceQty}>
                      x{service.quantity}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* PRICE */}
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ₹{booking.totalPrice}
              </Text>
            </View>

            {/* INVOICE */}
            {booking?.invoice?.invoiceUrl && (
              <Pressable
                style={styles.invoiceButton}
                onPress={() =>
                  openInvoice(booking.invoice.invoiceUrl)
                }
              >
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color="#fff"
                />
                <Text style={styles.invoiceText}>
                  View Invoice
                </Text>
              </Pressable>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },

  header: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    marginTop:18
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyBox: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 10,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  bookingId: {
    fontWeight: "700",
    fontSize: 14,
    color: "#0F172A",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },

  rowText: {
    color: "#334155",
  },

  servicesBox: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 10,
  },

  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  serviceName: {
    fontSize: 13,
    color: "#0F172A",
  },

  serviceQty: {
    fontSize: 13,
    color: "#64748B",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  totalLabel: {
    fontSize: 14,
    color: "#64748B",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0178BD",
  },

  invoiceButton: {
    marginTop: 14,
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  invoiceText: {
    color: "#fff",
    fontWeight: "700",
  },
});