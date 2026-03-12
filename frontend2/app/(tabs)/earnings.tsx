import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from "react-native";

import API from "@/services/api";
import { getWorker } from "@/utils/worker";

export default function EarningsScreen(){

  const [earnings,setEarnings] = useState<any>(null);
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);

  const fetchEarnings = async()=>{

    try{

      const worker = await getWorker();

      const res = await API.get(
        `/worker/earnings/${worker._id}`
      );

      setEarnings(res.data.earnings);

    }catch(err){

      console.log("earnings error",err);

    }finally{

      setLoading(false);
      setRefreshing(false);

    }

  };

  useEffect(()=>{
    fetchEarnings();
  },[]);

  const onRefresh = ()=>{
    setRefreshing(true);
    fetchEarnings();
  };

  if(loading){
    return(
      <View style={styles.center}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return(

    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >

      <Text style={styles.title}>Your Earnings</Text>

      {/* Total Earnings Highlight */}

      <View style={styles.totalCard}>

        <Text style={styles.totalLabel}>
          Total Earnings
        </Text>

        <Text style={styles.totalAmount}>
          ₹{earnings.totalEarnings}
        </Text>

        <Text style={styles.jobs}>
          {earnings.totalCompletedJobs} Jobs Completed
        </Text>

      </View>

      {/* Stats Grid */}

      <View style={styles.grid}>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            Today
          </Text>
          <Text style={styles.statAmount}>
            ₹{earnings.todayEarnings}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            This Week
          </Text>
          <Text style={styles.statAmount}>
            ₹{earnings.weeklyEarnings}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            This Month
          </Text>
          <Text style={styles.statAmount}>
            ₹{earnings.monthlyEarnings}
          </Text>
        </View>

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

container:{
  flex:1,
  backgroundColor:"#f5f6fa",
  padding:16
},

center:{
  flex:1,
  justifyContent:"center",
  alignItems:"center"
},

title:{
  fontSize:24,
  fontWeight:"700",
  marginBottom:16
},

/* TOTAL CARD */

totalCard:{
  backgroundColor:"#2563eb",
  padding:24,
  borderRadius:16,
  marginBottom:20
},

totalLabel:{
  color:"#c7d2fe",
  fontSize:14
},

totalAmount:{
  color:"#fff",
  fontSize:34,
  fontWeight:"800",
  marginTop:6
},

jobs:{
  color:"#e0e7ff",
  marginTop:6
},

/* GRID */

grid:{
  flexDirection:"row",
  flexWrap:"wrap",
  justifyContent:"space-between"
},

statCard:{
  backgroundColor:"#fff",
  width:"48%",
  padding:20,
  borderRadius:14,
  marginBottom:12,
  shadowColor:"#000",
  shadowOpacity:0.08,
  shadowRadius:6,
  elevation:3
},

statTitle:{
  fontSize:14,
  color:"#6b7280"
},

statAmount:{
  fontSize:20,
  fontWeight:"700",
  marginTop:6
}

});