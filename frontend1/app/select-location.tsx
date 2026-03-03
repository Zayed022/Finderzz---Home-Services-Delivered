import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    SafeAreaView,
  } from "react-native";
  import { useQuery } from "@tanstack/react-query";
  import { router } from "expo-router";
  import API from "@/services/api";
  import { useLocationStore } from "@/store/location.store";
  import { useState } from "react";
  import { Ionicons } from "@expo/vector-icons";
  
  export default function SelectLocation() {
    const setArea = useLocationStore((state) => state.setArea);
    const selectedArea = useLocationStore((state) => state.area);
  
    const [search, setSearch] = useState("");
  
    const { data, isLoading, isError } = useQuery({
      queryKey: ["areas"],
      queryFn: async () => {
        const res = await API.get("/area/active");
        return res.data.data;
      },
    });
  
    const filtered =
      data?.filter((area: any) =>
        area.name.toLowerCase().includes(search.toLowerCase())
      ) || [];
  
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  
    if (isError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Unable to load areas</Text>
        </View>
      );
    }
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 18,
              color: "#111",
            }}
          >
            Choose Your Area
          </Text>
  
          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 14,
              paddingHorizontal: 14,
              height: 50,
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            <Ionicons name="search-outline" size={18} color="#999" />
            <TextInput
              placeholder="Search your locality"
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 15,
                color: "#111",
              }}
            />
          </View>
        </View>
  
        <FlatList
          data={filtered}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selectedArea?._id === item._id;
  
            return (
              <TouchableOpacity
                onPress={() => {
                  setArea(item);
                  router.back();
                }}
                activeOpacity={0.85}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 18,
                  marginBottom: 14,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? "#0A84FF" : "#ECECEC",
                  shadowColor: "#000",
                  shadowOpacity: 0.03,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#111",
                  }}
                >
                  {item.name}
                </Text>
  
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color="#0A84FF" />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }