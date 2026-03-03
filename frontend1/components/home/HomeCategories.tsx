import {
  View,
  Text,
  FlatList,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { CategoryWithServices } from "@/types/category";
import Animated, {
  useSharedValue,
} from "react-native-reanimated";
import { useRef } from "react";
import { ServiceItem } from "./ServiceItem";

const ITEM_SIZE = 72;
const SPACING = 16;

export default function HomeCategories() {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const { data, isLoading } = useQuery<CategoryWithServices[]>({
    queryKey: ["categories-with-services"],
    queryFn: async () => {
      const res = await API.get("/category/with-services");
      return res.data.data;
    },
  });

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (!data) return null;

  return (
    <View style={{ marginTop: 28 }}>
      {data.map((category) => (
        <View key={category._id} style={{ marginBottom: 36 }}>
          {/* Category Title */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginHorizontal: 20,
              marginBottom: 8,
              color: "#111827",
            }}
          >
            {category.name}
          </Text>

          {/* Services Horizontal Scroll */}
          <Animated.FlatList
            ref={flatListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={category.services}
            keyExtractor={(item) => item._id}
            snapToInterval={ITEM_SIZE + SPACING}
            decelerationRate="fast"
            bounces={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            onScroll={(e) => {
              scrollX.value = e.nativeEvent.contentOffset.x;
            }}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <ServiceItem
                item={item}
                index={index}
                scrollX={scrollX}
              />
            )}
          />
        </View>
      ))}
    </View>
  );
}

/* ---------------- Skeleton Loader ---------------- */

function CategorySkeleton() {
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
      {[1, 2].map((_, idx) => (
        <View key={idx} style={{ marginBottom: 36 }}>
          {/* Title Skeleton */}
          <View
            style={{
              width: 160,
              height: 20,
              backgroundColor: "#E5E7EB",
              borderRadius: 6,
              marginBottom: 18,
            }}
          />

          {/* Circle Skeleton */}
          <View style={{ flexDirection: "row" }}>
            {[1, 2, 3, 4].map((_, i) => (
              <View
                key={i}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: "#E5E7EB",
                  marginRight: 16,
                }}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}