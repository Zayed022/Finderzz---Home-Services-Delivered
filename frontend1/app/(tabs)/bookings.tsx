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
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import API from "@/services/api";

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    const data = await AsyncStorage.getItem("guest_bookings");

    const parsed = data ? JSON.parse(data) : [];

    setBookings(parsed);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const openInvoice = async (invoiceUrl: string) => {

    try {
  
      const baseURL = API.defaults.baseURL.replace("/api/v1","");
  
      const fullUrl = `${baseURL}${invoiceUrl}`;
  
      console.log("Opening invoice:", fullUrl);
  
      await Linking.openURL(fullUrl);
  
    } catch (error) {
      console.log("Invoice open failed", error);
    }
  
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>

      {bookings.length === 0 ? (
        <Text style={styles.empty}>No bookings yet</Text>
      ) : (
        bookings.map((booking: any) => (
          <View key={booking._id} style={styles.card}>
            {/* DATE */}
            <Text style={styles.date}>
              {new Date(booking.scheduledDate).toDateString()}
            </Text>

            {/* STATUS */}
            <Text style={styles.status}>
              Status: {booking.status}
            </Text>

            {/* PRICE */}
            <Text style={styles.price}>
              ₹{booking.totalPrice}
            </Text>

            {/* INVOICE BUTTON */}
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
                  Download Invoice
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
    padding: 20,
    backgroundColor: "#F1F5F9",
  },

  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    elevation: 3,
  },

  date: {
    fontWeight: "600",
    fontSize: 15,
  },

  status: {
    marginTop: 4,
    color: "#64748B",
  },

  price: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 16,
  },

  invoiceButton: {
    marginTop: 14,
    backgroundColor: "#16A34A",
    paddingVertical: 12,
    borderRadius: 12,
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