import { View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";

/* ─── type → theme mapping ───────────────────── */
const TYPE_STYLES: any = {
  info: {
    bg: "#eff6ff",
    border: "#bfdbfe",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
  warning: {
    bg: "#fefce8",
    border: "#fde68a",
    iconBg: "#fef9c3",
    iconColor: "#ca8a04",
  },
  delay: {
    bg: "#fff7ed",
    border: "#fdba74",
    iconBg: "#ffedd5",
    iconColor: "#ea580c",
  },
  critical: {
    bg: "#fee2e2",
    border: "#fca5a5",
    iconBg: "#fecaca",
    iconColor: "#dc2626",
  },
};

/* ─── icon mapping ───────────────────────────── */
const ICON_MAP: any = {
  info: "information-circle-outline",
  warning: "alert-circle-outline",
  time: "time-outline",
  alert: "warning-outline",
  shield: "shield-checkmark-outline",
};

export default function Notice() {

  /* ─── fetch notices ───────────────────────── */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const res = await API.get("/notice/active");
      return res.data.data;
    },
  });

  /* ─── silent handling ─────────────────────── */
  if (isLoading || isError || !data || data.length === 0) {
    return null;
  }

  return (
    <View style={{ marginTop: 10 }}>
      {data.map((notice: any) => {
        const theme = TYPE_STYLES[notice.type] || TYPE_STYLES.info;
        const iconName = ICON_MAP[notice.icon] || ICON_MAP.info;

        return (
          <View
            key={notice._id}
            style={{
              marginHorizontal: 16,
              marginBottom: 10,
              padding: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.bg,
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            {/* ICON */}
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: theme.iconBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={iconName}
                size={16}
                color={theme.iconColor}
              />
            </View>

            {/* CONTENT */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13.5,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 3,
                }}
              >
                {notice.heading}
              </Text>

              <Text
                style={{
                  fontSize: 12.5,
                  color: "#4b5563",
                  lineHeight: 18,
                }}
              >
                {notice.message}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}