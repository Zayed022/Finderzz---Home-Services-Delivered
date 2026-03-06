import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import API from "@/services/api";
import { getWorker } from "@/utils/worker";

export default function HomeScreen() {

  const [dashboard, setDashboard] = useState<any>(null);
  const [available, setAvailable] = useState(true);

  const fetchDashboard = async () => {
    try {
  
      const worker = await getWorker();
  
      console.log("Worker:", worker);
  
      if (!worker) return;
  
      const res = await API.get(`/worker/dashboard/${worker._id}`);
  
      console.log("Dashboard API:", res.data);
  
      setDashboard(res.data.dashboard);
  
    } catch (error) {
  
      console.log("Dashboard Error:", error);
  
    }
  };

  const toggleAvailability = async () => {

    const worker = await getWorker();

    const res = await API.patch(
      `/worker/availability/${worker._id}`
    );

    setAvailable(res.data.isAvailable);

  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!dashboard) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Worker Dashboard</Text>

        <View style={styles.statusRow}>
          <Text>{available ? "Online" : "Offline"}</Text>

          <Switch
            value={available}
            onValueChange={toggleAvailability}
          />
        </View>
      </View>

      <View style={styles.stats}>

        <View style={styles.card}>
          <Text style={styles.number}>{dashboard.totalJobs}</Text>
          <Text>Total Jobs</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.number}>{dashboard.pendingJobs}</Text>
          <Text>Pending</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.number}>{dashboard.inProgressJobs}</Text>
          <Text>In Progress</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.number}>{dashboard.completedJobs}</Text>
          <Text>Completed</Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    padding:20,
  },

  header:{
    marginBottom:20
  },

  title:{
    fontSize:22,
    fontWeight:"bold",
    marginTop:10
  },

  statusRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:10
  },

  stats:{
    flexDirection:"row",
    flexWrap:"wrap",
    gap:10
  },

  card:{
    backgroundColor:"#fff",
    padding:20,
    borderRadius:10,
    width:"48%",
    alignItems:"center"
  },

  number:{
    fontSize:20,
    fontWeight:"bold"
  }

});