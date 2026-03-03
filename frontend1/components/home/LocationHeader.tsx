import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLocationStore } from "@/store/location.store";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LocationHeader() {
  const area = useLocationStore((state) => state.area);
  const loadArea = useLocationStore((state) => state.loadArea);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadArea();
      setLoading(false);
    };
    init();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#FFFFFF" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#F1F3F5",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {loading ? (
            <HeaderSkeleton />
          ) : (
            <>
              {/* LOCATION SELECTOR */}
              <Pressable
                onPress={() => router.push("/select-location")}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  borderRadius: 16,
                  backgroundColor: pressed ? "#F4F6F8" : "transparent",
                  maxWidth: "78%",
                })}
              >
                {/* Icon Container */}
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: "#F0F6FF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color="#2563EB"
                  />
                </View>

                {/* Text Block */}
                <View style={{ marginLeft: 12, flexShrink: 1 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#9CA3AF",
                      fontWeight: "500",
                      marginBottom: 2,
                      letterSpacing: 0.2,
                    }}
                  >
                    Delivering to
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#111827",
                      }}
                    >
                      {area?.name || "Select Location"}
                    </Text>

                    <Ionicons
                      name="chevron-down"
                      size={16}
                      color="#9CA3AF"
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                </View>
              </Pressable>

              {/* SEARCH BUTTON */}
              <TouchableOpacity onPress={() => router.push("/search")}>
                <Ionicons
                  name="search-outline"
                  size={20}
                  color="#111827"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- Skeleton ---------------- */

function HeaderSkeleton() {
  return (
    <>
      {/* Left Side Skeleton */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Icon Circle */}
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: "#E5E7EB",
          }}
        />

        {/* Text Block */}
        <View style={{ marginLeft: 12 }}>
          <View
            style={{
              width: 90,
              height: 10,
              borderRadius: 4,
              backgroundColor: "#E5E7EB",
              marginBottom: 6,
            }}
          />
          <View
            style={{
              width: 140,
              height: 16,
              borderRadius: 6,
              backgroundColor: "#E5E7EB",
            }}
          />
        </View>
      </View>

      {/* Search Icon Skeleton */}
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: "#E5E7EB",
        }}
      />
    </>
  );
}