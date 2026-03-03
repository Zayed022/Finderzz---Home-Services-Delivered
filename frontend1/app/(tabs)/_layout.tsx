import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/color";
import { useAppSelector } from "@/store/hooks";

export default function TabLayout() {
  const cartItems = useAppSelector(
    (state) => state.cart.items
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#777",
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "index")
            iconName = "home-outline";

          if (route.name === "services")
            iconName = "grid-outline";

          if (route.name === "bookings")
            iconName = "calendar-outline";

          if (route.name === "more")
            iconName = "menu-outline";

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home" }}
      />

      <Tabs.Screen
        name="services"
        options={{ title: "Services" }}
      />

      {/* 🔥 FLOATING CART BUTTON */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "",
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <View style={styles.cartButtonWrapper}>
              <View style={styles.cartButton}>
                <Ionicons
                  name="cart"
                  size={22}
                  color="#FFFFFF"
                />

                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{ title: "Bookings" }}
      />

      <Tabs.Screen
        name="more"
        options={{ title: "More" }}
      />
    </Tabs>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    elevation: 10,
  },

  cartButtonWrapper: {
    position: "absolute",
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },

  cartButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#EF4444",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});