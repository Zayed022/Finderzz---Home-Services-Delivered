import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";

/* ─── design tokens ──────────────────────────────────────────── */
const T = {
  blue:      "#1d4ed8",
  blueSoft:  "#eff6ff",
  blueMid:   "#bfdbfe",
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
};

/* ─── card shadow ────────────────────────────────────────────── */
const cardShadow = Platform.select({
  ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  android: { elevation: 3 },
});

/* ─── booking type pill ──────────────────────────────────────── */
const typeMeta: Record<string, { label: string; bg: string; color: string; border: string }> = {
  service:    { label: "Service",    bg: T.blueSoft,  color: T.blue,  border: T.blueMid  },
  inspection: { label: "Inspection", bg: T.amberSoft, color: T.amber, border: T.amberMid },
};

/* ─── info row ───────────────────────────────────────────────── */
function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={s.infoRow}>
      <Ionicons name={icon as any} size={14} color={T.muted} style={{ flexShrink: 0, marginTop: 1 }} />
      <Text style={s.infoText}>{text}</Text>
    </View>
  );
}

/* ─── section label ──────────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <Text style={s.sectionLabel}>{text.toUpperCase()}</Text>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function BookingSuccessScreen() {
  const router   = useRouter();
  const dispatch = useAppDispatch();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => { loadLatestBooking(); }, []);

  const loadLatestBooking = async () => {
    const data = await AsyncStorage.getItem("guest_bookings");
    if (!data) { setLoading(false); return; }
    const parsed = JSON.parse(data);
    setBooking(parsed[0]);
    dispatch(clearCart());
    setLoading(false);
  };

  const openInvoice = async () => {
    if (!booking?.invoice?.invoiceUrl) return;
    const url = `https://finderzz-home-services-delivered.onrender.com${booking.invoice.invoiceUrl}`;
    await WebBrowser.openBrowserAsync(url);
  };

  /* ── loading ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={T.blue} />
        <Text style={s.loaderText}>Loading your booking…</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={s.center}>
        <Ionicons name="alert-circle-outline" size={40} color={T.muted} />
        <Text style={s.emptyTitle}>No booking found</Text>
        <Pressable style={s.homeBtn} onPress={() => router.replace("/")}>
          <Text style={s.homeBtnText}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  const { subtotal, extraCharge, totalPrice: total } = booking;
  const shortId = booking._id?.slice(-8)?.toUpperCase();
  const formattedDate = new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#052e16" />
      <ScrollView
        style={{ flex: 1, backgroundColor: T.surface }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >

        {/* ── HERO ────────────────────────────────── */}
        <LinearGradient
          colors={["#052e16", "#064e3b", "#065f46"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          {/* decorative rings */}
          <View style={[s.ring, { width: 320, height: 320, top: -120, right: -100 }]} />
          <View style={[s.ring, { width: 200, height: 200, bottom: -80, left: -60 }]} />

          {/* icon */}
          <View style={s.heroIconWrap}>
            <Ionicons name="checkmark-circle" size={42} color="#4ade80" />
          </View>

          <Text style={s.heroTitle}>Booking Confirmed!</Text>
          <Text style={s.heroSub}>Your service has been successfully scheduled</Text>

          {/* booking ID pill */}
          <View style={s.idPill}>
            <Text style={s.idPillLabel}>Booking ID: </Text>
            <Text style={s.idPillValue}>#{shortId}</Text>
            <Ionicons name="copy-outline" size={13} color="rgba(255,255,255,.6)" style={{ marginLeft: 6 }} />
          </View>
        </LinearGradient>

        {/* status strip */}
        <View style={s.statusStrip}>
          <Ionicons name="checkmark-circle" size={14} color={T.green} />
          <Text style={s.statusText}>Confirmed — a professional will be assigned shortly</Text>
        </View>

        {/* ── BODY ────────────────────────────────── */}
        <View style={s.body}>

          {/* booking details grid */}
          <View style={s.card}>
            <SectionLabel text="Booking Details" />
            <View style={s.detailGrid}>
              <View style={s.detailCell}>
                <Text style={s.detailCellLabel}>Customer Name</Text>
                <Text style={s.detailCellValue}>{booking.customerDetails?.name}</Text>
              </View>
              <View style={s.detailCell}>
                <Text style={s.detailCellLabel}>Phone</Text>
                <Text style={s.detailCellValue}>{booking.customerDetails?.phone}</Text>
              </View>
              <View style={s.detailCell}>
                <Text style={s.detailCellLabel}>Scheduled Date</Text>
                <Text style={s.detailCellValue}>{formattedDate}</Text>
              </View>
              <View style={s.detailCell}>
                <Text style={s.detailCellLabel}>Time Slot</Text>
                <Text style={s.detailCellValue}>{booking.timeSlot}</Text>
              </View>
              {booking.areaId?.name && (
                <View style={s.detailCell}>
                  <Text style={s.detailCellLabel}>Service Area</Text>
                  <Text style={s.detailCellValue}>{booking.areaId.name}</Text>
                </View>
              )}
              <View style={s.detailCell}>
                <Text style={s.detailCellLabel}>Booking ID</Text>
                <Text style={[s.detailCellValue, { fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" }]}>#{shortId}</Text>
              </View>
            </View>
          </View>

          {/* address card */}
          <View style={s.card}>
            <SectionLabel text="Service Address" />
            {[
              booking.address?.houseNumber,
              booking.address?.floorNumber && `Floor: ${booking.address.floorNumber}`,
              booking.address?.buildingName,
              booking.address?.landmark && `Near: ${booking.address.landmark}`,
              booking.address?.fullAddress,
            ].filter(Boolean).map((line, i) => (
              <InfoRow key={i} icon={i === 0 ? "home-outline" : "ellipse"} text={line!} />
            ))}
          </View>

          {/* services */}
          <View style={s.card}>
            <SectionLabel text={`Services Booked · ${booking.services?.length} item${booking.services?.length > 1 ? "s" : ""}`} />
            <View style={{ gap: 8 }}>
              {booking.services?.map((svc: any, i: number) => {
                const name = svc.bookingType === "inspection"
                  ? `${svc.serviceId?.name || "Inspection"} Inspection`
                  : svc.subServiceId?.name || svc.name || "Service";
                const meta = typeMeta[svc.bookingType] ?? typeMeta.service;
                return (
                  <View key={i} style={s.serviceRow}>
                    <View style={s.serviceLeft}>
                      <View style={[s.typeTag, { backgroundColor: meta.bg, borderColor: meta.border }]}>
                        <Text style={[s.typeTagText, { color: meta.color }]}>{meta.label}</Text>
                      </View>
                      <Text style={s.serviceName} numberOfLines={2}>{name}</Text>
                      <Text style={s.serviceMeta}>Qty {svc.quantity}</Text>
                    </View>
                    <Text style={s.servicePrice}>₹{svc.price * svc.quantity}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* what happens next */}
          <View style={[s.card, { backgroundColor: T.greenSoft, borderColor: T.greenMid }]}>
            <SectionLabel text="What happens next?" />
            {[
              { icon: "flash-outline",            color: T.amber, bg: T.amberSoft, title: "Professional assigned",   desc: "We'll match you with a verified expert shortly." },
              { icon: "call-outline",             color: T.blue,  bg: T.blueSoft,  title: "Confirmation call",       desc: "Our team will call to confirm your appointment time." },
              { icon: "checkmark-circle-outline", color: T.green, bg: T.greenSoft, title: "Service completed",       desc: "Your service will be done by our dedicated professionals." },
            ].map((step, i) => (
              <View key={i} style={[s.nextStep, i < 2 && { borderBottomWidth: 1, borderBottomColor: T.greenMid }]}>
                <View style={[s.nextStepIcon, { backgroundColor: step.bg, borderColor: step.color + "33" }]}>
                  <Ionicons name={step.icon as any} size={14} color={step.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.nextStepTitle}>{step.title}</Text>
                  <Text style={s.nextStepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* payment summary */}
          <View style={s.card}>
            <SectionLabel text="Payment Summary" />
            <View style={s.priceRow}>
              <Text style={s.priceLabel}>Service charges</Text>
              <Text style={s.priceValue}>₹{subtotal}</Text>
            </View>
            {extraCharge > 0 && (
              <View style={s.priceRow}>
                <Text style={s.priceLabel}>Area charge ({booking.areaId?.name})</Text>
                <Text style={s.priceValue}>₹{extraCharge}</Text>
              </View>
            )}
            <View style={s.priceDivider} />
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Total Paid</Text>
              <Text style={s.totalAmt}>₹{total}</Text>
            </View>
          </View>

          {/* actions */}
          {booking?.invoice?.invoiceUrl && (
            <Pressable
              style={({ pressed }) => [s.invoiceBtn, pressed && { opacity: 0.88 }]}
              onPress={openInvoice}
            >
              <Ionicons name="document-text-outline" size={15} color={T.inkSoft} />
              <Text style={s.invoiceBtnText}>Download Invoice</Text>
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [s.primaryBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="home-outline" size={15} color={T.white} />
            <Text style={s.primaryBtnText}>Back to Home</Text>
            <Ionicons name="arrow-forward" size={14} color={T.white} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.secondaryBtn, pressed && { opacity: 0.88 }]}
            onPress={() => router.push("/my-bookings")}
          >
            <Ionicons name="receipt-outline" size={14} color={T.blue} />
            <Text style={s.secondaryBtnText}>View My Bookings</Text>
          </Pressable>

          {/* trust strip */}
          <View style={s.trustRow}>
            <View style={s.trustItem}>
              <Ionicons name="shield-checkmark-outline" size={12} color={T.green} />
              <Text style={s.trustText}>Verified professional</Text>
            </View>
            <View style={s.trustItem}>
              <Ionicons name="checkmark-circle-outline" size={12} color={T.green} />
              <Text style={s.trustText}>30-day guarantee</Text>
            </View>
            <View style={s.trustItem}>
              <Ionicons name="flash-outline" size={12} color={T.amber} />
              <Text style={s.trustText}>Updates via SMS</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const s = StyleSheet.create({

  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: T.surface },
  loaderText: { fontSize: 13, color: T.muted, marginTop: 6 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: T.ink, marginTop: 8 },
  homeBtn: {
    marginTop: 16, backgroundColor: T.blue,
    paddingHorizontal: 24, paddingVertical: 11, borderRadius: 10,
  },
  homeBtnText: { fontSize: 14, fontWeight: "700", color: T.white },

  /* hero */
  hero: {
    paddingTop: Platform.OS === "ios" ? 70 : 50,
    paddingBottom: 52,
    paddingHorizontal: 24,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  heroIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 26, fontWeight: "700", color: T.white,
    letterSpacing: -0.4, marginBottom: 6, textAlign: "center",
  },
  heroSub: {
    fontSize: 13.5, color: "rgba(255,255,255,.7)",
    textAlign: "center", lineHeight: 19, marginBottom: 18,
  },
  idPill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8,
  },
  idPillLabel: { fontSize: 12.5, color: "rgba(255,255,255,.7)" },
  idPillValue: { fontSize: 12.5, fontWeight: "700", color: T.white, fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" },

  /* status strip */
  statusStrip: {
    flexDirection: "row", alignItems: "center", gap: 8,
    justifyContent: "center",
    backgroundColor: T.greenSoft,
    borderBottomWidth: 1, borderBottomColor: T.greenMid,
    paddingVertical: 10,
  },
  statusText: { fontSize: 12.5, fontWeight: "600", color: T.green },

  /* body */
  body: { padding: 16, gap: 14 },

  /* cards */
  card: {
    backgroundColor: T.white,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 16, padding: 18,
    ...cardShadow,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: "700", letterSpacing: 0.8,
    color: T.muted, marginBottom: 14, textTransform: "uppercase",
  },

  /* detail grid */
  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  detailCell: { width: "47%" },
  detailCellLabel: {
    fontSize: 10, fontWeight: "700", letterSpacing: 0.5,
    color: T.muted, textTransform: "uppercase", marginBottom: 3,
  },
  detailCellValue: { fontSize: 13.5, color: T.inkSoft, fontWeight: "500" },

  /* address */
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 8 },
  infoText: { fontSize: 13.5, color: T.inkSoft, lineHeight: 19, flex: 1 },

  /* services */
  serviceRow: {
    flexDirection: "row", alignItems: "flex-start",
    justifyContent: "space-between", gap: 10,
    backgroundColor: T.surface,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 10, padding: 12,
  },
  serviceLeft: { flex: 1, gap: 4 },
  typeTag: {
    alignSelf: "flex-start",
    borderWidth: 1, borderRadius: 999,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  typeTagText: { fontSize: 9.5, fontWeight: "700", letterSpacing: 0.4 },
  serviceName: { fontSize: 13.5, fontWeight: "600", color: T.ink, lineHeight: 18 },
  serviceMeta: { fontSize: 12, color: T.muted },
  servicePrice: { fontSize: 15, fontWeight: "700", color: T.ink, letterSpacing: -0.2 },

  /* what's next */
  nextStep: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 12 },
  nextStepIcon: {
    width: 28, height: 28, borderRadius: 8,
    borderWidth: 1,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  nextStepTitle: { fontSize: 13, fontWeight: "700", color: T.ink, marginBottom: 2 },
  nextStepDesc:  { fontSize: 12.5, color: T.muted, lineHeight: 17 },

  /* payment */
  priceRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 7,
  },
  priceLabel: { fontSize: 13, color: T.muted },
  priceValue: { fontSize: 13, fontWeight: "600", color: T.ink },
  priceDivider: { height: 1, backgroundColor: T.border, marginVertical: 10 },
  totalRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "baseline",
  },
  totalLabel: { fontSize: 15, fontWeight: "700", color: T.ink },
  totalAmt:   { fontSize: 26, fontWeight: "700", color: T.green, letterSpacing: -0.5 },

  /* buttons */
  invoiceBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7,
    backgroundColor: T.surface,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 10, paddingVertical: 12,
  },
  invoiceBtnText: { fontSize: 14, fontWeight: "600", color: T.inkSoft },

  primaryBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: T.blue,
    borderRadius: 10, paddingVertical: 14,
  },
  primaryBtnText: { fontSize: 15, fontWeight: "700", color: T.white },

  secondaryBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7,
    backgroundColor: T.blueSoft,
    borderWidth: 1, borderColor: T.blueMid,
    borderRadius: 10, paddingVertical: 12,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: "600", color: T.blue },

  trustRow:  { flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 4 },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  trustText: { fontSize: 11.5, color: T.muted },
});