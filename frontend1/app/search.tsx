import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Pressable,
  } from "react-native";
  import { useState } from "react";
  import { useRouter } from "expo-router";
  import { Ionicons } from "@expo/vector-icons";
  import { useQuery } from "@tanstack/react-query";
  import API from "@/services/api";
  
  export default function SearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState("");
  
    const { data, isFetching } = useQuery({
      queryKey: ["search", query],
      queryFn: async () => {
        if (!query.trim()) return null;
        const res = await API.get(`/search?q=${query}`);
        return res.data.data;
      },
      enabled: query.length > 1,
    });
  
    return (
      <View style={styles.container}>
        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#64748B"
          />
          <TextInput
            placeholder="Search services..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
        </View>
  
        {isFetching && (
          <ActivityIndicator style={{ marginTop: 20 }} />
        )}
  
        {/* SERVICES RESULTS */}
        {data?.services?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Services
            </Text>
  
            <FlatList
              data={data.services}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.resultItem}
                  onPress={() =>
                    router.push(`/services/${item._id}`)
                  }
                >
                  <Text style={styles.resultText}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          </>
        )}
  
        {/* SUBSERVICES RESULTS */}
        {data?.subServices?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Sub Services
            </Text>
  
            <FlatList
              data={data.subServices}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.resultItem}
                  onPress={() =>
                    router.push(
                      `services/subservice/${item._id}`
                    )
                  }
                >
                  <View>
                    <Text style={styles.resultText}>
                      {item.name}
                    </Text>
                    <Text style={styles.meta}>
                      ₹{item.customerPrice} •{" "}
                      {item.durationEstimate} mins
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </>
        )}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#F8FAFC",
    },
  
    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      paddingHorizontal: 14,
      height: 50,
      elevation: 3,
      marginTop:30
    },
  
    input: {
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
    },
  
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      marginTop: 20,
      marginBottom: 10,
      color: "#0F172A",
    },
  
    resultItem: {
      backgroundColor: "#FFFFFF",
      padding: 16,
      borderRadius: 16,
      marginBottom: 10,
      elevation: 2,
    },
  
    resultText: {
      fontWeight: "600",
      color: "#0F172A",
    },
  
    meta: {
      fontSize: 12,
      color: "#64748B",
      marginTop: 4,
    },
  });