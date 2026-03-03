import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const ITEM_SIZE = 66;
const SPACING = 16;
const BADGE_HEIGHT = 20;

type Props = {
  item: any;
  index: number;
  scrollX: Animated.SharedValue<number>;
};

export function ServiceItem({ item, index, scrollX }: Props) {
  const router = useRouter();

  const animatedStyle = useAnimatedStyle(() => {
    const position =
      index * (ITEM_SIZE + SPACING) - scrollX.value;

    const scale = interpolate(
      position,
      [-ITEM_SIZE, 0, ITEM_SIZE],
      [0.92, 1, 0.92],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Pressable
      onPress={() => router.push(`/services/${item._id}`)}
      style={{ marginRight: SPACING }}
    >
      <Animated.View
        style={[
          {
            width: ITEM_SIZE,
            alignItems: "center",
            paddingTop: BADGE_HEIGHT,
          },
          animatedStyle,
        ]}
      >
        {/* Popular Badge */}
        {item.isPopular && (
          <View
            style={{
              position: "absolute",
              top: 0,
              alignSelf: "center",
              backgroundColor: "#16A34A",
              paddingHorizontal: 10,
              height: BADGE_HEIGHT,
              borderRadius: BADGE_HEIGHT / 2,
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: "700",
                color: "#FFFFFF",
                letterSpacing: 0.4,
              }}
            >
              POPULAR
            </Text>
          </View>
        )}

        {/* Circle */}
        <View
          style={{
            width: ITEM_SIZE,
            height: ITEM_SIZE,
            borderRadius: ITEM_SIZE / 2,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1.5,
            borderColor: item.isPopular
              ? "#16A34A"
              : "#E5E7EB",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          }}
        >
          <Image
            source={{ uri: item.icon }}
            style={{
              width: 30,
              height: 30,
              resizeMode: "contain",
            }}
          />
        </View>

        {/* Label */}
        <Text
          numberOfLines={2}
          style={{
            marginTop: 10,
            fontSize: 13,
            fontWeight: "600",
            textAlign: "center",
            color: "#374151",
            width: ITEM_SIZE,
          }}
        >
          {item.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
}