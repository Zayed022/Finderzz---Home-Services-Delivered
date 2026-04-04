import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { increaseQty, decreaseQty, removeFromCart } from "@/store/slices/cartSlice";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

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

/* ─── booking type pill ──────────────────────────────────────── */
const typeMeta: Record<string, { label: string; bg: string; color: string; border: string }> = {
  service:    { label: "Service",    bg: T.blueSoft,  color: T.blue,  border: T.blueMid  },
  inspection: { label: "Inspection", bg: T.amberSoft, color: T.amber, border: T.amberMid },
};

/* ─── card shadow ────────────────────────────────────────────── */
const cardShadow = Platform.select({
  ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  android: { elevation: 3 },
});

/* ─── cart item card ─────────────────────────────────────────── */
function CartCard({ item, dispatch }: { item: any; dispatch: any }) {
  const meta    = typeMeta[item.bookingType] ?? typeMeta.service;
  const payload = { subServiceId: item.subServiceId, serviceId: item.serviceId, bookingType: item.bookingType };
  const lineTotal = item.price * item.quantity;

  return (
    <View style={s.card}>

      {/* TOP ROW */}
      <View style={s.cardTop}>
        <View style={{ flex: 1, marginRight: 10 }}>

          {/* type + duration chips */}
          <View style={s.chipRow}>
            <View style={[s.typePill, { backgroundColor: meta.bg, borderColor: meta.border }]}>
              <Text style={[s.typePillText, { color: meta.color }]}>{meta.label}</Text>
            </View>
            <View style={s.durationChip}>
              <Ionicons name="time-outline" size={11} color={T.muted} />
              <Text style={s.durationText}>{item.duration} mins</Text>
            </View>
          </View>

          <Text style={s.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={s.unitPrice}>₹{item.price} per unit</Text>
        </View>

        {/* price + remove */}
        <View style={{ alignItems: "flex-end", gap: 8 }}>
          <Text style={s.lineTotal}>₹{lineTotal}</Text>
          {item.quantity > 1 && (
            <Text style={s.qtyNote}>{item.quantity} × ₹{item.price}</Text>
          )}
          <Pressable
            onPress={() => dispatch(removeFromCart(payload))}
            style={({ pressed }) => [s.removeBtn, pressed && { backgroundColor: T.redSoft }]}
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={14} color={T.muted} />
          </Pressable>
        </View>
      </View>

      {/* DIVIDER */}
      <View style={s.cardDivider} />

      {/* BOTTOM ROW */}
      <View style={s.cardBottom}>
        <Text style={s.subtotalNote}>Subtotal</Text>

        {/* QTY CONTROL */}
        <View style={s.qtyControl}>
          <Pressable style={s.qtyBtn} onPress={() => dispatch(decreaseQty(payload))}>
            <Ionicons name="remove" size={14} color={T.blue} />
          </Pressable>
          <Text style={s.qtyNum}>{item.quantity}</Text>
          <Pressable style={s.qtyBtn} onPress={() => dispatch(increaseQty(payload))}>
            <Ionicons name="add" size={14} color={T.blue} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function CartScreen() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const items    = useAppSelector((s: any) => s.cart.items);

  const subtotal  = items.reduce((a: number, i: any) => a + i.price * i.quantity, 0);
  const totalQty  = items.reduce((a: number, i: any) => a + i.quantity, 0);

  /* ── empty state ─────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <SafeAreaView style={s.emptyWrap}>
        <StatusBar barStyle="dark-content" backgroundColor={T.surface} />

        <View style={s.emptyIconWrap}>
          <Ionicons name="cart-outline" size={36} color={T.muted} />
        </View>

        <Text style={s.emptyTitle}>Your cart is empty</Text>
        <Text style={s.emptySub}>Browse services and add items to get started</Text>

        <Pressable
          style={({ pressed }) => [s.exploreBtn, pressed && { opacity: 0.88 }]}
          onPress={() => router.push("/services")}
        >
          <Text style={s.exploreBtnText}>Explore Services</Text>
          <Ionicons name="arrow-forward" size={14} color={T.white} />
        </Pressable>
      </SafeAreaView>
    );
  }

  /* ── header ──────────────────────────────────────────────── */
  const ListHeader = () => (
    <View style={s.listHeader}>
      <Pressable style={s.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={18} color={T.inkSoft} />
      </Pressable>

      <View style={s.headerTitle}>
        <Ionicons name="cart-outline" size={17} color={T.blue} />
        <Text style={s.headerTitleText}>Your Cart</Text>
        <View style={s.countBadge}>
          <Text style={s.countBadgeText}>{totalQty}</Text>
        </View>
      </View>

      <Text style={s.headerMeta}>{items.length} service{items.length > 1 ? "s" : ""}</Text>
    </View>
  );

  /* ── guarantee note ──────────────────────────────────────── */
  const ListFooter = () => (
    <View style={s.guaranteeNote}>
      <Ionicons name="checkmark-circle" size={14} color={T.green} />
      <Text style={s.guaranteeText}>
        All services include a satisfaction guarantee. Free cancellation up to 2 hrs before.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={s.wrap}>
      <StatusBar barStyle="dark-content" backgroundColor={T.white} />

      <FlatList
        data={items}
        keyExtractor={(item: any) => `${item.subServiceId || item.serviceId}_${item.bookingType}`}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => <CartCard item={item} dispatch={dispatch} />}
      />

      {/* ── CHECKOUT PANEL ──────────────────────── */}
      <View style={s.panel}>

        {/* order summary rows */}
        <View style={s.summaryRows}>
          {items.map((item: any, i: number) => (
            <View key={i} style={s.summaryRow}>
              <Text style={s.summaryName} numberOfLines={1}>
                {item.name}
                <Text style={s.summaryQty}> ×{item.quantity}</Text>
              </Text>
              <Text style={s.summaryAmt}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        <View style={s.panelDivider} />

        {/* total */}
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalAmt}>₹{subtotal}</Text>
        </View>

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [s.checkoutBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
          onPress={() => router.push("/checkout")}
        >
          <Text style={s.checkoutBtnText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={16} color={T.white} />
        </Pressable>

        {/* trust row */}
        <View style={s.trustRow}>
          <View style={s.trustItem}>
            <Ionicons name="shield-checkmark-outline" size={12} color={T.green} />
            <Text style={s.trustText}>Secure checkout</Text>
          </View>
          <View style={s.trustItem}>
            <Ionicons name="checkmark-circle-outline" size={12} color={T.green} />
            <Text style={s.trustText}>Verified pros</Text>
          </View>
          <View style={s.trustItem}>
            <Ionicons name="flash-outline" size={12} color={T.amber} />
            <Text style={s.trustText}>Instant confirm</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const s = StyleSheet.create({

  wrap: { flex: 1, backgroundColor: T.surface },

  /* empty */
  emptyWrap: {
    flex: 1, backgroundColor: T.surface,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: T.white,
    borderWidth: 1, borderColor: T.border,
    alignItems: "center", justifyContent: "center",
    marginBottom: 18,
    ...Platform.select({ ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 2 } }),
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: T.ink, marginBottom: 6 },
  emptySub:   { fontSize: 13.5, color: T.muted, textAlign: "center", lineHeight: 19 },
  exploreBtn: {
    marginTop: 24,
    flexDirection: "row", alignItems: "center", gap: 7,
    backgroundColor: T.blue,
    paddingHorizontal: 24, paddingVertical: 13,
    borderRadius: 10,
  },
  exploreBtnText: { fontSize: 14, fontWeight: "700", color: T.white },

  /* list header */
  listHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 16,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: T.white,
    borderWidth: 1, borderColor: T.border,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { flexDirection: "row", alignItems: "center", gap: 7 },
  headerTitleText: { fontSize: 17, fontWeight: "700", color: T.ink },
  countBadge: {
    backgroundColor: T.blue, borderRadius: 999,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  countBadgeText: { fontSize: 11, fontWeight: "700", color: T.white },
  headerMeta: { fontSize: 12.5, color: T.muted },

  /* cart card */
  card: {
    backgroundColor: T.white,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 16,
    overflow: "hidden",
    ...cardShadow,
  },
  cardTop: {
    flexDirection: "row",
    padding: 16,
  },
  chipRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 7 },
  typePill: {
    borderWidth: 1, borderRadius: 999,
    paddingHorizontal: 9, paddingVertical: 3,
  },
  typePillText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.4 },
  durationChip: {
    flexDirection: "row", alignItems: "center", gap: 3,
  },
  durationText: { fontSize: 11.5, color: T.muted },
  itemName: { fontSize: 15, fontWeight: "600", color: T.ink, lineHeight: 20 },
  unitPrice: { fontSize: 12, color: T.muted, marginTop: 4 },

  lineTotal: { fontSize: 17, fontWeight: "700", color: T.ink, letterSpacing: -0.3 },
  qtyNote:   { fontSize: 11.5, color: T.muted },
  removeBtn: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },

  cardDivider: { height: 1, backgroundColor: T.border },

  cardBottom: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 11,
  },
  subtotalNote: { fontSize: 12.5, color: T.muted, fontWeight: "500" },

  /* qty control */
  qtyControl: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: T.blue,
    borderRadius: 9, overflow: "hidden",
  },
  qtyBtn: {
    paddingHorizontal: 12, paddingVertical: 7,
    alignItems: "center", justifyContent: "center",
  },
  qtyNum: {
    fontSize: 14, fontWeight: "700", color: T.blue,
    paddingHorizontal: 8, minWidth: 26, textAlign: "center",
  },

  /* footer note */
  guaranteeNote: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: T.greenSoft,
    borderWidth: 1, borderColor: T.greenMid,
    borderRadius: 12, padding: 13, marginTop: 4,
  },
  guaranteeText: { fontSize: 12.5, color: "#166534", lineHeight: 17, flex: 1 },

  /* checkout panel */
  panel: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: T.white,
    borderTopWidth: 1, borderTopColor: T.border,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 18,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 14 },
      android: { elevation: 18 },
    }),
  },
  summaryRows: { gap: 4, marginBottom: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryName: { fontSize: 12.5, color: T.inkSoft, flex: 1, marginRight: 8 },
  summaryQty:  { color: T.muted },
  summaryAmt:  { fontSize: 13, fontWeight: "600", color: T.ink },

  panelDivider: { height: 1, backgroundColor: T.border, marginBottom: 12 },

  totalRow: {
    flexDirection: "row", alignItems: "baseline",
    justifyContent: "space-between", marginBottom: 14,
  },
  totalLabel: { fontSize: 15, fontWeight: "700", color: T.ink },
  totalAmt:   { fontSize: 26, fontWeight: "700", color: T.ink, letterSpacing: -0.5 },

  checkoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: T.blue,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  checkoutBtnText: { fontSize: 15, fontWeight: "700", color: T.white },

  trustRow: { flexDirection: "row", justifyContent: "center", gap: 18 },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  trustText: { fontSize: 11.5, color: T.muted },
});