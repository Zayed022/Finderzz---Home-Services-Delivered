import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useAppSelector } from "@/store/hooks";
import { useLocationStore } from "@/store/location.store";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import API from "@/services/api";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CheckoutScreen() {
  const router = useRouter();
  const items = useAppSelector((state) => state.cart.items);
  const area = useLocationStore((state) => state.area);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  /* ================= PRICE CALCULATION ================= */

  const serviceTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const extraCharge = area?.extraCharge || 0;

  const finalTotal = serviceTotal + extraCharge;

  /* ================= BOOKING ================= */

  const handleBooking = async () => {
    if (!items.length) {
      Alert.alert("Cart Empty", "Please add services first.");
      return;
    }
  
    if (!area?._id) {
      Alert.alert("Missing Area", "Please select service area.");
      return;
    }
  
    if (!name || !phone || !houseNumber || !fullAddress) {
      Alert.alert("Missing Details", "Please fill all required fields.");
      return;
    }
  
    if (!hour || !minute) {
      Alert.alert("Invalid Time", "Please enter time.");
      return;
    }
  
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
  
    if (hourNum < 1 || hourNum > 12 || minuteNum > 59) {
      Alert.alert("Invalid Time", "Enter valid time format.");
      return;
    }
  
    let hour24 = hourNum;
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
  
    const finalDate = new Date(date);
    finalDate.setHours(hour24);
    finalDate.setMinutes(minuteNum);
    finalDate.setSeconds(0);
    finalDate.setMilliseconds(0);
  
    try {
      const response = await API.post("/booking/", {
        services: items.map((item) => ({
          subServiceId: item._id,
          quantity: item.quantity,
          bookingType: item.bookingType || "service",
        })),
        areaId: area._id,
        customerDetails: { name, phone },
        address: {
          houseNumber,
          floorNumber,
          buildingName,
          landmark,
          fullAddress,
        },
        scheduledDate: finalDate,
        timeSlot: `${hour}:${minute} ${period}`,
      });
  
      const bookingData = response.data.data;
  
      const existing = await AsyncStorage.getItem("guest_bookings");
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.unshift(bookingData);
  
      await AsyncStorage.setItem(
        "guest_bookings",
        JSON.stringify(parsed)
      );
  
      router.replace("/booking-success");
    } catch (error) {
      Alert.alert("Error", "Booking failed. Try again.");
    }
  };

  /* ================= UI ================= */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>Confirm Booking</Text>

          {/* AREA */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Ionicons
                name="location-outline"
                size={18}
                color="#0A84FF"
              />
              <Text style={styles.cardTitle}>Service Area</Text>
            </View>
            <Text style={styles.value}>
              {area?.name || "Not Selected"}
            </Text>
          </View>

          {/* SERVICES */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Selected Services
            </Text>

            {items.map((item) => (
              <View key={item._id} style={styles.serviceRow}>
                <Text>{item.name}</Text>
                <Text>
                  ₹{item.price} × {item.quantity}
                </Text>
              </View>
            ))}
          </View>

          {/* DATE */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Select Date</Text>
            <Pressable
              style={styles.inputBox}
              onPress={() => setShowPicker(true)}
            >
              <Text>{date.toDateString()}</Text>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                minimumDate={new Date()}
                onChange={(e, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>

          {/* TIME */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Preferred Time</Text>

            <View style={styles.timeRow}>
              <TextInput
                placeholder="HH"
                value={hour}
                onChangeText={(text) =>
                  /^\d{0,2}$/.test(text) && setHour(text)
                }
                keyboardType="number-pad"
                maxLength={2}
                style={styles.timeInput}
              />

              <Text style={styles.timeColon}>:</Text>

              <TextInput
                placeholder="MM"
                value={minute}
                onChangeText={(text) =>
                  /^\d{0,2}$/.test(text) && setMinute(text)
                }
                keyboardType="number-pad"
                maxLength={2}
                style={styles.timeInput}
              />

              <View style={styles.periodContainer}>
                {["AM", "PM"].map((p) => (
                  <Pressable
                    key={p}
                    onPress={() =>
                      setPeriod(p as "AM" | "PM")
                    }
                    style={[
                      styles.periodButton,
                      period === p && styles.periodActive,
                    ]}
                  >
                    <Text
                      style={
                        period === p
                          ? styles.periodTextActive
                          : styles.periodText
                      }
                    >
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* CONTACT */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Contact Details
            </Text>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#94A3B8"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          {/* ADDRESS */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>Address Details</Text>

  <TextInput
    placeholder="House / Flat No. *"
    placeholderTextColor="#94A3B8"
    value={houseNumber}
    onChangeText={setHouseNumber}
    style={styles.input}
  />

  <TextInput
    placeholder="Floor No."
    placeholderTextColor="#94A3B8"
    value={floorNumber}
    onChangeText={setFloorNumber}
    style={styles.input}
  />

  <TextInput
    placeholder="Building Name"
    placeholderTextColor="#94A3B8"
    value={buildingName}
    onChangeText={setBuildingName}
    style={styles.input}
  />

  <TextInput
    placeholder="Landmark"
    placeholderTextColor="#94A3B8"
    value={landmark}
    onChangeText={setLandmark}
    style={styles.input}
  />

  <TextInput
    placeholder="Full Address *"
    placeholderTextColor="#94A3B8"
    value={fullAddress}
    onChangeText={setFullAddress}
    style={styles.input}
    multiline
  />
</View>

          {/* SUMMARY */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text>Service Charges</Text>
              <Text>₹{serviceTotal}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text>Area Charge</Text>
              <Text>₹{extraCharge}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ₹{finalTotal}
              </Text>
            </View>

            <Pressable
              style={styles.confirmButton}
              onPress={handleBooking}
            >
              <Text style={styles.confirmText}>
                Confirm Booking
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9", padding: 20, marginTop: 20 },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
  },
  cardTitle: { fontWeight: "600", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  inputBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timeRow: { flexDirection: "row", alignItems: "center" },
  timeInput: {
    width: 60,
    height: 50,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    textAlign: "center",
  },
  timeColon: { marginHorizontal: 8, fontSize: 18 },
  periodContainer: {
    flexDirection: "row",
    marginLeft: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
  },
  periodButton: { padding: 12 },
  periodActive: { backgroundColor: "#0A84FF" },
  periodText: { color: "#334155" },
  periodTextActive: { color: "#FFF" },
  summary: { marginTop: 10 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },
  totalLabel: { fontSize: 18, fontWeight: "700" },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A84FF",
  },
  confirmButton: {
    backgroundColor: "#0A84FF",
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: "center",
    marginTop: 10,
  },
  confirmText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});