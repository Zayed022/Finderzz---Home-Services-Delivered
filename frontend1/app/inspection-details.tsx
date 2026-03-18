import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
  } from "react-native";
  import { useLocalSearchParams } from "expo-router";
  import { useAppDispatch } from "@/store/hooks";
  import { addToCart } from "@/store/slices/cartSlice";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  export default function InspectionDetails() {
    const params = useLocalSearchParams();
    const dispatch = useAppDispatch();
  
    const {
      serviceId,
      name,
      price,
      description,
      duration,
    } = params;
  
    const handleAdd = () => {
      dispatch(
        addToCart({
          serviceId,
          name: `${name} Inspection`,
          price: Number(price),
          duration: Number(duration),
          bookingType: "inspection",
        })
      );
    };
  
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View style={styles.headerCard}>
              <Text style={styles.title}>
                {name} Inspection
              </Text>
  
              <Text style={styles.price}>
                ₹{price}
              </Text>
  
              <Text style={styles.duration}>
                ⏱ {duration} mins
              </Text>
            </View>
  
            {/* DESCRIPTION */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                What’s Included
              </Text>
  
              <Text style={styles.desc}>
                {description ||
                  "Our professional will inspect the issue and provide an accurate diagnosis along with repair recommendations."}
              </Text>
            </View>
  
            {/* BENEFITS */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Why Inspection?
              </Text>
  
              <Text style={styles.bullet}>
                • Accurate problem diagnosis
              </Text>
              <Text style={styles.bullet}>
                • Avoid unnecessary repairs
              </Text>
              <Text style={styles.bullet}>
                • Get expert recommendation
              </Text>
              <Text style={styles.bullet}>
                • Transparent pricing after inspection
              </Text>
            </View>
          </ScrollView>
  
          {/* STICKY BUTTON */}
          <View style={styles.footer}>
            <Pressable style={styles.button} onPress={handleAdd}>
              <Text style={styles.buttonText}>
                Add Inspection • ₹{price}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: "#F9FAFB",
    },
  
    container: {
      padding: 20,
      paddingBottom: 120,
    },
  
    /* HEADER CARD */
    headerCard: {
      backgroundColor: "#FFFFFF",
      padding: 20,
      borderRadius: 18,
      elevation: 3,
    },
  
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: "#111827",
    },
  
    price: {
      fontSize: 20,
      fontWeight: "800",
      color: "#F59E0B",
      marginTop: 8,
    },
  
    duration: {
      marginTop: 6,
      fontSize: 13,
      color: "#6B7280",
    },
  
    /* SECTIONS */
    section: {
      marginTop: 20,
      backgroundColor: "#FFFFFF",
      padding: 18,
      borderRadius: 16,
    },
  
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 8,
      color: "#111827",
    },
  
    desc: {
      fontSize: 14,
      color: "#6B7280",
      lineHeight: 20,
    },
  
    bullet: {
      fontSize: 14,
      color: "#374151",
      marginBottom: 6,
    },
  
    /* FOOTER */
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#FFFFFF",
      padding: 16,
      borderTopWidth: 1,
      borderColor: "#E5E7EB",
    },
  
    button: {
      backgroundColor: "#F59E0B",
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
    },
  
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 16,
    },
  });