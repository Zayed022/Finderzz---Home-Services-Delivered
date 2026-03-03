import {
    View,
    Text,
    ScrollView,
    StyleSheet,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  export default function About() {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <Text style={styles.header}>About Us</Text>
  
          <View style={styles.heroCard}>
            <Text style={styles.heroText}>
              We are a trusted service marketplace
              connecting customers with verified
              professionals across multiple categories.
            </Text>
          </View>
  
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              Our Mission
            </Text>
            <Text style={styles.sectionText}>
              To simplify everyday service booking
              with transparency, reliability, and
              convenience.
            </Text>
          </View>
  
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              Our Vision
            </Text>
            <Text style={styles.sectionText}>
              To become the most trusted home and
              personal services platform across
              regions.
            </Text>
          </View>
  
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              Why Choose Us?
            </Text>
            <Text style={styles.sectionText}>
              • Verified Professionals{"\n"}
              • Transparent Pricing{"\n"}
              • Secure Payments{"\n"}
              • 24/7 Customer Support
            </Text>
          </View>
  
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>
              Contact Information
            </Text>
            <Text style={styles.contactText}>
              📧 support@yourapp.com{"\n"}
              📞 +91 XXXXX XXXXX{"\n"}
              📍 India
            </Text>
          </View>
  
          <View style={{ height: 80 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }
  
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
      marginBottom: 20,
    },
    heroCard: {
      backgroundColor: "#0A84FF",
      padding: 22,
      borderRadius: 22,
      marginBottom: 20,
    },
    heroText: {
      color: "#FFFFFF",
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "500",
    },
    sectionCard: {
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
    contactCard: {
      backgroundColor: "#F1F5F9",
      padding: 20,
      borderRadius: 20,
      marginTop: 8,
    },
    contactTitle: {
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 8,
      color: "#0F172A",
    },
    contactText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#334155",
    },
  });