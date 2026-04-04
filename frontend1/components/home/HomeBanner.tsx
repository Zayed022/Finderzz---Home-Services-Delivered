import { View, Dimensions, Image, Pressable } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = width * 0.45;

type Banner = {
  _id: string;
  bannerImage: string;
  title?: string;
  redirectUrl?: string;
  order?: number;
};

export default function HomeBanner() {
  const router = useRouter();

  const { data, isLoading } = useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await API.get("/banner/active");
      return res.data.data as Banner[];
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <BannerSkeleton />;
  }

  if (!data || data.length === 0) return null;

  return (
    <View style={{ marginTop: 16 }}>
      <Carousel
        width={width}
        height={BANNER_HEIGHT}
        autoPlay
        autoPlayInterval={4000}
        data={data}
        scrollAnimationDuration={800}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (item.redirectUrl) {
                router.push("/services");
              }
            }}
            style={{ paddingHorizontal: 20 }}
          >
            <Image
              source={{ uri: item.bannerImage }}
              resizeMode="cover"
              style={{
                width: width - 40,
                height: BANNER_HEIGHT,
                borderRadius: 18,
              }}
            />
          </Pressable>
        )}
      />
    </View>
  );
}

/* ---------------- Banner Skeleton ---------------- */

function BannerSkeleton() {
  return (
    <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
      <View
        style={{
          width: width - 40,
          height: BANNER_HEIGHT,
          backgroundColor: "#E5E7EB",
          borderRadius: 18,
        }}
      />
    </View>
  );
}