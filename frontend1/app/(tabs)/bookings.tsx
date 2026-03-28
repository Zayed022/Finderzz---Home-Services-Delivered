import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Platform,
  Animated,
  RefreshControl,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import API from "@/services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

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
  red:       "#dc2626",
  redSoft:   "#fef2f2",
  purple:    "#7c3aed",
  purpleSoft:"#f5f3ff",
};

/* ─── status config ──────────────────────────────────────────── */
const STATUS: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  pending:     { label: "Pending",     color: T.amber,  bg: T.amberSoft,  border: T.amberMid,  icon: "time-outline" },
  assigned:    { label: "Assigned",    color: T.blue,   bg: T.blueSoft,   border: T.blueMid,   icon: "person-outline" },
  in_progress: { label: "In Progress", color: T.purple, bg: T.purpleSoft, border: "#ddd6fe",   icon: "construct-outline" },
  completed:   { label: "Completed",   color: T.green,  bg: T.greenSoft,  border: T.greenMid,  icon: "checkmark-circle-outline" },
  cancelled:   { label: "Cancelled",   color: T.red,    bg: T.redSoft,    border: "#fecaca",   icon: "close-circle-outline" },
};
const getStatus = (s: string) => STATUS[s] ?? { label: s?.replace("_", " ") ?? "Unknown", color: T.muted, bg: T.surface, border: T.border, icon: "ellipse-outline" };

/* ─── booking type pill meta ─────────────────────────────────── */
const typeMeta: Record<string, { label: string; bg: string; color: string; border: string }> = {
  service:    { label: "Service",    bg: T.blueSoft,  color: T.blue,  border: T.blueMid  },
  inspection: { label: "Inspection", bg: T.amberSoft, color: T.amber, border: T.amberMid },
};

/* ─── shimmer skeleton ───────────────────────────────────────── */
function SkeletonBox({ w, h, radius = 8 }: { w: number | string; h: number; radius?: number }) {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={{ width: w as any, height: h, borderRadius: radius, backgroundColor: "#e2e8f0", opacity: anim }} />;
}

function BookingSkeleton() {
  return (
    <View style={[s.card, { gap: 12 }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <SkeletonBox w={100} h={14} />
        <SkeletonBox w={72} h={24} radius={999} />
      </View>
      <SkeletonBox w="70%" h={13} />
      <SkeletonBox w="50%" h={13} />
      <SkeletonBox w="100%" h={64} radius={12} />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <SkeletonBox w={60} h={13} />
        <SkeletonBox w={80} h={20} />
      </View>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function MyBookingsScreen() {
  const router   = useRouter();
  const [bookings,    setBookings]    = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);

  useEffect(() => {
    loadBookings();
    const interval = setInterval(refreshStatuses, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadBookings = async () => {
    const data   = await AsyncStorage.getItem("guest_bookings");
    const parsed = data ? JSON.parse(data) : [];
    setBookings(parsed);
    setLoading(false);
    fetchStatuses(parsed);
  };

  const fetchStatuses = async (list: any[]) => {
    if (!list.length) return;
    try {
      const updated = await Promise.all(
        list.map(async (b) => {
          try {
            const res = await API.get(`/booking/status/${b._id}`);
            return { ...b, status: res.data.data.status };
          } catch { return b; }
        })
      );
      setBookings(updated);
      await AsyncStorage.setItem("guest_bookings", JSON.stringify(updated));
    } catch (e) { console.log("Status fetch failed", e); }
  };

  const refreshStatuses = async () => {
    const data   = await AsyncStorage.getItem("guest_bookings");
    const parsed = data ? JSON.parse(data) : [];
    if (parsed.length) fetchStatuses(parsed);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshStatuses();
    setRefreshing(false);
  };

  const openInvoice = async (invoiceUrl: string) => {
    const url = `https://finderzz-home-services-delivered.onrender.com${invoiceUrl}`;
    await WebBrowser.openBrowserAsync(url);
  };

  /* ── loading ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.surface }} edges={["top"]}>
        <View style={s.header}>
          <Text style={s.headerTitle}>My Bookings</Text>
          <Text style={s.headerSub}>Your service history</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          {[1, 2, 3].map((i) => <BookingSkeleton key={i} />)}
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ── empty ────────────────────────────────────────────────── */
  if (bookings.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.surface }} edges={["top"]}>
        <View style={s.header}>
          <Text style={s.headerTitle}>My Bookings</Text>
          <Text style={s.headerSub}>Your service history</Text>
        </View>
        <View style={s.emptyWrap}>
          <View style={s.emptyIconWrap}>
            <Ionicons name="clipboard-outline" size={32} color={T.muted} style={{ opacity: 0.5 }} />
          </View>
          <Text style={s.emptyTitle}>No bookings yet</Text>
          <Text style={s.emptySub}>Book a service to see your history here</Text>
          <Pressable style={s.exploreBtn} onPress={() => router.push("/services")}>
            <Text style={s.exploreBtnText}>Explore Services</Text>
            <Ionicons name="arrow-forward" size={14} color={T.white} />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /* ── list ─────────────────────────────────────────────────── */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.surface }} edges={["top"]}>

      {/* header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>My Bookings</Text>
          <Text style={s.headerSub}>{bookings.length} booking{bookings.length > 1 ? "s" : ""} found</Text>
        </View>
        <Pressable onPress={handleRefresh} style={s.refreshBtn}>
          <Ionicons name="refresh-outline" size={18} color={T.blue} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 14 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={T.blue} />
        }
      >
        {bookings.map((booking: any) => {
          const st          = getStatus(booking.status);
          const shortId     = booking._id?.slice(-8)?.toUpperCase();
          const formattedDate = new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
            weekday: "short", day: "numeric", month: "short", year: "numeric",
          });

          return (
            <View key={booking._id} style={s.card}>

              {/* ── top row: ID + status ──────── */}
              <View style={s.cardTop}>
                <View>
                  <Text style={s.bookingIdLabel}>BOOKING ID</Text>
                  <Text style={s.bookingId}>#{shortId}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: st.bg, borderColor: st.border }]}>
                  <Ionicons name={st.icon as any} size={12} color={st.color} />
                  <Text style={[s.statusText, { color: st.color }]}>{st.label}</Text>
                </View>
              </View>

              <View style={s.cardDivider} />

              {/* ── schedule ─────────────────── */}
              <View style={s.infoSection}>
                <View style={s.infoRow}>
                  <View style={s.infoIconWrap}>
                    <Ionicons name="calendar-outline" size={13} color={T.blue} />
                  </View>
                  <Text style={s.infoText}>{formattedDate}</Text>
                </View>
                <View style={s.infoRow}>
                  <View style={s.infoIconWrap}>
                    <Ionicons name="time-outline" size={13} color={T.blue} />
                  </View>
                  <Text style={s.infoText}>{booking.timeSlot}</Text>
                </View>
                {booking.areaId?.name && (
                  <View style={s.infoRow}>
                    <View style={s.infoIconWrap}>
                      <Ionicons name="location-outline" size={13} color={T.blue} />
                    </View>
                    <Text style={s.infoText}>{booking.areaId.name}</Text>
                  </View>
                )}
              </View>

              {/* ── services ─────────────────── */}
              <View style={s.servicesBox}>
                <Text style={s.sectionLabel}>SERVICES</Text>
                {booking.services?.map((svc: any, i: number) => {
                  const name = svc.bookingType === "inspection"
                    ? `${svc.serviceId?.name || "Inspection"} Inspection`
                    : svc.subServiceId?.name || svc.name || "Service";
                  const meta = typeMeta[svc.bookingType] ?? typeMeta.service;
                  return (
                    <View
                      key={i}
                      style={[s.serviceRow, i < booking.services.length - 1 && s.serviceRowBorder]}
                    >
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={[s.typeTag, { backgroundColor: meta.bg, borderColor: meta.border }]}>
                          <Text style={[s.typeTagText, { color: meta.color }]}>{meta.label}</Text>
                        </View>
                        <Text style={s.serviceName} numberOfLines={2}>{name}</Text>
                      </View>
                      <Text style={s.serviceQty}>×{svc.quantity}</Text>
                    </View>
                  );
                })}
              </View>

              {/* ── payment summary ───────────── */}
              <View style={s.priceRow}>
                <Text style={s.priceLabel}>Total Paid</Text>
                <Text style={s.priceValue}>₹{booking.totalPrice}</Text>
              </View>

              {/* ── invoice btn ───────────────── */}
              {booking?.invoice?.invoiceUrl && (
                <Pressable
                  style={({ pressed }) => [s.invoiceBtn, pressed && { opacity: 0.88 }]}
                  onPress={() => openInvoice(booking.invoice.invoiceUrl)}
                >
                  <Ionicons name="document-text-outline" size={14} color={T.inkSoft} />
                  <Text style={s.invoiceBtnText}>Download Invoice</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const cardShadow = Platform.select({
  ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  android: { elevation: 3 },
});

const s = StyleSheet.create({

  /* header */
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 18, paddingVertical: 14,
    backgroundColor: T.white,
    borderBottomWidth: 1, borderBottomColor: T.border,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: T.ink, letterSpacing: -0.3 },
  headerSub:   { fontSize: 12.5, color: T.muted, marginTop: 2 },
  refreshBtn:  {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: T.blueSoft, borderWidth: 1, borderColor: T.blueMid,
    alignItems: "center", justifyContent: "center",
  },

  /* empty */
  emptyWrap:    { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: T.white, borderWidth: 1, borderColor: T.border,
    alignItems: "center", justifyContent: "center", marginBottom: 16,
    ...cardShadow,
  },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: T.ink, marginBottom: 6 },
  emptySub:   { fontSize: 13.5, color: T.muted, textAlign: "center", lineHeight: 19 },
  exploreBtn: {
    marginTop: 20, flexDirection: "row", alignItems: "center", gap: 7,
    backgroundColor: T.blue, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 10,
  },
  exploreBtnText: { fontSize: 14, fontWeight: "700", color: T.white },

  /* card */
  card: {
    backgroundColor: T.white,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 16,
    overflow: "hidden",
    ...cardShadow,
  },

  cardTop: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    padding: 16,
  },
  bookingIdLabel: {
    fontSize: 9.5, fontWeight: "700", letterSpacing: 0.6,
    color: T.muted, textTransform: "uppercase", marginBottom: 3,
  },
  bookingId: { fontSize: 14, fontWeight: "700", color: T.ink, letterSpacing: 0.2 },

  statusBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, borderWidth: 1,
  },
  statusText: { fontSize: 11.5, fontWeight: "700", textTransform: "capitalize" },

  cardDivider: { height: 1, backgroundColor: T.border },

  /* info section */
  infoSection: { paddingHorizontal: 16, paddingVertical: 12, gap: 7 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoIconWrap: {
    width: 24, height: 24, borderRadius: 6,
    backgroundColor: T.blueSoft, borderWidth: 1, borderColor: T.blueMid,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  infoText: { fontSize: 13, color: T.inkSoft },

  /* services box */
  servicesBox: {
    marginHorizontal: 14, marginBottom: 12,
    backgroundColor: T.surface,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 12, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4,
  },
  sectionLabel: {
    fontSize: 9.5, fontWeight: "700", letterSpacing: 0.7,
    color: T.muted, marginBottom: 8, textTransform: "uppercase",
  },
  serviceRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingVertical: 9, gap: 8 },
  serviceRowBorder: { borderBottomWidth: 1, borderBottomColor: T.border },
  typeTag: {
    alignSelf: "flex-start", borderWidth: 1, borderRadius: 999,
    paddingHorizontal: 7, paddingVertical: 2, marginBottom: 3,
  },
  typeTagText: { fontSize: 9.5, fontWeight: "700", letterSpacing: 0.3 },
  serviceName: { fontSize: 13, fontWeight: "600", color: T.inkSoft, lineHeight: 17 },
  serviceQty:  { fontSize: 13, fontWeight: "600", color: T.muted, paddingTop: 18 },

  /* price */
  priceRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "baseline",
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: T.border,
  },
  priceLabel: { fontSize: 13, color: T.muted },
  priceValue: { fontSize: 22, fontWeight: "700", color: T.ink, letterSpacing: -0.4 },

  /* invoice button */
  invoiceBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7,
    margin: 14, marginTop: 0,
    backgroundColor: T.surface,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 10, paddingVertical: 11,
  },
  invoiceBtnText: { fontSize: 13.5, fontWeight: "600", color: T.inkSoft },
});