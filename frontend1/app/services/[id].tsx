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

  /* ---------------- ADD TO CART ---------------- */

  const addServiceToCart = (sub: any) => {
    dispatch(
      addToCart({
        subServiceId: sub._id,
        name: sub.name,
        price: sub.customerPrice,
        duration: sub.durationEstimate,
        bookingType: "service",
      })
    );
  };

  const addInspectionToCart = (service: any) => {
    dispatch(
      addToCart({
        serviceId: service._id,
        name: `${service.name} Inspection`,
        price: service.inspection.price,
        duration: service.inspection.duration,
        bookingType: "inspection",
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {/* Banner */}
          <Image
            source={{ uri: service.bannerImage }}
            style={styles.banner}
          />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <Text style={styles.serviceDescription}>
              {service.description}
            </Text>
          </View>

          {/* 🔥 GLOBAL INSPECTION */}
          {service.inspection?.available && (
            <View style={styles.inspectionGlobalBox}>
              <Text style={styles.inspectionTitle}>
                Inspection Available
              </Text>

              {service.inspection.description && (
                <Text style={styles.inspectionDesc}>
                  {service.inspection.description}
                </Text>
              )}

              <View style={styles.inspectionRow}>
                <Text style={styles.inspectionPrice}>
                  ₹{service.inspection.price}
                </Text>

                <Pressable
                  style={styles.inspectButton}
                  onPress={() => addInspectionToCart(service)}
                >
                  <Text style={styles.inspectText}>
                    Add Inspection
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Subservices */}
          <View style={styles.listContainer}>
            {subServices.map((sub: any) => (
              <View key={sub._id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.subTitle}>{sub.name}</Text>

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

                <View style={styles.buttonRow}>
                  <Pressable
                    onPress={() =>
                      router.push(`/services/subservice/${sub._id}`)
                    }
                    style={styles.detailsButton}
                  >
                    <Text style={styles.detailsText}>
                      Details
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => addServiceToCart(sub)}
                    style={styles.bookButton}
                  >
                    <Text style={styles.bookText}>Add</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <CartPreviewBar />
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loader: { flex: 1, justifyContent: "center" },

  banner: { width: "100%", height: 220 },

  header: { padding: 20, backgroundColor: "#FFFFFF" },

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

  listContainer: { padding: 16 },

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

  subTitle: { fontSize: 16, fontWeight: "600" },

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

  /* INSPECTION */

  inspectionGlobalBox: {
    margin: 16,
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 14,
  },

  inspectionTitle: {
    fontWeight: "700",
    fontSize: 16,
  },

  inspectionDesc: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },

  inspectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },

  inspectionPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F59E0B",
  },

  inspectButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  inspectText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});