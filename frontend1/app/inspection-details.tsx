import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, increaseQty, decreaseQty } from "@/store/slices/cartSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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
  amberDark: "#92400e",
};

/* ─── reusable section label ─────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <Text style={{
      fontSize: 10.5, fontWeight: "700", letterSpacing: 0.8,
      color: T.muted, marginBottom: 12, textTransform: "uppercase",
    }}>
      {text}
    </Text>
  );
}

/* ─── benefit row ────────────────────────────────────────────── */
function BenefitRow({
  icon, iconColor, iconBg, text, last = false,
}: {
  icon: string; iconColor: string; iconBg: string; text: string; last?: boolean;
}) {
  return (
    <View style={[s.benefitRow, !last && { borderBottomWidth: 1, borderBottomColor: T.border }]}>
      <View style={[s.benefitIconWrap, { backgroundColor: iconBg, borderColor: iconColor + "44" }]}>
        <Ionicons name={icon as any} size={14} color={iconColor} />
      </View>
      <Text style={s.benefitText}>{text}</Text>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function InspectionDetails() {
  const params   = useLocalSearchParams();
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s: any) => s.cart.items);

  const { serviceId, name, price, description, duration } = params as Record<string, string>;

  /* cart state */
  const cartItem = cartItems.find(
    (i: any) => i.serviceId === serviceId && i.bookingType === "inspection"
  );
  const cartTotal = cartItems.reduce((a: number, i: any) => a + i.price * i.quantity, 0);

  const handleAdd = () =>
    dispatch(addToCart({
      serviceId,
      name: `${name} Inspection`,
      price: Number(price),
      duration: Number(duration),
      bookingType: "inspection",
    }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.white }}>
      <StatusBar barStyle="light-content" backgroundColor="#78350f" />

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
        >

          {/* ── HERO ────────────────────────────────── */}
          <View style={s.hero}>
            {/* decorative ring */}
            <View style={s.heroRing} />
            <View style={s.heroRing2} />

            {/* back */}
            <Pressable style={s.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color={T.white} />
            </Pressable>

            {/* top-right tag */}
            <View style={s.heroTag}>
              <Ionicons name="search" size={11} color="#78350f" />
              <Text style={s.heroTagText}>Inspection</Text>
            </View>

            {/* content */}
            <View style={s.heroCopy}>
              <Text style={s.heroTitle}>{name} Inspection</Text>

              <View style={s.heroMetaRow}>
                <View style={s.heroChip}>
                  <Ionicons name="time-outline" size={12} color="rgba(255,255,255,.8)" />
                  <Text style={s.heroChipText}>{duration} mins</Text>
                </View>
                <View style={s.heroChip}>
                  <Ionicons name="star" size={12} color="#fbbf24" />
                  <Text style={s.heroChipText}>4.7 rating</Text>
                </View>
                <View style={s.heroChip}>
                  <Ionicons name="flash" size={12} color="#fbbf24" />
                  <Text style={s.heroChipText}>Fast service</Text>
                </View>
                <View style={s.heroChip}>
                  <Ionicons name="shield-checkmark-outline" size={12} color="rgba(255,255,255,.8)" />
                  <Text style={s.heroChipText}>Verified Pro</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={s.body}>

            {/* ── ABOUT ───────────────────────────────── */}
            <View style={s.card}>
              <SectionLabel text="About this inspection" />
              <Text style={s.bodyText}>
                {description || "Our professional will inspect the issue and provide an accurate diagnosis along with repair recommendations."}
              </Text>
            </View>

            {/* ── BENEFITS ────────────────────────────── */}
            <View style={s.card}>
              <SectionLabel text="Why inspection is important" />
              <BenefitRow icon="search-outline"        iconColor={T.amber}  iconBg={T.amberSoft} text="Accurate problem diagnosis before work begins" />
              <BenefitRow icon="construct-outline"     iconColor={T.amber}  iconBg={T.amberSoft} text="Avoid unnecessary or costly repairs" />
              <BenefitRow icon="medal-outline"         iconColor={T.amber}  iconBg={T.amberSoft} text="Expert recommendations you can trust" />
              <BenefitRow icon="pricetag-outline"      iconColor={T.amber}  iconBg={T.amberSoft} text="Transparent pricing — no hidden charges" last />
            </View>

            {/* ── TRUST ───────────────────────────────── */}
            <View style={s.card}>
              <SectionLabel text="Why choose Finderzz" />
              <BenefitRow icon="shield-checkmark-outline" iconColor={T.green} iconBg={T.greenSoft} text="Background-verified professionals" />
              <BenefitRow icon="checkmark-circle-outline" iconColor={T.green} iconBg={T.greenSoft} text="30-day service guarantee on all work" />
              <BenefitRow icon="flash-outline"            iconColor={T.amber} iconBg={T.amberSoft} text="Instant booking confirmation" />
              <BenefitRow icon="star-outline"             iconColor={T.amber} iconBg={T.amberSoft} text="4.7 avg. rating across 2,000+ bookings" last />
            </View>

            {/* ── NOTICE ──────────────────────────────── */}
            <View style={s.notice}>
              <View style={s.noticeIconWrap}>
                <Ionicons name="information-circle-outline" size={18} color={T.amber} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.noticeBold}>Good to know</Text>
                <Text style={s.noticeText}>
                  The inspection fee will be adjusted against your final service cost if you proceed with the repair — you only pay once.
                </Text>
              </View>
            </View>

          </View>
        </ScrollView>

        {/* ── BOTTOM CTA ──────────────────────────── */}
        <View style={s.bottomBar}>
          <View style={s.bottomInner}>
            <View>
              <Text style={s.bottomLabel}>Inspection fee</Text>
              <Text style={s.bottomPrice}>₹{price}</Text>
            </View>

            {cartItem ? (
              <View style={s.qtyControl}>
                <Pressable
                  style={s.qtyBtn}
                  onPress={() => dispatch(decreaseQty({ serviceId, bookingType: "inspection" }))}
                >
                  <Ionicons name="remove" size={16} color={T.amber} />
                </Pressable>
                <Text style={s.qtyNum}>{cartItem.quantity}</Text>
                <Pressable
                  style={s.qtyBtn}
                  onPress={() => dispatch(increaseQty({ serviceId, bookingType: "inspection" }))}
                >
                  <Ionicons name="add" size={16} color={T.amber} />
                </Pressable>
              </View>
            ) : (
              <Pressable style={s.addBtn} onPress={handleAdd}>
                <Ionicons name="cart-outline" size={15} color={T.white} />
                <Text style={s.addBtnText}>Book Inspection</Text>
              </Pressable>
            )}
          </View>

          {cartItem && cartTotal > 0 && (
            <Pressable style={s.viewCartBtn} onPress={() => router.push("/cart")}>
              <Text style={s.viewCartText}>View Cart · ₹{cartTotal}</Text>
              <Ionicons name="arrow-forward" size={14} color={T.blue} />
            </Pressable>
          )}

          {/* fee offset hint */}
          <View style={s.feeHint}>
            <Ionicons name="checkmark-circle" size={13} color={T.green} />
            <Text style={s.feeHintText}>Fee adjusted in final service cost if you proceed with repair</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const cardShadow = Platform.select({
  ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  android: { elevation: 3 },
});

const s = StyleSheet.create({
  /* hero */
  hero: {
    height: 290,
    backgroundColor: "#78350f",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: "hidden",
    position: "relative",
    // amber multi-stop gradient approximated with bg color
    // React Native doesn't support gradients natively — use expo-linear-gradient if available
  },
  heroRing: {
    position: "absolute",
    width: 380, height: 380,
    borderRadius: 190,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    top: -160, right: -120,
  },
  heroRing2: {
    position: "absolute",
    width: 260, height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    bottom: -120, left: -60,
  },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 14 : 18,
    left: 16,
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  heroTag: {
    position: "absolute",
    top: Platform.OS === "ios" ? 14 : 18,
    right: 16,
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  heroTagText: { fontSize: 11, fontWeight: "700", color: "#78350f" },

  heroCopy: { gap: 14 },
  heroTitle: {
    fontSize: 26, fontWeight: "700",
    color: T.white, lineHeight: 32, letterSpacing: -0.4,
  },
  heroMetaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  heroChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(0,0,0,0.22)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5,
  },
  heroChipText: { fontSize: 12, color: "rgba(255,255,255,.82)", fontWeight: "500" },

  /* body */
  body: { padding: 16, gap: 14 },

  card: {
    backgroundColor: T.white,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 16,
    padding: 18,
    ...cardShadow,
  },
  bodyText: { fontSize: 14, color: T.muted, lineHeight: 21 },

  /* benefit rows */
  benefitRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 11,
  },
  benefitIconWrap: {
    width: 30, height: 30, borderRadius: 8,
    borderWidth: 1,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  benefitText: { fontSize: 13.5, color: T.inkSoft, lineHeight: 18, flex: 1 },

  /* notice */
  notice: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    backgroundColor: T.amberSoft,
    borderWidth: 1, borderColor: T.amberMid,
    borderRadius: 14, padding: 14,
  },
  noticeIconWrap: { marginTop: 1, flexShrink: 0 },
  noticeBold: { fontSize: 13, fontWeight: "700", color: T.amberDark, marginBottom: 3 },
  noticeText: { fontSize: 13, color: T.amberDark, lineHeight: 18 },

  /* bottom bar */
  bottomBar: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: 1, borderTopColor: T.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 14,
    gap: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 10 },
      android: { elevation: 16 },
    }),
  },
  bottomInner: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
  },
  bottomLabel: {
    fontSize: 10.5, fontWeight: "700", letterSpacing: 0.5,
    color: T.muted, textTransform: "uppercase",
  },
  bottomPrice: {
    fontSize: 24, fontWeight: "700", color: T.ink,
    letterSpacing: -0.5, marginTop: 2,
  },

  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 7,
    backgroundColor: T.amber,
    paddingHorizontal: 22, paddingVertical: 12,
    borderRadius: 10,
  },
  addBtnText: { fontSize: 14, fontWeight: "700", color: T.white },

  qtyControl: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: T.amber,
    borderRadius: 10, overflow: "hidden",
  },
  qtyBtn: {
    paddingHorizontal: 14, paddingVertical: 10,
    alignItems: "center", justifyContent: "center",
  },
  qtyNum: {
    fontSize: 15, fontWeight: "700", color: T.amber,
    paddingHorizontal: 10, minWidth: 30, textAlign: "center",
  },

  viewCartBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6,
    backgroundColor: T.blueSoft,
    borderWidth: 1, borderColor: T.blueMid,
    borderRadius: 10, paddingVertical: 10,
  },
  viewCartText: { fontSize: 13.5, fontWeight: "600", color: T.blue },

  feeHint: {
    flexDirection: "row", alignItems: "center", gap: 6,
    justifyContent: "center",
  },
  feeHintText: { fontSize: 12, color: T.muted },
});