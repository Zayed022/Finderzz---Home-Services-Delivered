import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  SafeAreaView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function More() {
  const router = useRouter();

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
  }: any) => (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        pressed && { opacity: 0.6 },
      ]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <View style={styles.iconBox}>
          <Ionicons
            name={icon}
            size={18}
            color="#0A84FF"
          />
        </View>

        <View>
          <Text style={styles.menuTitle}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.menuSubtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#94A3B8"
      />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            More
          </Text>
        </View>

        {/* ===== USER SUMMARY ===== */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={28}
              color="#FFFFFF"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>
              Guest User
            </Text>
            <Text style={styles.profileSub}>
              Manage your bookings and preferences
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />
        </View>

        {/* ===== MAIN OPTIONS ===== */}
        <View style={styles.sectionCard}>
          <MenuItem
            icon="calendar-outline"
            title="My Bookings"
            subtitle="View and manage your bookings"
            onPress={() =>
              router.push("/bookings")
            }
          />

          <MenuItem
            icon="cart-outline"
            title="My Cart"
            subtitle="Review selected services"
            onPress={() =>
              router.push("/cart")
            }
          />

          <MenuItem
            icon="location-outline"
            title="Saved Addresses"
            subtitle="Manage service locations"
            onPress={() =>
              router.push("/select-location")
            }
          />
        </View>

        {/* ===== SUPPORT ===== */}
        <View style={styles.sectionCard}>
          <MenuItem
            icon="chatbubble-ellipses-outline"
            title="Customer Support"
            subtitle="Get help & raise a request"
            onPress={() =>
              Linking.openURL(
                "mailto:support@yourapp.com"
              )
            }
          />

          <MenuItem
            icon="star-outline"
            title="Rate Our App"
            subtitle="Share your feedback"
            onPress={() =>
              Linking.openURL(
                "https://play.google.com"
              )
            }
          />
        </View>

        {/* ===== LEGAL ===== */}
        <View style={styles.sectionCard}>
          <MenuItem
            icon="document-text-outline"
            title="Terms & Conditions"
            onPress={() =>
              router.push("/terms")
            }
          />

          <MenuItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            onPress={() =>
              router.push("/privacy")
            }
          />

          <MenuItem
            icon="information-circle-outline"
            title="About Us"
            onPress={() =>
              router.push("/about")
            }
          />
        </View>

        {/* ===== CONTACT INFO ===== */}
        <View style={styles.sectionCard}>
          <MenuItem
            icon="call-outline"
            title="Contact Us"
            subtitle="+91 8262990986"
            onPress={() =>
              Linking.openURL(
                "tel:+918262990986"
              )
            }
          />

          <MenuItem
            icon="mail-outline"
            title="Email"
            subtitle="support.finderzz@gmail.com"
            onPress={() =>
              Linking.openURL(
                "mailto:support.finderzz@gmail.com"
              )
            }
          />
        </View>

        {/* ===== FOOTER ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Finderzz v1.0.0
          </Text>
          <Text style={styles.footerSub}>
            © 2026 Finderzz Pvt. Ltd.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 30,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0A84FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  profileSub: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 3,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EEF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  menuSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  footer: {
    alignItems: "center",
    marginBottom: 40,
  },

  footerText: {
    fontSize: 13,
    color: "#64748B",
  },

  footerSub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
});