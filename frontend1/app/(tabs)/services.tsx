import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "expo-router";
import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";

/* ─── design tokens ──────────────────────────────────────────── */
const T = {
  blue:      "#1d4ed8",
  blueSoft:  "#eff6ff",
  blueMid:   "#bfdbfe",
  ink:       "#0f172a",
  inkSoft:   "#334155",
  muted:     "#64748b",
  border:    "#e2e8f0",
  surface:   "#f8fafc",
  white:     "#ffffff",
  green:     "#16a34a",
  greenSoft: "#f0fdf4",
  amber:     "#d97706",
  amberSoft: "#fffbeb",
  amberMid:  "#fcd34d",
  panelBg:   "#f1efe6",   // warm cream for left panel — same vibe as before
};

/* ─── shimmer skeleton pulse ─────────────────────────────────── */
function SkeletonBox({ w, h, radius = 8 }: { w: number | string; h: number; radius?: number }) {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{
      width: w as any, height: h, borderRadius: radius,
      backgroundColor: "#e2e8f0", opacity: anim,
    }} />
  );
}

function ServicesSkeleton() {
  return (
    <SafeAreaView style={s.wrapper} edges={["top"]}>
      {/* header */}
      <View style={s.header}>
        <View style={{ gap: 6, marginBottom: 14 }}>
          <SkeletonBox w={180} h={22} radius={6} />
          <SkeletonBox w={120} h={13} radius={4} />
        </View>
        <SkeletonBox w="100%" h={44} radius={12} />
      </View>

      <View style={s.body}>
        {/* left */}
        <View style={s.leftPanel}>
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <View key={i} style={{ paddingVertical: 18, paddingHorizontal: 12 }}>
              <SkeletonBox w="80%" h={13} radius={4} />
            </View>
          ))}
        </View>
        {/* right */}
        <View style={s.rightPanel}>
          {[1, 2, 3, 4].map((_, i) => (
            <View key={i} style={[s.serviceCard, { marginBottom: 10, padding: 16 }]}>
              <SkeletonBox w="65%" h={14} radius={4} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function Services() {
  const router = useRouter();

  const [categories,       setCategories]       = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedService,  setExpandedService]  = useState<string | null>(null);
  const [subServices,      setSubServices]      = useState<any[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [subLoading,       setSubLoading]       = useState(false);
  const [search,           setSearch]           = useState("");

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => { loadCategories(); }, []);

  const { data: searchResults, isFetching: searchLoading } = useQuery({
    queryKey: ["global-search", debouncedSearch],
    queryFn: async () => {
      const res = await API.get(`/search?q=${debouncedSearch}`);
      return res.data.data;
    },
    enabled: debouncedSearch.length > 1,
  });

  const loadCategories = async () => {
    try {
      const res = await API.get("/category/with-services");
      const data = res.data.data;
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0]._id);
    } catch (err) {
      console.log("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubServices = async (serviceId: string) => {
    try {
      setSubLoading(true);
      const res = await API.get(`/service/${serviceId}/details`);
      setSubServices(res.data.data.subServices);
    } catch (err) {
      console.log("Error loading subservices:", err);
    } finally {
      setSubLoading(false);
    }
  };

  const handleServicePress = (serviceId: string) => {
    if (expandedService === serviceId) {
      setExpandedService(null);
      setSubServices([]);
    } else {
      setExpandedService(serviceId);
      loadSubServices(serviceId);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setExpandedService(null);
    setSubServices([]);
  };

  const currentCategory = categories.find((c) => c._id === selectedCategory);

  const filteredServices = useMemo(() => {
    if (!search.trim()) return currentCategory?.services || [];
    return currentCategory?.services?.filter((sv: any) =>
      sv.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, currentCategory]);

  if (loading) return <ServicesSkeleton />;

  return (
    <SafeAreaView style={s.wrapper} edges={["top"]}>

      {/* ── HEADER ───────────────────────────────── */}
      <View style={s.header}>
        <View style={{ marginBottom: 12 }}>
          <Text style={s.headerTitle}>Services</Text>
          <Text style={s.headerSub}>Browse and book professional home services</Text>
        </View>

        {/* search bar */}
        <TouchableOpacity onPress={() => router.push("/search")} activeOpacity={0.85}>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={16} color={T.muted} />
            <TextInput
              placeholder="Search for a service…"
              placeholderTextColor={T.muted}
              value={search}
              onChangeText={setSearch}
              style={s.searchInput}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={8}>
                <Ionicons name="close-circle" size={16} color={T.muted} />
              </Pressable>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* ── BODY ─────────────────────────────────── */}
      <View style={s.body}>

        {/* ── LEFT PANEL (categories) ──────────── */}
        <View style={s.leftPanel}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const active = item._id === selectedCategory;
              return (
                <Pressable
                  style={[s.categoryItem, active && s.categoryItemActive]}
                  onPress={() => handleCategoryChange(item._id)}
                >
                  {active && <View style={s.activeBar} />}
                  <Text
                    style={[s.categoryText, active && s.categoryTextActive]}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        {/* ── RIGHT PANEL (services) ───────────── */}
        <View style={s.rightPanel}>
          <FlatList
            data={filteredServices}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={() => (
              <View style={s.emptyWrap}>
                <Ionicons name="search-outline" size={28} color={T.muted} style={{ opacity: 0.5, marginBottom: 8 }} />
                <Text style={s.emptyText}>No services found</Text>
              </View>
            )}
            renderItem={({ item }) => {
              const isExpanded = expandedService === item._id;

              return (
                <View style={{ marginBottom: 10 }}>

                  {/* service row */}
                  <Pressable
                    style={[s.serviceCard, isExpanded && s.serviceCardOpen]}
                    onPress={() => handleServicePress(item._id)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={s.serviceName}>{item.name}</Text>
                      {item.description ? (
                        <Text style={s.serviceDesc} numberOfLines={1}>{item.description}</Text>
                      ) : null}
                    </View>

                    <View style={[s.chevronWrap, isExpanded && s.chevronWrapActive]}>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-forward"}
                        size={14}
                        color={isExpanded ? T.blue : T.muted}
                      />
                    </View>
                  </Pressable>

                  {/* sub-services dropdown */}
                  {isExpanded && (
                    <View style={s.subContainer}>
                      {subLoading ? (
                        <View style={s.subLoaderWrap}>
                          <ActivityIndicator size="small" color={T.blue} />
                          <Text style={s.subLoaderText}>Loading…</Text>
                        </View>
                      ) : subServices.length === 0 ? (
                        <Text style={s.emptySubText}>No sub-services available</Text>
                      ) : (
                        subServices.map((sub, i) => (
                          <Pressable
                            key={sub._id}
                            style={[s.subRow, i < subServices.length - 1 && s.subRowBorder]}
                            onPress={() => router.push(`/services/subservice/${sub._id}`)}
                          >
                            <View style={{ flex: 1, marginRight: 10 }}>
                              <Text style={s.subName}>{sub.name}</Text>
                              {sub.description ? (
                                <Text style={s.subDesc} numberOfLines={1}>{sub.description}</Text>
                              ) : null}
                              {sub.durationEstimate ? (
                                <View style={s.subMeta}>
                                  <Ionicons name="time-outline" size={11} color={T.muted} />
                                  <Text style={s.subMetaText}>{sub.durationEstimate} mins</Text>
                                </View>
                              ) : null}
                            </View>

                            <View style={s.subRight}>
                              <Text style={s.subPrice}>₹{sub.customerPrice}</Text>
                              <View style={s.subArrow}>
                                <Ionicons name="arrow-forward" size={12} color={T.blue} />
                              </View>
                            </View>
                          </Pressable>
                        ))
                      )}
                    </View>
                  )}

                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const s = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: T.surface },

  /* header */
  header: {
    backgroundColor: T.white,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: {
    fontSize: 20, fontWeight: "700", color: T.ink, letterSpacing: -0.3,
  },
  headerSub: { fontSize: 12.5, color: T.muted, marginTop: 2 },

  /* search */
  searchBar: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: T.surface,
    borderWidth: 1.5, borderColor: T.border,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
  },
  searchInput: {
    flex: 1, fontSize: 14, color: T.ink,
    paddingVertical: 0,
  },

  /* body */
  body: { flex: 1, flexDirection: "row" },

  /* left panel */
  leftPanel: {
    width: 112,
    backgroundColor: T.panelBg,
    borderRightWidth: 1,
    borderRightColor: T.border,
  },
  categoryItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  categoryItemActive: { backgroundColor: T.white },
  activeBar: {
    position: "absolute",
    left: 0, top: 0, bottom: 0,
    width: 3.5,
    backgroundColor: T.amber,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  categoryText: {
    fontSize: 12.5, color: T.muted, lineHeight: 17,
  },
  categoryTextActive: {
    fontWeight: "700", color: T.ink,
  },

  /* right panel */
  rightPanel: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 14,
  },

  /* service card */
  serviceCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: T.white,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    ...Platform.select({
      ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  serviceCardOpen: {
    borderColor: T.blueMid,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  serviceName: { fontSize: 13.5, fontWeight: "600", color: T.ink, lineHeight: 18 },
  serviceDesc: { fontSize: 11.5, color: T.muted, marginTop: 2, lineHeight: 15 },

  chevronWrap: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: T.surface,
    borderWidth: 1, borderColor: T.border,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginLeft: 8,
  },
  chevronWrapActive: {
    backgroundColor: T.blueSoft, borderColor: T.blueMid,
  },

  /* sub-service container */
  subContainer: {
    backgroundColor: T.white,
    borderWidth: 1, borderColor: T.blueMid,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 14,
    paddingBottom: 4,
    ...Platform.select({
      ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },

  subLoaderWrap: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 14 },
  subLoaderText: { fontSize: 13, color: T.muted },

  subRow: { paddingVertical: 13 },
  subRowBorder: { borderBottomWidth: 1, borderBottomColor: T.border },
  subRowInner: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },

  subName: { fontSize: 13, fontWeight: "600", color: T.inkSoft },
  subDesc: { fontSize: 11.5, color: T.muted, marginTop: 2, lineHeight: 15 },
  subMeta: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  subMetaText: { fontSize: 11, color: T.muted },

  subRight: { alignItems: "flex-end", gap: 6, flexShrink: 0 },
  subPrice: { fontSize: 14, fontWeight: "700", color: T.ink, letterSpacing: -0.2 },
  subArrow: {
    width: 22, height: 22, borderRadius: 6,
    backgroundColor: T.blueSoft, borderWidth: 1, borderColor: T.blueMid,
    alignItems: "center", justifyContent: "center",
  },

  /* empty */
  emptyWrap: { alignItems: "center", justifyContent: "center", paddingTop: 40 },
  emptyText: { fontSize: 13.5, color: T.muted },
  emptySubText: { fontSize: 13, color: T.muted, paddingVertical: 12 },
});