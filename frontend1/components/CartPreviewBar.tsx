import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

/* ─── design tokens ──────────────────────────────────────────── */
const T = {
  blue:     "#1d4ed8",
  blueMid:  "#bfdbfe",
  blueDark: "#1e40af",
  ink:      "#0f172a",
  white:    "#ffffff",
  muted:    "rgba(255,255,255,0.65)",
  border:   "rgba(255,255,255,0.18)",
};

export default function CartPreviewBar() {
  const router = useRouter();
  const items  = useAppSelector((s: any) => s.cart.items);

  if (items.length === 0) return null;

  const total    = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const totalQty = items.reduce((s: number, i: any) => s + i.quantity, 0);
  const label    = totalQty === 1 ? "1 service" : `${totalQty} services`;

  return (
    <SafeAreaView edges={["bottom"]} style={s.wrapper}>
      <Pressable
        onPress={() => router.push("/cart")}
        style={({ pressed }) => [
          s.bar,
          pressed && s.barPressed,
        ]}
      >
        {/* ── LEFT: badge + label ────────────────── */}
        <View style={s.left}>
          <View style={s.badge}>
            <Text style={s.badgeText}>{totalQty}</Text>
          </View>

          <View style={s.labelStack}>
            <Text style={s.topLabel}>{label} added</Text>
            <Text style={s.price}>₹{total}</Text>
          </View>
        </View>

        {/* ── RIGHT: CTA ─────────────────────────── */}
        <View style={s.cta}>
          <Text style={s.ctaText}>View Cart</Text>
          <Ionicons name="arrow-forward" size={15} color={T.blue} />
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const s = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingBottom: 10,
    // no background — let page content show through
  },

  bar: {
    backgroundColor: T.blue,
    borderRadius: 16,
    paddingVertical: 13,
    paddingLeft: 14,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    ...Platform.select({
      ios: {
        shadowColor: T.blue,
        shadowOpacity: 0.45,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 14 },
    }),
  },

  barPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.985 }],
  },

  /* left */
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  badge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: T.white,
  },

  labelStack: { gap: 1 },
  topLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: T.muted,
    letterSpacing: 0.2,
  },
  price: {
    fontSize: 19,
    fontWeight: "700",
    color: T.white,
    letterSpacing: -0.4,
  },

  /* right CTA pill */
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexShrink: 0,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "700",
    color: T.blue,
  },
});