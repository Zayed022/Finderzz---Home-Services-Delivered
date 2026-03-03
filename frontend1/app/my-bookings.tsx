import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  export default function MyBookingsScreen() {
    const [bookings, setBookings] = useState([]);
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
      return <ActivityIndicator style={{ marginTop: 50 }} />;
    }
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>My Bookings</Text>
  
        {bookings.length === 0 ? (
          <Text>No bookings yet</Text>
        ) : (
          bookings.map((booking: any) => (
            <View key={booking._id} style={styles.card}>
              <Text style={styles.date}>
                {new Date(booking.scheduledDate).toDateString()}
              </Text>
  
              <Text style={styles.status}>
                Status: {booking.status}
              </Text>
  
              <Text style={styles.price}>
                ₹{booking.totalPrice}
              </Text>
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
    card: {
      backgroundColor: "#fff",
      padding: 18,
      borderRadius: 18,
      marginBottom: 14,
    },
    date: {
      fontWeight: "600",
    },
    status: {
      marginTop: 4,
      color: "#64748B",
    },
    price: {
      marginTop: 8,
      fontWeight: "700",
    },
  });