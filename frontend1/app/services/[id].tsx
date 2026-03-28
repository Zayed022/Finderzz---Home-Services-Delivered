import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, increaseQty, decreaseQty } from "@/store/slices/cartSlice";
import CartPreviewBar from "@/components/CartPreviewBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

/* ─── design tokens (mirrors web CSS vars) ───────────────────── */
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

export default function ServiceDetails() {
  const { id } = useLocalSearchParams();
  const router  = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s: any) => s.cart.items);
  const [showWithoutMaterial, setShowWithoutMaterial] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["service-details", id],
    queryFn: async () => {
      const res = await API.get(`/service/${id}/details`);
      return res.data.data;
    },
  });

  /* ─── helpers ────────────────────────────────────────────── */
  const getCartItem = (subServiceId: string) =>
    cartItems.find(
      (i: any) => i.subServiceId === subServiceId && i.bookingType === "service"
    );

  const addServiceToCart = (sub: any) =>
    dispatch(addToCart({
      subServiceId: sub._id,
      name: sub.name,
      price: sub.customerPrice,
      duration: sub.durationEstimate,
      bookingType: "service",
    }));

  const addInspectionToCart = (service: any) =>
    dispatch(addToCart({
      serviceId: service._id,
      name: `${service.name} Inspection`,
      price: service.inspection.price,
      duration: service.inspection.duration,
      bookingType: "inspection",
    }));

  /* ─── loading ─────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <View style={s.loader}>
        <ActivityIndicator size="large" color={T.blue} />
        <Text style={s.loaderText}>Loading service…</Text>
      </View>
    );
  }

  if (!data) return null;
  const { service, subServices } = data;
  const filteredSubServices = subServices.filter((sub: any) =>
    showWithoutMaterial
      ? sub.withMaterial === false
      : sub.withMaterial === true
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.white }}>
      <StatusBar barStyle="light-content" backgroundColor={T.ink} />

      <View style={{ flex: 1 }}>
        <ScrollView
          style={s.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >

          {/* ── HERO ────────────────────────────────── */}
          <View style={s.heroWrap}>
            {service.bannerImage ? (
              <Image source={{ uri: service.bannerImage }} style={s.banner} resizeMode="cover" />
            ) : (
              <View style={s.bannerFallback} />
            )}
            {/* gradient overlay */}
            <View style={s.bannerOverlay} />

            {/* back button */}
            <Pressable style={s.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color={T.white} />
            </Pressable>

            {/* title over banner */}
            <View style={s.heroCopy}>
              <View style={s.trustPillRow}>
                <View style={s.trustPill}>
                  <Ionicons name="shield-checkmark" size={11} color={T.green} />
                  <Text style={s.trustPillText}>Verified Pros</Text>
                </View>
                <View style={[s.trustPill, { marginLeft: 6 }]}>
                  <Ionicons name="star" size={11} color={T.amber} />
                  <Text style={s.trustPillText}>4.8 Avg</Text>
                </View>
              </View>

              <Text style={s.heroTitle}>{service.name}</Text>
              <Text style={s.heroDesc} numberOfLines={2}>{service.description}</Text>
            </View>
          </View>

          {/* ── INSPECTION CARD ─────────────────────── */}
          {service.inspection?.available && (
            <View style={s.inspCard}>
              {/* accent bar */}
              <View style={s.inspAccent} />

              <View style={{ flex: 1 }}>
                <View style={s.inspTopRow}>
                  <View style={s.inspIconWrap}>
                    <Ionicons name="search" size={15} color={T.amber} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={s.inspBadge}>INSPECTION SERVICE</Text>
                    <Text style={s.inspTitle}>Get a Professional Inspection First</Text>
                  </View>
                  <Text style={s.inspPrice}>₹{service.inspection.price}</Text>
                </View>

                {service.inspection.description ? (
                  <Text style={s.inspDesc} numberOfLines={2}>{service.inspection.description}</Text>
                ) : null}

                <View style={s.inspMeta}>
                  <Ionicons name="time-outline" size={12} color={T.muted} />
                  <Text style={s.inspMetaText}>{service.inspection.duration} mins</Text>
                </View>

                <View style={s.inspActions}>
                  <Pressable
                    style={s.viewDetailsBtn}
                    onPress={() => router.push({
                      pathname: "/inspection-details",
                      params: {
                        serviceId: service._id,
                        name: service.name,
                        price: service.inspection.price,
                        description: service.inspection.description,
                        duration: service.inspection.duration,
                      },
                    })}
                  >
                    <Text style={s.viewDetailsText}>View details</Text>
                  </Pressable>

                  <Pressable style={s.addInspBtn} onPress={() => addInspectionToCart(service)}>
                    <Text style={s.addInspText}>Add Inspection</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

<View style={{
  marginHorizontal: 16,
  marginBottom: 12,
  padding: 12,
  borderWidth: 1,
  borderColor: T.border,
  borderRadius: 14,
  backgroundColor: T.white,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}}>

  {/* Label */}
  <View>
    <Text style={{
      fontSize: 12,
      color: T.muted,
      marginBottom: 2,
      fontWeight: "500",
    }}>
      Filter
    </Text>
    <Text style={{
      fontSize: 14,
      fontWeight: "700",
      color: T.ink,
    }}>
      Material Preference
    </Text>
  </View>

  {/* Segmented Control */}
  <View style={{
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    padding: 3,
    position: "relative",
    minWidth: 190,
  }}>

    {/* Sliding Indicator */}
    <View style={{
      position: "absolute",
      top: 3,
      bottom: 3,
      left: showWithoutMaterial ? "50%" : 3,
      width: "50%",
      backgroundColor: T.white,
      borderRadius: 999,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }} />

    {/* WITH MATERIAL */}
    <Pressable
      onPress={() => setShowWithoutMaterial(false)}
      style={{
        flex: 1,
        paddingVertical: 7,
        alignItems: "center",
        zIndex: 2,
      }}
    >
      <Text style={{
        fontSize: 12.5,
        fontWeight: "700",
        color: !showWithoutMaterial ? T.ink : T.muted,
      }}>
        With Material
      </Text>
    </Pressable>

    {/* WITHOUT MATERIAL */}
    <Pressable
      onPress={() => setShowWithoutMaterial(true)}
      style={{
        flex: 1,
        paddingVertical: 7,
        alignItems: "center",
        zIndex: 2,
      }}
    >
      <Text style={{
        fontSize: 12.5,
        fontWeight: "700",
        color: showWithoutMaterial ? T.ink : T.muted,
      }}>
        Without
      </Text>
    </Pressable>

  </View>
</View>

          {/* ── SECTION HEADER ──────────────────────── */}
          <View style={s.sectionLabelRow}>
            <Text style={s.sectionLabel}>AVAILABLE SERVICES</Text>
          </View>

          {/* ── SUB SERVICE CARDS ───────────────────── */}
          <View style={s.listWrap}>
            {filteredSubServices.map((sub: any, idx: number) => {
              const cartItem = getCartItem(sub._id);
              return (
                <View key={sub._id} style={s.card}>

                  {/* top row */}
                  <View style={s.cardTop}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={s.subName}>{sub.name}</Text>
                      {sub.description ? (
                        <Text style={s.subDesc} numberOfLines={2}>{sub.description}</Text>
                      ) : null}
                      <View style={s.metaRow}>
                        <Ionicons name="time-outline" size={12} color={T.muted} />
                        <Text style={s.metaText}>{sub.durationEstimate} mins</Text>
                      </View>
                    </View>

                    <View style={s.priceCol}>
                      <Text style={s.price}>₹{sub.customerPrice}</Text>
                    </View>
                  </View>

                  {/* divider */}
                  <View style={s.cardDivider} />

                  {/* action row */}
                  <View style={s.cardActions}>
                    <Pressable
                      style={s.detailsBtn}
                      onPress={() => router.push(`/services/subservice/${sub._id}`)}
                    >
                      <Text style={s.detailsBtnText}>Details</Text>
                    </Pressable>

                    {cartItem ? (
                      <View style={s.qtyControl}>
                        <Pressable
                          style={s.qtyBtn}
                          onPress={() => dispatch(decreaseQty({ subServiceId: sub._id, bookingType: "service" }))}
                        >
                          <Ionicons name="remove" size={15} color={T.blue} />
                        </Pressable>
                        <Text style={s.qtyNum}>{cartItem.quantity}</Text>
                        <Pressable
                          style={s.qtyBtn}
                          onPress={() => dispatch(increaseQty({ subServiceId: sub._id, bookingType: "service" }))}
                        >
                          <Ionicons name="add" size={15} color={T.blue} />
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable style={s.addBtn} onPress={() => addServiceToCart(sub)}>
                        <Ionicons name="add" size={14} color={T.white} />
                        <Text style={s.addBtnText}>Add</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* ── FAQ ─────────────────────────────────── */}
          <View style={s.faqWrap}>
            <Text style={s.sectionLabel}>FAQS</Text>
            <View style={s.faqCard}>
              {[
                [`What is the cost of ${service.name}?`, "Pricing depends on service type and requirements."],
                ["Are professionals verified?", "Yes, all professionals are background-checked and trained."],
                ["Can I reschedule?", "Yes, free reschedule up to 2 hours before your appointment."],
              ].map(([q, a], i) => (
                <View key={i} style={[s.faqRow, i < 2 && s.faqBorder]}>
                  <Text style={s.faqQ}>{q}</Text>
                  <Text style={s.faqA}>{a}</Text>
                </View>
              ))}
            </View>
          </View>

        </ScrollView>

        <CartPreviewBar />
      </View>
    </SafeAreaView>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const s = StyleSheet.create({

  scroll: { flex: 1, backgroundColor: T.surface },
  loader: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: T.surface },
  loaderText: { fontSize: 13, color: T.muted, marginTop: 8 },

  /* hero */
  heroWrap: { position: "relative", height: 260 },
  banner: { width: "100%", height: 260 },
  bannerFallback: {
    width: "100%", height: 260,
    backgroundColor: T.ink,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 14 : 18,
    left: 16,
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCopy: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  trustPillRow: { flexDirection: "row", marginBottom: 8 },
  trustPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trustPillText: { fontSize: 11, color: T.white, fontWeight: "600" },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: T.white,
    lineHeight: 30,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  heroDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 18,
  },

  /* inspection card */
  inspCard: {
    margin: 16,
    backgroundColor: T.amberSoft,
    borderWidth: 1,
    borderColor: T.amberMid,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    overflow: "hidden",
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
    width: 32, height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(217,119,6,0.15)",
    borderWidth: 1,
    borderColor: "rgba(217,119,6,0.25)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  inspTopRow: { flexDirection: "row", alignItems: "flex-start" },
  inspBadge: {
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.7,
    color: T.amber,
    marginBottom: 2,
  },
  inspTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: T.ink,
    lineHeight: 18,
  },
  inspPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: T.ink,
    letterSpacing: -0.3,
    marginLeft: 8,
    marginTop: 14,
  },
  inspDesc: {
    marginTop: 8,
    fontSize: 13,
    color: T.inkSoft,
    lineHeight: 18,
  },
  inspMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  inspMetaText: { fontSize: 12, color: T.muted },
  inspActions: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  viewDetailsBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: T.amberMid,
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400e",
  },
  addInspBtn: {
    flex: 1,
    backgroundColor: T.amber,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  addInspText: {
    fontSize: 13,
    fontWeight: "700",
    color: T.white,
  },

  /* section label */
  sectionLabelRow: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 10 },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: T.muted,
  },

  /* sub-service list */
  listWrap: { paddingHorizontal: 16 },

  card: {
    backgroundColor: T.white,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },

  cardTop: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
  },

  subName: {
    fontSize: 15,
    fontWeight: "600",
    color: T.ink,
    lineHeight: 20,
  },
  subDesc: {
    fontSize: 12.5,
    color: T.muted,
    marginTop: 3,
    lineHeight: 17,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 7,
  },
  metaText: { fontSize: 12, color: T.muted },

  priceCol: { alignItems: "flex-end" },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: T.ink,
    letterSpacing: -0.4,
  },

  cardDivider: { height: 1, backgroundColor: T.border, marginHorizontal: 0 },

  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },

  detailsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: T.inkSoft,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: T.blue,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: T.white,
  },

  /* qty control */
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: T.blue,
    borderRadius: 8,
    overflow: "hidden",
  },
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyNum: {
    fontSize: 14,
    fontWeight: "700",
    color: T.blue,
    paddingHorizontal: 8,
    minWidth: 24,
    textAlign: "center",
  },

  /* faq */
  faqWrap: { margin: 16, marginTop: 8 },
  faqCard: {
    backgroundColor: T.white,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  faqRow: { paddingVertical: 14 },
  faqBorder: { borderBottomWidth: 1, borderBottomColor: T.border },
  faqQ: { fontSize: 13.5, fontWeight: "600", color: T.ink, marginBottom: 4 },
  faqA: { fontSize: 13, color: T.muted, lineHeight: 18 },
});