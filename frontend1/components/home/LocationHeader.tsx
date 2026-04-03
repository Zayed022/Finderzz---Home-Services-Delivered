import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLocationStore } from "@/store/location.store";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
} from "react-native-reanimated";

// ─── Tokens ────────────────────────────────────────────────────
const BRAND = "#0178BD";
const BRAND_LIGHT = "#E8F4FC";
const TEXT_PRIMARY = "#0D1B2A";
const TEXT_MUTED = "#94A3B8";
const BG = "#FFFFFF";
const BORDER = "#F0F4F8";

export default function LocationHeader() {
  const area = useLocationStore((state) => state.area);
  const loadArea = useLocationStore((state) => state.loadArea);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArea().finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} translucent={false} />

      <View style={styles.container}>
        {loading ? (
          <HeaderSkeleton />
        ) : (
          <Animated.View
            entering={FadeIn.duration(320).easing(Easing.out(Easing.ease))}
            style={styles.row}
          >
            {/* ── Location selector ── */}
            <Pressable
              onPress={() => router.push("/select-location")}
              style={({ pressed }) => [
                styles.locationBtn,
                pressed && styles.locationBtnPressed,
              ]}
            >
              {/* Pin icon bubble */}
              <View style={styles.iconBubble}>
                <Ionicons name="location" size={16} color={BRAND} />
              </View>

              {/* Text */}
              <View style={styles.textBlock}>
                <View style={styles.labelRow}>
                  <Text style={styles.labelText}>Delivering to</Text>
                </View>
                <View style={styles.locationRow}>
                  <Text numberOfLines={1} style={styles.locationName}>
                    {area?.name || "Select Location"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color={TEXT_MUTED}
                    style={styles.chevron}
                  />
                </View>
              </View>
            </Pressable>

            {/* ── Search button ── */}
            <Pressable
              onPress={() => router.push("/search")}
              style={({ pressed }) => [
                styles.searchBtn,
                pressed && styles.searchBtnPressed,
              ]}
            >
              <Ionicons name="search" size={18} color={TEXT_PRIMARY} />
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* Bottom border with subtle fade */}
      <View style={styles.bottomBorder} />
    </SafeAreaView>
  );
}

// ─── Shimmer skeleton ─────────────────────────────────────────
function ShimmerBlock({ width, height, radius = 6 }: { width: number; height: number; radius?: number }) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius, backgroundColor: "#E8EDF2" }, animStyle]}
    />
  );
}

function HeaderSkeleton() {
  return (
    <View style={styles.row}>
      <View style={styles.locationBtn}>
        {/* Icon circle */}
        <ShimmerBlock width={36} height={36} radius={18} />

        <View style={[styles.textBlock, { gap: 6 }]}>
          <ShimmerBlock width={80} height={9} radius={4} />
          <ShimmerBlock width={130} height={15} radius={6} />
        </View>
      </View>

      {/* Search icon */}
      <ShimmerBlock width={36} height={36} radius={18} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    backgroundColor: BG,
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: BG,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // ── Location selector ──
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flex: 1,
    marginRight: 8,
  },
  locationBtnPressed: {
    backgroundColor: "#F4F8FB",
  },

  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BRAND_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    // Soft ring
    borderWidth: 1.5,
    borderColor: "#C7E5F6",
  },

  textBlock: {
    marginLeft: 10,
    flex: 1,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 1,
  },

  labelText: {
    fontSize: 10.5,
    fontWeight: "500",
    color: TEXT_MUTED,
    letterSpacing: 0.3,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationName: {
    fontSize: 15.5,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
    flexShrink: 1,
  },

  chevron: {
    marginLeft: 3,
    marginTop: 1,
  },

  // ── Search button ──
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F4F8FB",
    borderWidth: 1.5,
    borderColor: "#EAF0F6",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnPressed: {
    backgroundColor: BRAND_LIGHT,
    borderColor: "#C7E5F6",
  },

  bottomBorder: {
    height: 1,
    backgroundColor: BORDER,
  },
});