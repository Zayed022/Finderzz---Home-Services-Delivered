
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withSpring,
  Extrapolate,
} from "react-native-reanimated";

// ─── Layout constants ──────────────────────────────────────────
const CARD_WIDTH = 138;
const CARD_RADIUS = 20;
const SPACING = 14;

// ─── Design tokens ─────────────────────────────────────────────
const BRAND = "#0178BD";
const BRAND_LIGHT = "#E8F4FC";
const BRAND_MID = "#C7E5F6";
const TEXT_PRIMARY = "#0D1B2A";
const TEXT_SECONDARY = "#64748B";
const TEXT_CTA = "#0178BD";
const CARD_BG = "#FFFFFF";
const CARD_BORDER = "#EDF2F7";
const SHADOW_COLOR = "rgba(1,60,100,0.10)";

type Props = {
  item: any;
  index: number;
  scrollX: Animated.SharedValue<number>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getServiceDescription(name: string) {
  const map: Record<string, string> = {
    Electrician: "Wiring, switches & fan installation",
    Painter: "Wall painting & waterproofing",
    Plumbing: "Leaks, pipes & bathroom fixtures",
    Carpentry: "Furniture assembly & repairs",
  };
  return map[name] || "Professional service at your doorstep";
}

export function ServiceItem({ item, index, scrollX }: Props) {
  const router = useRouter();
  const pressed = useSharedValue(0);
  const isPopular: boolean = !!item.isPopular;

  const scrollStyle = useAnimatedStyle(() => {
    const center = index * (CARD_WIDTH + SPACING);
    const dist = scrollX.value - center;
    const scale = interpolate(
      dist,
      [-(CARD_WIDTH + SPACING), 0, CARD_WIDTH + SPACING],
      [0.93, 1, 0.93],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }] };
  });

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed.value ? 0.96 : 1) }],
  }));

  return (
    <AnimatedPressable
      onPress={() => router.push(`/services/${item._id}`)}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      style={[{ marginRight: SPACING }, pressStyle]}
    >
      <Animated.View style={[styles.card, isPopular && styles.cardPopular, scrollStyle]}>

        {/* ✅ Reserved badge space (fix) */}
        <View style={styles.badgeContainer}>
          {isPopular && (
            <View style={styles.badge}>
              <Text style={styles.badgeDot}>★</Text>
              <Text style={styles.badgeText}>Most Booked</Text>
            </View>
          )}
        </View>

        {/* Icon */}
        <View style={[styles.iconBox, isPopular && styles.iconBoxPopular]}>
          <View style={styles.iconBlob} />
          <Image source={{ uri: item.icon }} style={styles.icon} />
        </View>

        {/* Title */}
        <Text numberOfLines={1} style={styles.title}>
          {item.name}
        </Text>

        {/* ✅ Fixed height description */}
        <Text numberOfLines={2} style={styles.desc}>
          {getServiceDescription(item.name)}
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* CTA */}
        <View style={styles.ctaRow}>
          <Text style={styles.cta}>View details</Text>
          <View style={styles.ctaArrow}>
            <Text style={styles.ctaArrowText}>→</Text>
          </View>
        </View>

      </Animated.View>
    </AnimatedPressable>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 210, // ✅ FIXED HEIGHT (main fix)
    backgroundColor: CARD_BG,
    borderRadius: CARD_RADIUS,
    padding: 14,
    borderWidth: 1.5,
    borderColor: CARD_BORDER,
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    overflow: "hidden",
  },

  cardPopular: {
    borderColor: BRAND_MID,
    shadowColor: "rgba(1,120,189,0.18)",
    shadowRadius: 20,
    elevation: 7,
  },

  // ✅ Badge container (fix)
  badgeContainer: {
    height: 20,
    marginBottom: 8,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: BRAND,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },

  badgeDot: {
    fontSize: 7,
    color: "#FFD700",
  },

  badgeText: {
    fontSize: 8.5,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },

  iconBox: {
    width: 52,    // was 58
height: 52,   // was 58
marginBottom: 8,  // was 12
    borderRadius: 16,
    backgroundColor: "#F1F8FD",
    borderWidth: 1.5,
    borderColor: "#DAEEF8",
    alignItems: "center",
    justifyContent: "center",
    
    overflow: "hidden",
  },

  iconBoxPopular: {
    backgroundColor: BRAND_LIGHT,
    borderColor: BRAND_MID,
  },

  iconBlob: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(1,120,189,0.08)",
    transform: [{ rotate: "20deg" }],
  },

  icon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  title: {
    fontSize: 13.5,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
    marginBottom: 4,
  },

  // ✅ fixed height
  desc: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    lineHeight: 15.5,
    height: 32,
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 8,
  },

  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cta: {
    fontSize: 11.5,
    fontWeight: "700",
    color: TEXT_CTA,
  },

  ctaArrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BRAND_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  ctaArrowText: {
    fontSize: 11,
    color: BRAND,
    fontWeight: "700",
  },
});
