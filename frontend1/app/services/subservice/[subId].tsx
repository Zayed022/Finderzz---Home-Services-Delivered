import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, increaseQty, decreaseQty } from "@/store/slices/cartSlice";
import { SafeAreaView } from "react-native-safe-area-context";

/* ─── design tokens ──────────────────────────────────────────── */
const T = {
  blue:       "#1d4ed8",
  blueSoft:   "#eff6ff",
  blueMid:    "#bfdbfe",
  ink:        "#0f172a",
  inkSoft:    "#334155",
  muted:      "#64748b",
  border:     "#e2e8f0",
  surface:    "#f8fafc",
  white:      "#ffffff",
  green:      "#16a34a",
  greenSoft:  "#f0fdf4",
  greenMid:   "#bbf7d0",
  amber:      "#d97706",
  amberSoft:  "#fffbeb",
  amberMid:   "#fcd34d",
};

/* ─── section label ──────────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <Text style={{
      fontSize: 10.5, fontWeight: "700", letterSpacing: 0.8,
      color: T.muted, marginBottom: 10,
    }}>
      {text.toUpperCase()}
    </Text>
  );
}

/* ─── check item ─────────────────────────────────────────────── */
function CheckItem({ text, color = T.green }: { text: string; color?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
      <View style={{
        width: 20, height: 20, borderRadius: 6,
        backgroundColor: T.greenSoft,
        borderWidth: 1, borderColor: T.greenMid,
        alignItems: "center", justifyContent: "center", marginTop: 1,
      }}>
        <Ionicons name="checkmark" size={12} color={T.green} />
      </View>
      <Text style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 20, flex: 1 }}>{text}</Text>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function SubServiceDetails() {
  const { subId } = useLocalSearchParams();
  const router    = useRouter();
  const dispatch  = useAppDispatch();
  const cartItems = useAppSelector((s: any) => s.cart.items);

  const { data, isLoading } = useQuery({
    queryKey: ["subservice-details", subId],
    queryFn: async () => {
      const res = await API.get(`/subService/${subId}`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <View style={s.loader}>
        <ActivityIndicator size="large" color={T.blue} />
        <Text style={s.loaderText}>Loading service…</Text>
      </View>
    );
  }

  if (!data) return null;

  /* cart state */
  const serviceItem = cartItems.find(
    (i: any) => i.subServiceId === data._id && i.bookingType === "service"
  );
  const cartTotal = cartItems.reduce((a: number, i: any) => a + i.price * i.quantity, 0);

  /* actions */
  const addService = () =>
    dispatch(addToCart({
      subServiceId: data._id,
      name: data.name,
      price: data.customerPrice,
      duration: data.durationEstimate,
      bookingType: "service",
    }));

  const whyItems = [
    "Accurate diagnosis before any work begins",
    "Avoid unnecessary or costly repairs",
    "Transparent pricing — no hidden charges",
  ];

  const highlights = data.highlights ?? [
    "Professional staff",
    "Eco-friendly products",
    "30-day service guarantee",
    "Instant booking confirmation",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.white }}>
      <StatusBar barStyle="light-content" backgroundColor={T.ink} />

      <View style={{ flex: 1 }}>
        <ScrollView
          style={s.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
        >

          {/* ── HERO ────────────────────────────────── */}
          <View style={s.hero}>
            {/* grid texture overlay */}
            <View style={s.heroGrid} />
            <View style={s.heroGlow} />

            {/* back */}
            <Pressable style={s.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color={T.white} />
            </Pressable>

            {/* badge */}
            <View style={s.heroBadge}>
              <Ionicons name="star" size={10} color="#fbbf24" />
              <Text style={s.heroBadgeText}>Top Rated</Text>
            </View>

            <Text style={s.heroTitle}>{data.name}{"\n"}in Bhiwandi</Text>

            {/* meta chips */}
            <View style={s.heroMetaRow}>
              <View style={s.heroChip}>
                <Ionicons name="star" size={12} color="#fbbf24" />
                <Text style={s.heroChipText}>4.8 rating</Text>
              </View>
              <View style={s.heroChip}>
                <Ionicons name="time-outline" size={12} color="rgba(255,255,255,.75)" />
                <Text style={s.heroChipText}>{data.durationEstimate} mins</Text>
              </View>
              {data.durationEstimate <= 30 && (
                <View style={s.heroChip}>
                  <Ionicons name="flash" size={12} color="#fbbf24" />
                  <Text style={s.heroChipText}>Express</Text>
                </View>
              )}
            </View>
          </View>

          {/* ── STAT CHIPS ──────────────────────────── */}
          <View style={s.statRow}>
            <View style={[s.statChip, { flex: 1 }]}>
              <Text style={s.statLabel}>DURATION</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="time-outline" size={14} color={T.muted} />
                <Text style={s.statValue}>{data.durationEstimate} min</Text>
              </View>
            </View>

            <View style={[s.statChip, s.statChipBlue, { flex: 1 }]}>
              <Text style={[s.statLabel, { color: T.blue }]}>STARTING AT</Text>
              <Text style={[s.statValue, { color: T.blue }]}>₹{data.customerPrice}</Text>
            </View>

            <View style={[s.statChip, data.durationEstimate <= 30 ? s.statChipGreen : {}, { flex: 1 }]}>
              <Text style={[s.statLabel, data.durationEstimate <= 30 ? { color: T.green } : {}]}>SPEED</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons
                  name={data.durationEstimate <= 30 ? "flash" : "time-outline"}
                  size={13}
                  color={data.durationEstimate <= 30 ? T.green : T.muted}
                />
                <Text style={[s.statValue, data.durationEstimate <= 30 ? { color: T.green } : {}]}>
                  {data.durationEstimate <= 30 ? "Express" : "Standard"}
                </Text>
              </View>
            </View>
          </View>

          <View style={s.body}>

            {/* ── ABOUT ───────────────────────────────── */}
            <View style={s.card}>
              <SectionLabel text="About this service" />
              <Text style={s.bodyText}>
                {data.description || "Professional service delivered by trained experts using high-quality tools."}
              </Text>
              <Text style={[s.bodyText, { marginTop: 10 }]}>
                Looking for {data.name} in Bhiwandi? Finderzz connects you with trusted professionals for fast, doorstep service.
              </Text>
            </View>

            {/* ── HIGHLIGHTS ──────────────────────────── */}
            <View style={s.highlightsWrap}>
              <SectionLabel text="Highlights" />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {highlights.map((h: string, i: number) => (
                  <View key={i} style={s.highlightPill}>
                    <Ionicons name="checkmark-circle" size={13} color={T.green} />
                    <Text style={s.highlightText}>{h}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ── WHAT'S INCLUDED ─────────────────────── */}
            {data.features?.length > 0 && (
              <View style={s.card}>
                <SectionLabel text="What's included" />
                {data.features.map((f: string, i: number) => (
                  <CheckItem key={i} text={f} />
                ))}
              </View>
            )}

            {/* ── WHY INSPECTION ──────────────────────── */}
            {data.inspectionAvailable && (
              <View style={s.inspCard}>
                <View style={s.inspAccent} />
                <View style={s.inspIconWrap}>
                  <Ionicons name="search" size={15} color={T.amber} />
                </View>
                <Text style={s.inspBadgeText}>INSPECTION AVAILABLE</Text>
                <Text style={s.inspTitle}>Recommended: Get an inspection first</Text>
                <Text style={s.inspDesc}>
                  Our expert will diagnose the issue and provide transparent pricing before work begins.
                </Text>
                <View style={{ marginTop: 12, gap: 6 }}>
                  {whyItems.map((t, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                      <Ionicons name="checkmark-circle" size={14} color={T.amber} />
                      <Text style={{ fontSize: 13, color: "#92400e" }}>{t}</Text>
                    </View>
                  ))}
                </View>
                {data.inspectionPrice && (
                  <View style={s.inspPriceRow}>
                    <Text style={s.inspPriceLabel}>Inspection fee</Text>
                    <Text style={s.inspPriceValue}>₹{data.inspectionPrice}</Text>
                  </View>
                )}
              </View>
            )}

            {/* ── OUR PROCESS ─────────────────────────── */}
{data?.processId?.steps?.length > 0 && (
  <View style={s.card}>
    <SectionLabel text="Our Process" />

    <View style={{ position: "relative", paddingLeft: 6 }}>

      {/* Vertical Line */}
      <View
        style={{
          position: "absolute",
          left: 12,
          top: 6,
          bottom: 6,
          width: 2,
          backgroundColor: "#e5e7eb",
        }}
      />

      <View style={{ gap: 22 }}>
        {data.processId.steps.map((step: any, index: number) => (
          <View key={index} style={{ flexDirection: "row", gap: 12 }}>

            {/* Step Circle */}
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                backgroundColor: "#f3f4f6",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#111827" }}>
                {step.stepNumber}
              </Text>
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: 4,
                }}
              >
                {step.title}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  lineHeight: 18,
                }}
              >
                {step.description}
              </Text>
            </View>

          </View>
        ))}
      </View>
    </View>
  </View>
)}

            {/* ── WHY FINDERZZ ────────────────────────── */}
            <View style={s.card}>
              <SectionLabel text="Why Finderzz?" />
              {[
                { icon: "shield-checkmark-outline", text: "Background-verified professionals" },
                { icon: "checkmark-circle-outline", text: "30-day service guarantee" },
                { icon: "flash-outline",            text: "Instant booking confirmation" },
                { icon: "star-outline",             text: "4.8 avg. rating across 2,000+ bookings" },
              ].map((item, i) => (
                <View key={i} style={[s.whyRow, i < 3 && { borderBottomWidth: 1, borderBottomColor: T.border }]}>
                  <Ionicons name={item.icon as any} size={15} color={T.green} />
                  <Text style={s.whyText}>{item.text}</Text>
                </View>
              ))}
            </View>

          </View>
        </ScrollView>

        {/* ── BOTTOM CTA ──────────────────────────── */}
        <View style={s.bottomBar}>
          <View style={s.bottomInner}>
            <View>
              <Text style={s.bottomLabel}>Service price</Text>
              <Text style={s.bottomPrice}>₹{data.customerPrice}</Text>
            </View>

            {serviceItem ? (
              <View style={s.qtyControl}>
                <Pressable
                  style={s.qtyBtn}
                  onPress={() => dispatch(decreaseQty({ subServiceId: data._id, bookingType: "service" }))}
                >
                  <Ionicons name="remove" size={16} color={T.blue} />
                </Pressable>
                <Text style={s.qtyNum}>{serviceItem.quantity}</Text>
                <Pressable
                  style={s.qtyBtn}
                  onPress={() => dispatch(increaseQty({ subServiceId: data._id, bookingType: "service" }))}
                >
                  <Ionicons name="add" size={16} color={T.blue} />
                </Pressable>
              </View>
            ) : (
              <Pressable style={s.addBtn} onPress={addService}>
                <Ionicons name="cart-outline" size={15} color={T.white} />
                <Text style={s.addBtnText}>Add to Cart</Text>
              </Pressable>
            )}
          </View>

          {serviceItem && cartTotal > 0 && (
            <Pressable style={s.viewCartBtn} onPress={() => router.push("/cart")}>
              <Text style={s.viewCartText}>View Cart · ₹{cartTotal}</Text>
              <Ionicons name="arrow-forward" size={14} color={T.blue} />
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
  },
  android: { elevation: 4 },
});

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: T.surface },

  loader: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: T.surface },
  loaderText: { fontSize: 13, color: T.muted, marginTop: 8 },

  /* ── hero ── */
  hero: {
    height: 300,
    backgroundColor: T.ink,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: "hidden",
    position: "relative",
  },
  heroGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
    // subtle grid via background — rendered as thin lines
    borderWidth: 0,
  },
  heroGlow: {
    ...StyleSheet.absoluteFillObject,
    
    // radial glow approximation
    borderRadius: 999,
    top: -100, right: -80,
    width: 320, height: 320,
    backgroundColor: "rgba(99,179,237,0.1)",
    position: "absolute",
  },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 14 : 18,
    left: 16,
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center", justifyContent: "center",
  },
  heroBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4,
    alignSelf: "flex-start", marginBottom: 10,
  },
  heroBadgeText: { fontSize: 11, fontWeight: "700", color: T.white, letterSpacing: 0.5 },
  heroTitle: {
    fontSize: 26, fontWeight: "700", color: T.white,
    lineHeight: 32, letterSpacing: -0.4, marginBottom: 14,
  },
  heroMetaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  heroChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5,
  },
  heroChipText: { fontSize: 12, color: "rgba(255,255,255,.8)", fontWeight: "500" },

  /* ── stat row ── */
  statRow: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    paddingBottom: 4,
  },
  statChip: {
    backgroundColor: T.surface,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 12, padding: 12,
    gap: 5,
  },
  statChipBlue: { backgroundColor: T.blueSoft, borderColor: T.blueMid },
  statChipGreen: { backgroundColor: T.greenSoft, borderColor: T.greenMid },
  statLabel: {
    fontSize: 9.5, fontWeight: "700", letterSpacing: 0.6,
    color: T.muted, textTransform: "uppercase",
  },
  statValue: { fontSize: 14, fontWeight: "700", color: T.ink },

  /* ── body ── */
  body: { padding: 16, gap: 14 },

  card: {
    backgroundColor: T.white,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 16,
    padding: 18,
    ...shadow,
  },
  bodyText: { fontSize: 14, color: T.muted, lineHeight: 21 },

  /* highlights */
  highlightsWrap: { gap: 10 },
  highlightPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: T.surface,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  highlightText: { fontSize: 12.5, color: T.inkSoft, fontWeight: "500" },

  /* why rows */
  whyRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 10,
  },
  whyText: { fontSize: 13.5, color: T.inkSoft },

  /* inspection card */
  inspCard: {
    backgroundColor: T.amberSoft,
    borderWidth: 1, borderColor: T.amberMid,
    borderRadius: 16,
    padding: 18,
    overflow: "hidden",
    position: "relative",
  },
  inspAccent: {
    position: "absolute",
    left: 0, top: 0, bottom: 0,
    width: 4,
    backgroundColor: T.amber,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  inspIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "rgba(217,119,6,0.12)",
    borderWidth: 1, borderColor: "rgba(217,119,6,0.25)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  inspBadgeText: {
    fontSize: 9.5, fontWeight: "700", letterSpacing: 0.7,
    color: T.amber, marginBottom: 4,
  },
  inspTitle: { fontSize: 14, fontWeight: "700", color: T.ink, marginBottom: 6 },
  inspDesc: { fontSize: 13, color: T.inkSoft, lineHeight: 18 },
  inspPriceRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginTop: 14, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: "rgba(252,211,77,0.5)",
  },
  inspPriceLabel: { fontSize: 12.5, color: "#92400e", fontWeight: "500" },
  inspPriceValue: { fontSize: 18, fontWeight: "700", color: T.ink },

  /* ── bottom CTA ── */
  bottomBar: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: 1, borderTopColor: T.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 14,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 10 },
      android: { elevation: 16 },
    }),
  },
  bottomInner: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
  },
  bottomLabel: { fontSize: 10.5, fontWeight: "700", letterSpacing: 0.5, color: T.muted, textTransform: "uppercase" },
  bottomPrice: { fontSize: 22, fontWeight: "700", color: T.ink, letterSpacing: -0.5, marginTop: 2 },

  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 7,
    backgroundColor: T.blue,
    paddingHorizontal: 22, paddingVertical: 12,
    borderRadius: 10,
  },
  addBtnText: { fontSize: 14, fontWeight: "700", color: T.white },

  qtyControl: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: T.blue,
    borderRadius: 10, overflow: "hidden",
  },
  qtyBtn: {
    paddingHorizontal: 14, paddingVertical: 10,
    alignItems: "center", justifyContent: "center",
  },
  qtyNum: {
    fontSize: 15, fontWeight: "700", color: T.blue,
    paddingHorizontal: 10, minWidth: 30, textAlign: "center",
  },

  viewCartBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, marginTop: 10,
    backgroundColor: T.blueSoft,
    borderWidth: 1, borderColor: T.blueMid,
    borderRadius: 10, paddingVertical: 10,
  },
  viewCartText: { fontSize: 13.5, fontWeight: "600", color: T.blue },
});