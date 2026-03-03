import Carousel from "react-native-reanimated-carousel";
import { Dimensions, View, Image } from "react-native";

const width = Dimensions.get("window").width;

const banners = [
  { id: 1, image: "https://via.placeholder.com/400x180" },
  { id: 2, image: "https://via.placeholder.com/400x180" },
];

export default function BannerCarousel() {
  return (
    <View style={{ marginBottom: 20 }}>
      <Carousel
        width={width}
        height={180}
        autoPlay
        data={banners}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={{
              width: width - 32,
              height: 180,
              borderRadius: 12,
              alignSelf: "center",
            }}
          />
        )}
      />
    </View>
  );
}