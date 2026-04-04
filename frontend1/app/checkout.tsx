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
  ActivityIndicator,
} from "react-native";
import { useAppSelector } from "@/store/hooks";
import { useLocationStore } from "@/store/location.store";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import API from "@/services/api";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

/* ─── design tokens ──────────────────────────────────────────── */
const T = {
  blue:      "#1d4ed8",
  blueSoft:  "#eff6ff",
  blueMid:   "#bfdbfe",
  blueDark:  "#1e40af",
  ink:       "#0f172a",
  inkSoft:   "#334155",
  muted:     "#64748b",
  border:    "#e2e8f0",
  surface:   "#f8fafc",
  white:     "#ffffff",
  green:     "#16a34a",
  greenSoft: "#f0fdf4",
  greenMid:  "#bbf7d0",
  amber:     "#d97706",
  amberSoft: "#fffbeb",
  amberMid:  "#fcd34d",
  red:       "#dc2626",
  redSoft:   "#fef2f2",
};

/* ─── card shadow ────────────────────────────────────────────── */
const cardShadow = Platform.select({
  ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 },
  android: { elevation: 2 },
});

/* ─── step card ──────────────────────────────────────────────── */
function StepCard({
  step, title, icon, children,
}: {
  step: number; title: string; icon: string; children: React.ReactNode;
}) {
  return (
    <View style={s.card}>
      <View style={s.stepHeader}>
        <View style={s.stepIconWrap}>
          <Ionicons name={icon as any} size={15} color={T.blue} />
        </View>
        <View>
          <Text style={s.stepNum}>Step {step}</Text>
          <Text style={s.stepTitle}>{title}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

/* ─── labelled input ─────────────────────────────────────────── */
function Field({
  label, icon, error, children,
}: {
  label: string; icon?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={s.fieldLabel}>
        {icon && <Ionicons name={icon as any} size={11} color={T.muted} />}
        <Text style={s.fieldLabelText}>{label.toUpperCase()}</Text>
      </View>
      {children}
      {error ? (
        <View style={s.fieldError}>
          <Ionicons name="alert-circle-outline" size={11} color={T.red} />
          <Text style={s.fieldErrorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function CheckoutScreen() {
  const router = useRouter();
  const items  = useAppSelector((s: any) => s.cart.items);
  const hasInspection = items.some(
    (item: any) => item.bookingType === "inspection"
  );
  const area   = useLocationStore((s: any) => s.area);

  const [date, setDate]             = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [hour, setHour]             = useState("");
  const [minute, setMinute]         = useState("");
  const [period, setPeriod]         = useState<"AM" | "PM">("AM");

  const [name, setName]                   = useState("");
  const [phone, setPhone]                 = useState("");
  const [houseNumber, setHouseNumber]     = useState("");
  const [floorNumber, setFloorNumber]     = useState("");
  const [buildingName, setBuildingName]   = useState("");
  const [landmark, setLandmark]           = useState("");
  const [fullAddress, setFullAddress]     = useState("");

  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState("");
const [budget, setBudget] = useState("");

  /* price */
  const serviceTotal = items.reduce((a: number, i: any) => a + i.price * i.quantity, 0);
  const extraCharge  = area?.extraCharge || 0;
  const finalTotal   = serviceTotal + extraCharge;

  /* validation */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())        e.name        = "Name is required";
    if (!phone.trim())       e.phone       = "Phone is required";
    if (!houseNumber.trim()) e.houseNumber = "House number is required";
    if (!fullAddress.trim()) e.fullAddress = "Full address is required";
    if (!hour || !minute)    e.time        = "Please enter a time";
    if (!area?._id)          e.area        = "Please select a service area";
    const h = parseInt(hour), m = parseInt(minute);
    if (hour && (h < 1 || h > 12))  e.time = "Hour must be 1–12";
    if (minute && m > 59)            e.time = "Minute must be 0–59";
    return e;
  };

  /* submit */
  const handleBooking = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    let hour24 = parseInt(hour);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;

    const finalDate = new Date(date);
    finalDate.setHours(hour24, parseInt(minute), 0, 0);

    try {
      setLoading(true);
      const formattedServices = items.map((item: any) => {
        if (item.bookingType === "inspection") return { serviceId: item.serviceId, quantity: item.quantity, bookingType: "inspection" };
        return { subServiceId: item.subServiceId, quantity: item.quantity, bookingType: "service" };
      });

      const response = await API.post("/booking/", {
        services: formattedServices,
        areaId: area._id,
        customerDetails: { name, phone },
        address: { houseNumber, floorNumber, buildingName, landmark, fullAddress },
        scheduledDate: finalDate,
        timeSlot: `${hour}:${minute} ${period}`,
      });

      const existing = await AsyncStorage.getItem("guest_bookings");
      const parsed   = existing ? JSON.parse(existing) : [];
      parsed.unshift(response.data.data);
      await AsyncStorage.setItem("guest_bookings", JSON.stringify(parsed));
      router.replace("/booking-success");
    } catch {
      Alert.alert("Booking Failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={{ flex: 1, backgroundColor: T.white }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
            {/* ── HEADER ────────────────────────────── */}
            <View style={s.header}>
              <Pressable style={s.backBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={18} color={T.inkSoft} />
              </Pressable>
              <View style={s.headerDivider} />
              <Text style={s.headerTitle}>Checkout</Text>
            </View>

            {/* ── PROGRESS ──────────────────────────── */}
            <View style={s.progress}>
              {[["1", "Details"], ["2", "Schedule"], ["3", "Confirm"]].map(([n, label], i) => (
                <View key={n} style={s.progressItem}>
                  <View style={[s.progressDot, i <= 1 && s.progressDotActive]}>
                    <Text style={[s.progressDotText, i <= 1 && s.progressDotTextActive]}>{n}</Text>
                  </View>
                  <Text style={[s.progressLabel, i <= 1 && { color: T.blue }]}>{label}</Text>
                  {i < 2 && <Ionicons name="chevron-forward" size={13} color={T.border} style={{ marginHorizontal: 4 }} />}
                </View>
              ))}
            </View>

            <ScrollView
              style={{ flex: 1, backgroundColor: T.surface }}
              contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >

              {/* ── AREA ─────────────────────────────── */}
              <Pressable onPress={() => router.push("/select-location")}>
                <View style={[s.areaCard, errors.area && s.areaCardError]}>
                  <View style={[s.areaIconWrap, area && s.areaIconWrapActive]}>
                    <Ionicons name="location-outline" size={15} color={area ? T.green : T.blue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.stepNum}>Step 1</Text>
                    <Text style={s.stepTitle}>Service Area</Text>
                    {area ? (
                      <View style={{ marginTop: 4 }}>
                        <Text style={s.areaName}>{area.name}</Text>
                        {extraCharge > 0 && (
                          <Text style={s.areaCharge}>+ ₹{extraCharge} area charge applied</Text>
                        )}
                      </View>
                    ) : (
                      <Text style={[s.areaPlaceholder, errors.area && { color: T.red }]}>
                        {errors.area || "Tap to select your service area"}
                      </Text>
                    )}
                  </View>
                  <Text style={s.areaChangeTap}>{area ? "Change" : "Select"}</Text>
                </View>
              </Pressable>

              {/* ── CONTACT ──────────────────────────── */}
              <StepCard step={2} title="Your Details" icon="person-outline">
                <View style={s.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Field label="Full Name" icon="person-outline" error={errors.name}>
                      <TextInput
                        placeholder="Rahul Sharma"
                        placeholderTextColor={T.muted}
                        value={name}
                        onChangeText={(v) => { setName(v); setErrors((e) => ({ ...e, name: "" })); }}
                        style={[s.input, errors.name && s.inputError]}
                      />
                    </Field>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field label="Phone" icon="call-outline" error={errors.phone}>
                      <TextInput
                        placeholder="9876543210"
                        placeholderTextColor={T.muted}
                        value={phone}
                        onChangeText={(v) => { setPhone(v); setErrors((e) => ({ ...e, phone: "" })); }}
                        keyboardType="phone-pad"
                        style={[s.input, errors.phone && s.inputError]}
                      />
                    </Field>
                  </View>
                </View>
              </StepCard>

              {/* ── ADDRESS ──────────────────────────── */}
              <StepCard step={3} title="Service Address" icon="home-outline">
                <View style={s.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Field label="House / Flat No." error={errors.houseNumber}>
                      <TextInput placeholder="B-204" placeholderTextColor={T.muted}
                        value={houseNumber}
                        onChangeText={(v) => { setHouseNumber(v); setErrors((e) => ({ ...e, houseNumber: "" })); }}
                        style={[s.input, errors.houseNumber && s.inputError]}
                      />
                    </Field>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field label="Floor No.">
                      <TextInput placeholder="3rd" placeholderTextColor={T.muted} value={floorNumber} onChangeText={setFloorNumber} style={s.input} />
                    </Field>
                  </View>
                </View>
                <Field label="Building Name">
                  <TextInput placeholder="Regal Heights" placeholderTextColor={T.muted} value={buildingName} onChangeText={setBuildingName} style={s.input} />
                </Field>
                <Field label="Landmark">
                  <TextInput placeholder="Near City Mall" placeholderTextColor={T.muted} value={landmark} onChangeText={setLandmark} style={s.input} />
                </Field>
                <Field label="Full Address *" error={errors.fullAddress}>
                  <TextInput
                    placeholder="Street, locality, city…"
                    placeholderTextColor={T.muted}
                    value={fullAddress}
                    onChangeText={(v) => { setFullAddress(v); setErrors((e) => ({ ...e, fullAddress: "" })); }}
                    style={[s.input, s.inputMulti, errors.fullAddress && s.inputError]}
                    multiline numberOfLines={3}
                  />
                </Field>
              </StepCard>

              {/* ── SCHEDULE ─────────────────────────── */}
              <StepCard step={4} title="Schedule" icon="calendar-outline">

  {/* DATE */}
  <Field label="Preferred Date" icon="calendar-outline">
    <Pressable style={s.dateBtn} onPress={() => setShowPicker(true)}>
      <Ionicons name="calendar-outline" size={15} color={T.blue} />
      <Text style={s.dateBtnText}>{formattedDate}</Text>
      <Ionicons name="chevron-down" size={14} color={T.muted} style={{ marginLeft: "auto" }} />
    </Pressable>
  </Field>

  {showPicker && (
    <DateTimePicker
      value={date}
      mode="date"
      minimumDate={new Date()}
      onChange={(_, d) => { setShowPicker(false); if (d) setDate(d); }}
    />
  )}

  {/* TIME */}
  <Field label="Preferred Time" icon="time-outline" error={errors.time}>
                  <View style={s.timeRow}>
                    <TextInput
                      placeholder="HH"
                      value={hour}
                      onChangeText={(t) => { /^\d{0,2}$/.test(t) && setHour(t); setErrors((e) => ({ ...e, time: "" })); }}
                      keyboardType="number-pad" maxLength={2}
                      style={[s.timeInput, errors.time && s.inputError]}
                    />
                    <Text style={s.timeColon}>:</Text>
                    <TextInput
                      placeholder="MM"
                      value={minute}
                      onChangeText={(t) => { /^\d{0,2}$/.test(t) && setMinute(t); setErrors((e) => ({ ...e, time: "" })); }}
                      keyboardType="number-pad" maxLength={2}
                      style={[s.timeInput, errors.time && s.inputError]}
                    />
                    <View style={s.periodWrap}>
                      {(["AM", "PM"] as const).map((p) => (
                        <Pressable
                          key={p}
                          onPress={() => setPeriod(p)}
                          style={[s.periodBtn, period === p && s.periodBtnActive]}
                        >
                          <Text style={[s.periodText, period === p && s.periodTextActive]}>{p}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </Field>

  {/* 🔥 CONDITIONAL FIELDS */}
  {hasInspection && (
    <>
      {/* REQUIREMENTS */}
      <Field label="Inspection Requirements (Scope of Work)">
        <TextInput
          placeholder="Describe the issue so technician can prepare better..."
          placeholderTextColor={T.muted}
          value={requirements}
          onChangeText={setRequirements}
          multiline
          style={[s.input, s.inputMulti]}
        />
      </Field>

      {/* BUDGET */}
      <Field label="Your Budget (Optional)">
        <TextInput
          placeholder="Enter your expected budget"
          placeholderTextColor={T.muted}
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          style={s.input}
        />
      </Field>
    </>
  )}

</StepCard>

              {/* ── ORDER SUMMARY ────────────────────── */}
              <View style={s.summaryCard}>
                <Text style={s.summaryTitle}>ORDER SUMMARY</Text>

                {items.map((item: any, i: number) => (
                  <View key={i} style={s.summaryRow}>
                    <Text style={s.summaryName} numberOfLines={1}>
                      {item.name}
                      <Text style={{ color: T.muted }}> ×{item.quantity}</Text>
                    </Text>
                    <Text style={s.summaryAmt}>₹{item.price * item.quantity}</Text>
                  </View>
                ))}

                <View style={s.summaryDivider} />

                <View style={s.summaryRow}>
                  <Text style={{ fontSize: 13, color: T.muted }}>Service charges</Text>
                  <Text style={s.summaryAmt}>₹{serviceTotal}</Text>
                </View>
                {extraCharge > 0 && (
                  <View style={s.summaryRow}>
                    <Text style={{ fontSize: 13, color: T.muted }}>Area charge ({area?.name})</Text>
                    <Text style={s.summaryAmt}>₹{extraCharge}</Text>
                  </View>
                )}

                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>Total</Text>
                  <Text style={s.totalAmt}>₹{finalTotal}</Text>
                </View>

                <Pressable onPress={() => router.push("/terms")}>
                <Text style={s.termsText}>
                  By confirming you agree to our{" "}
                  <Text style={s.termsLink}>Terms & Conditions</Text>.
                </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [s.confirmBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
                  onPress={handleBooking}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={T.white} size="small" />
                  ) : (
                    <>
                      <Text style={s.confirmBtnText}>Confirm Booking</Text>
                      <Ionicons name="arrow-forward" size={16} color={T.white} />
                    </>
                  )}
                </Pressable>

                {/* trust strip */}
                <View style={s.trustRow}>
                  <View style={s.trustItem}>
                    <Ionicons name="shield-checkmark-outline" size={12} color={T.green} />
                    <Text style={s.trustText}>Secure booking</Text>
                  </View>
                  <View style={s.trustItem}>
                    <Ionicons name="checkmark-circle-outline" size={12} color={T.green} />
                    <Text style={s.trustText}>Verified pros</Text>
                  </View>
                  <View style={s.trustItem}>
                    <Ionicons name="flash-outline" size={12} color={T.amber} />
                    <Text style={s.trustText}>Instant SMS</Text>
                  </View>
                </View>
              </View>

            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const s = StyleSheet.create({

  /* header */
  header: {
    height: 56, flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, gap: 10,
    backgroundColor: T.white, borderBottomWidth: 1, borderBottomColor: T.border,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 9,
    backgroundColor: T.surface, borderWidth: 1, borderColor: T.border,
    alignItems: "center", justifyContent: "center",
  },
  headerDivider: { width: 1, height: 18, backgroundColor: T.border },
  headerTitle:  { fontSize: 17, fontWeight: "700", color: T.ink },

  /* progress */
  progress: {
    height: 44, flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: T.white, borderBottomWidth: 1, borderBottomColor: T.border,
  },
  progressItem:  { flexDirection: "row", alignItems: "center" },
  progressDot: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: T.surface, borderWidth: 1.5, borderColor: T.border,
    alignItems: "center", justifyContent: "center", marginRight: 5,
  },
  progressDotActive:      { backgroundColor: T.blueSoft, borderColor: T.blueMid },
  progressDotText:        { fontSize: 10, fontWeight: "700", color: T.muted },
  progressDotTextActive:  { color: T.blue },
  progressLabel:          { fontSize: 11.5, fontWeight: "600", color: T.muted, marginRight: 4 },

  /* area card */
  areaCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    backgroundColor: T.white, borderWidth: 1, borderColor: T.border,
    borderRadius: 16, padding: 16, marginBottom: 14,
    ...cardShadow,
  },
  areaCardError: { borderColor: T.red, backgroundColor: T.redSoft },
  areaIconWrap: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: T.blueSoft, borderWidth: 1, borderColor: T.blueMid,
    alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
  },
  areaIconWrapActive: { backgroundColor: T.greenSoft, borderColor: T.greenMid },
  areaName:        { fontSize: 13.5, fontWeight: "600", color: T.inkSoft, marginTop: 2 },
  areaCharge:      { fontSize: 11.5, color: T.muted, marginTop: 1 },
  areaPlaceholder: { fontSize: 13, color: T.muted, marginTop: 3 },
  areaChangeTap:   { fontSize: 13, fontWeight: "700", color: T.blue, flexShrink: 0, paddingTop: 14 },

  /* step card */
  card: {
    backgroundColor: T.white, borderWidth: 1, borderColor: T.border,
    borderRadius: 16, padding: 18, marginBottom: 14,
    ...cardShadow,
  },
  stepHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 },
  stepIconWrap: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: T.blueSoft, borderWidth: 1, borderColor: T.blueMid,
    alignItems: "center", justifyContent: "center",
  },
  stepNum:   { fontSize: 9.5, fontWeight: "700", letterSpacing: 0.5, color: T.muted, textTransform: "uppercase" },
  stepTitle: { fontSize: 14.5, fontWeight: "700", color: T.ink },

  /* two column layout */
  twoCol: { flexDirection: "row", gap: 10 },

  /* field */
  fieldLabel:     { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 5 },
  fieldLabelText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, color: T.muted },
  fieldError:     { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  fieldErrorText: { fontSize: 11, color: T.red },

  /* inputs */
  input: {
    backgroundColor: T.surface, borderWidth: 1.5, borderColor: T.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: T.ink,
  },
  inputError:  { borderColor: T.red, backgroundColor: T.redSoft },
  inputMulti:  { minHeight: 80, textAlignVertical: "top", paddingTop: 10 },

  /* date button */
  dateBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: T.surface, borderWidth: 1.5, borderColor: T.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11,
  },
  dateBtnText: { fontSize: 14, color: T.ink, fontWeight: "500" },

  /* time row */
  timeRow: { flexDirection: "row", alignItems: "center" },
  timeInput: {
    width: 58, height: 44,
    backgroundColor: T.surface, borderWidth: 1.5, borderColor: T.border,
    borderRadius: 10, textAlign: "center",
    fontSize: 16, fontWeight: "600", color: T.ink,
  },
  timeColon: { fontSize: 20, color: T.muted, marginHorizontal: 6 },
  periodWrap: {
    flexDirection: "row",
    marginLeft: 12,
    borderWidth: 1.5, borderColor: T.border,
    borderRadius: 10, overflow: "hidden",
  },
  periodBtn:         { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: T.surface },
  periodBtnActive:   { backgroundColor: T.blue },
  periodText:        { fontSize: 13, fontWeight: "600", color: T.inkSoft },
  periodTextActive:  { color: T.white },

  /* summary */
  summaryCard: {
    backgroundColor: T.white, borderWidth: 1, borderColor: T.border,
    borderRadius: 16, padding: 18, marginBottom: 14,
    ...cardShadow,
  },
  summaryTitle: {
    fontSize: 10, fontWeight: "700", letterSpacing: 0.8, color: T.muted,
    marginBottom: 12, textTransform: "uppercase",
  },
  summaryRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 6,
  },
  summaryName: { fontSize: 13, color: T.inkSoft, flex: 1, marginRight: 8 },
  summaryAmt:  { fontSize: 13, fontWeight: "600", color: T.ink },
  summaryDivider: { height: 1, backgroundColor: T.border, marginVertical: 10 },

  totalRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "baseline",
    marginTop: 4, marginBottom: 16,
  },
  totalLabel: { fontSize: 15, fontWeight: "700", color: T.ink },
  totalAmt:   { fontSize: 26, fontWeight: "700", color: T.ink, letterSpacing: -0.5 },

  termsText: { fontSize: 12.5, color: T.muted, textAlign: "center", lineHeight: 18, marginBottom: 14 },
  termsLink: { color: T.blue, fontWeight: "600" },

  confirmBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: T.blue, paddingVertical: 14, borderRadius: 10,
    marginBottom: 14,
  },
  confirmBtnText: { fontSize: 15, fontWeight: "700", color: T.white },

  trustRow:  { flexDirection: "row", justifyContent: "center", gap: 16 },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  trustText: { fontSize: 11.5, color: T.muted },
});