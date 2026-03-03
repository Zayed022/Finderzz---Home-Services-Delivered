import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";

export default function MoreExploreSection() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["verticals"],
    queryFn: async () => {
      const res = await API.get("/vertical/verticals");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <MoreExploreSkeleton />;
  }

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>More to Explore</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingLeft: 20 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/vertical/${item._id}`)}
          >
            <Image
              source={{ uri: item.bannerImage }}
              style={styles.image}
            />

            <View style={styles.overlay} />

            <View style={styles.content}>
              <Text style={styles.title}>{item.name}</Text>

              {item.description && (
                <Text style={styles.subtitle} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

/* ---------------- Skeleton ---------------- */

function MoreExploreSkeleton() {
  return (
    <View style={styles.container}>
      {/* Heading Skeleton */}
      <View
        style={{
          width: 180,
          height: 22,
          backgroundColor: "#E5E7EB",
          borderRadius: 6,
          marginHorizontal: 20,
          marginBottom: 16,
        }}
      />

      <View style={{ flexDirection: "row", paddingLeft: 20 }}>
        {[1, 2, 3].map((_, index) => (
          <View
            key={index}
            style={{
              width: 260,
              height: 160,
              borderRadius: 22,
              backgroundColor: "#E5E7EB",
              marginRight: 16,
              overflow: "hidden",
              padding: 18,
              justifyContent: "flex-end",
            }}
          >
            {/* Title Skeleton */}
            <View
              style={{
                width: 140,
                height: 18,
                borderRadius: 6,
                backgroundColor: "#D1D5DB",
                marginBottom: 8,
              }}
            />

            {/* Subtitle Skeleton */}
            <View
              style={{
                width: 180,
                height: 12,
                borderRadius: 4,
                backgroundColor: "#D1D5DB",
                marginBottom: 4,
              }}
            />
            <View
              style={{
                width: 150,
                height: 12,
                borderRadius: 4,
                backgroundColor: "#D1D5DB",
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  card: {
    width: 260,
    height: 160,
    borderRadius: 22,
    marginRight: 16,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    elevation: 6,
  },

  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  content: {
    position: "absolute",
    bottom: 18,
    left: 18,
    right: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    color: "#E2E8F0",
    fontSize: 13,
    marginTop: 4,
  },
});