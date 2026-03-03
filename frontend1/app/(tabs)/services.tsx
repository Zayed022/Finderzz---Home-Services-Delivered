import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "expo-router";
import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

export default function Services() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const [expandedService, setExpandedService] =
    useState<string | null>(null);

  const [subServices, setSubServices] =
    useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] =
    useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    loadCategories();
  }, []);

  const {
    data: searchResults,
    isFetching: searchLoading,
  } = useQuery({
    queryKey: ["global-search", debouncedSearch],
    queryFn: async () => {
      const res = await API.get(
        `/search?q=${debouncedSearch}`
      );
      return res.data.data;
    },
    enabled: debouncedSearch.length > 1,
  });

  const loadCategories = async () => {
    try {
      const res = await API.get(
        "/category/with-services"
      );
      const data = res.data.data;

      setCategories(data);

      if (data.length > 0) {
        setSelectedCategory(data[0]._id);
      }
    } catch (err) {
      console.log("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubServices = async (
    serviceId: string
  ) => {
    try {
      setSubLoading(true);

      const res = await API.get(
        `/service/${serviceId}/details`
      );

      setSubServices(
        res.data.data.subServices
      );
    } catch (err) {
      console.log(
        "Error loading subservices:",
        err
      );
    } finally {
      setSubLoading(false);
    }
  };

  const handleServicePress = (
    serviceId: string
  ) => {
    if (expandedService === serviceId) {
      setExpandedService(null);
      setSubServices([]);
    } else {
      setExpandedService(serviceId);
      loadSubServices(serviceId);
    }
  };

  const handleCategoryChange = (
    categoryId: string
  ) => {
    setSelectedCategory(categoryId);
    setExpandedService(null);
    setSubServices([]);
  };

  const currentCategory =
    categories.find(
      (c) => c._id === selectedCategory
    );

  const filteredServices = useMemo(() => {
    if (!search.trim())
      return currentCategory?.services || [];

    return currentCategory?.services?.filter(
      (s: any) =>
        s.name
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [search, currentCategory]);

  if (loading) {
    return <ServicesSkeleton />;
  }

  return (
    <View style={styles.wrapper}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Service Categories
        </Text>
     <TouchableOpacity
      onPress={() => router.push("/search")} >
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color="#64748B"
          />
          <TextInput
            placeholder="Search for a service"
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
        </TouchableOpacity>
      </View>

      {/* ===== BODY ===== */}
      <View style={styles.container}>
        {/* LEFT PANEL */}
        <View style={styles.leftPanel}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const active =
                item._id === selectedCategory;

              return (
                <Pressable
                  style={[
                    styles.categoryItem,
                    active &&
                      styles.activeCategory,
                  ]}
                  onPress={() =>
                    handleCategoryChange(
                      item._id
                    )
                  }
                >
                  {active && (
                    <View
                      style={styles.activeBar}
                    />
                  )}

                  <Text
                    style={[
                      styles.categoryText,
                      active &&
                        styles.activeCategoryText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        {/* RIGHT PANEL */}
        <View style={styles.rightPanel}>
          <FlatList
            data={filteredServices}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isExpanded =
                expandedService === item._id;

              return (
                <View>
                  {/* SERVICE ROW */}
                  <Pressable
                    style={styles.serviceRow}
                    onPress={() =>
                      handleServicePress(
                        item._id
                      )
                    }
                  >
                    <Text
                      style={
                        styles.serviceName
                      }
                    >
                      {item.name}
                    </Text>

                    <Ionicons
                      name={
                        isExpanded
                          ? "chevron-up"
                          : "chevron-forward"
                      }
                      size={18}
                      color="#94A3B8"
                    />
                  </Pressable>

                  {/* SUB SERVICES */}
                  {isExpanded && (
                    <View
                      style={
                        styles.subContainer
                      }
                    >
                      {subLoading ? (
                        <ActivityIndicator />
                      ) : subServices
                          .length === 0 ? (
                        <Text
                          style={
                            styles.emptySubText
                          }
                        >
                          No sub-services available
                        </Text>
                      ) : (
                        subServices.map(
                          (sub) => (
                            <Pressable
                              key={sub._id}
                              style={
                                styles.subItem
                              }
                              onPress={() =>
                                router.push(
                                  `/services/subservice/${sub._id}`
                                )
                              }
                            >
                              <View>
                                <Text
                                  style={
                                    styles.subName
                                  }
                                >
                                  {sub.name}
                                </Text>

                                {sub.description ? (
                                  <Text
                                    style={
                                      styles.subDesc
                                    }
                                  >
                                    {
                                      sub.description
                                    }
                                  </Text>
                                ) : null}
                              </View>

                              <Text
                                style={
                                  styles.subPrice
                                }
                              >
                                ₹
                                {
                                  sub.customerPrice
                                }
                              </Text>
                            </Pressable>
                          )
                        )
                      )}
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

/* ---------------- Skeleton ---------------- */

function ServicesSkeleton() {
  return (
    <View style={styles.wrapper}>
      {/* ===== HEADER SKELETON ===== */}
      <View style={styles.header}>
        <View
          style={{
            width: 200,
            height: 26,
            borderRadius: 6,
            backgroundColor: "#E5E7EB",
            marginBottom: 16,
          }}
        />

        <View
          style={{
            height: 48,
            borderRadius: 16,
            backgroundColor: "#E5E7EB",
          }}
        />
      </View>

      {/* ===== BODY SKELETON ===== */}
      <View style={styles.container}>
        {/* LEFT PANEL */}
        <View style={styles.leftPanel}>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <View
              key={i}
              style={{
                height: 16,
                backgroundColor: "#E5E7EB",
                borderRadius: 4,
                marginHorizontal: 12,
                marginVertical: 18,
              }}
            />
          ))}
        </View>

        {/* RIGHT PANEL */}
        <View style={styles.rightPanel}>
          {[1, 2, 3, 4].map((_, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#E5E7EB",
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 160,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: "#D1D5DB",
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#0F172A",
  },

  container: {
    flex: 1,
    flexDirection: "row",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  leftPanel: {
    width: 120,
    backgroundColor: "#F1EFE6",
    paddingTop: 20,
  },

  categoryItem: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    position: "relative",
  },

  activeCategory: {
    backgroundColor: "#FFFFFF",
  },

  activeBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#F59E0B",
  },

  categoryText: {
    fontSize: 13,
    color: "#334155",
  },

  activeCategoryText: {
    fontWeight: "600",
    color: "#0F172A",
  },

  rightPanel: {
    flex: 1,
    padding: 20,
  },

  serviceRow: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  serviceName: {
    fontWeight: "600",
    color: "#0F172A",
  },

  subContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  subItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  subName: {
    fontWeight: "600",
    color: "#334155",
  },

  subDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    maxWidth: 180,
  },

  subPrice: {
    fontWeight: "700",
    color: "#0A84FF",
  },

  emptySubText: {
    color: "#64748B",
    fontSize: 13,
  },
});