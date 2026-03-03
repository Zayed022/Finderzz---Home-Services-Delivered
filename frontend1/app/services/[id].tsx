import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import CartPreviewBar from "@/components/CartPreviewBar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data, isLoading } = useQuery({
    queryKey: ["service-details", id],
    queryFn: async () => {
      const res = await API.get(`/service/${id}/details`);
      return res.data.data;
    },
  });

  const handleBook = (sub: any) => {
    dispatch(
      addToCart({
        _id: sub._id,
        name: sub.name,
        price: sub.customerPrice,
        duration: sub.durationEstimate,
      })
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) return null;

  const { service, subServices } = data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <Image
          source={{ uri: service.bannerImage }}
          resizeMode="cover"
          style={styles.banner}
        />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.serviceTitle}>{service.name}</Text>
          <Text style={styles.serviceDescription}>
            {service.description}
          </Text>
        </View>

        {/* Subservices */}
        <View style={styles.listContainer}>
          {subServices.map((sub: any) => (
            <View key={sub._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.subTitle}>
                    {sub.name}
                  </Text>

                  <View style={styles.metaChip}>
                    <Ionicons
                      name="time-outline"
                      size={13}
                      color="#6B7280"
                    />
                    <Text style={styles.metaText}>
                      {sub.durationEstimate} mins
                    </Text>
                  </View>
                </View>

                <Text style={styles.price}>
                  ₹{sub.customerPrice}
                </Text>
              </View>

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <Pressable
                  onPress={() =>
                    router.push(
                      `/services/subservice/${sub._id}`
                    )
                  }
                  style={styles.detailsButton}
                >
                  <Text style={styles.detailsText}>
                    Details
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleBook(sub)}
                  style={styles.bookButton}
                >
                  <Text style={styles.bookText}>
                    Add
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Cart Bar */}
      <CartPreviewBar />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  banner: {
    width: "100%",
    height: 220,
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  serviceDescription: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#16A34A",
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 6,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#374151",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  detailsButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0A84FF",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  detailsText: {
    color: "#0A84FF",
    fontWeight: "600",
  },
  bookButton: {
    flex: 1,
    backgroundColor: "#0A84FF",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  bookText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});