import {
    View,
    Text,
    ScrollView,
    StyleSheet,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  export default function Privacy() {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <Text style={styles.header}>Privacy Policy</Text>
          <Text style={styles.subHeader}>
            Last Updated: March 2026
          </Text>
  
          {sections.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.sectionTitle}>
                {item.title}
              </Text>
              <Text style={styles.sectionText}>
                {item.content}
              </Text>
            </View>
          ))}
  
          <View style={{ height: 80 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect personal information including name, phone number, email, and address to provide booking and service facilitation.",
    },
    {
      title: "2. How We Use Your Data",
      content:
        "Your information is used to process bookings, improve user experience, enable communication, and enhance platform security.",
    },
    {
      title: "3. Data Protection",
      content:
        "We implement industry-standard security practices to safeguard personal data against unauthorized access or disclosure.",
    },
    {
      title: "4. Third-Party Sharing",
      content:
        "We share data only with verified professionals and essential service providers for order fulfillment purposes.",
    },
    {
      title: "5. Your Rights",
      content:
        "You may request access, correction, or deletion of your personal data at any time by contacting support.",
    },
  ];
  
  
  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: "#F8FAFC",
    },
    container: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    header: {
      fontSize: 26,
      fontWeight: "800",
      color: "#0F172A",
    },
    subHeader: {
      fontSize: 13,
      color: "#64748B",
      marginTop: 6,
      marginBottom: 24,
    },
    card: {
      backgroundColor: "#FFFFFF",
      padding: 18,
      borderRadius: 18,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: "#0F172A",
      marginBottom: 8,
    },
    sectionText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#475569",
    },
  });