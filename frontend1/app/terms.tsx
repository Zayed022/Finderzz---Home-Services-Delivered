import {
    View,
    Text,
    ScrollView,
    StyleSheet,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  export default function Terms() {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <Text style={styles.title}>
            Terms & Conditions
          </Text>
  
          <Text style={styles.sectionTitle}>
            1. Introduction
          </Text>
          <Text style={styles.text}>
            Welcome to our service platform. By accessing
            or using our app, you agree to comply with
            these Terms & Conditions.
          </Text>
  
          <Text style={styles.sectionTitle}>
            2. Services
          </Text>
          <Text style={styles.text}>
            We connect customers with verified service
            professionals. We are not directly responsible
            for the execution of services.
          </Text>
  
          <Text style={styles.sectionTitle}>
            3. Payments
          </Text>
          <Text style={styles.text}>
            Payments are processed securely. Platform
            fees may apply.
          </Text>
  
          <Text style={styles.sectionTitle}>
            4. Cancellations & Refunds
          </Text>
          <Text style={styles.text}>
            Refund eligibility depends on cancellation
            timing and service policy.
          </Text>
  
          <Text style={styles.sectionTitle}>
            5. Liability
          </Text>
          <Text style={styles.text}>
            We are not liable for indirect damages or
            disputes between users and providers.
          </Text>
  
          <Text style={styles.sectionTitle}>
            6. Modifications
          </Text>
          <Text style={styles.text}>
            We may update these terms at any time.
          </Text>
  
          <View style={{ height: 60 }} />
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
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      marginBottom: 24,
      color: "#0F172A",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginTop: 20,
      marginBottom: 8,
      color: "#0F172A",
    },
    text: {
      fontSize: 14,
      lineHeight: 22,
      color: "#475569",
    },
  });