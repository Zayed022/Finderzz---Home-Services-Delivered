import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import API from "@/services/api";
import { getWorker } from "@/utils/worker";

export default function EarningsScreen(){

  const [earnings,setEarnings] = useState<any>(null);
  const [loading,setLoading] = useState(true);

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

    }

  };

  useEffect(()=>{
    fetchEarnings();
  },[]);

  if(loading){
    return(
      <View style={styles.center}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return(

    <View style={styles.container}>

      <Text style={styles.title}>Earnings</Text>

      <View style={styles.card}>
        <Text>Today</Text>
        <Text style={styles.amount}>
          ₹{earnings.todayEarnings}
        </Text>
      </View>

      <View style={styles.card}>
        <Text>This Week</Text>
        <Text style={styles.amount}>
          ₹{earnings.weeklyEarnings}
        </Text>
      </View>

      <View style={styles.card}>
        <Text>This Month</Text>
        <Text style={styles.amount}>
          ₹{earnings.monthlyEarnings}
        </Text>
      </View>

      <View style={styles.card}>
        <Text>Total Earnings</Text>
        <Text style={styles.amount}>
          ₹{earnings.totalEarnings}
        </Text>
      </View>

      <View style={styles.card}>
        <Text>Total Completed Jobs</Text>
        <Text style={styles.amount}>
          {earnings.totalCompletedJobs}
        </Text>
      </View>

    </View>

  );

}

const styles = StyleSheet.create({

container:{
  flex:1,
  padding:20
},

center:{
  flex:1,
  justifyContent:"center",
  alignItems:"center"
},

title:{
  fontSize:22,
  fontWeight:"bold",
  marginBottom:20
},

card:{
  backgroundColor:"#fff",
  padding:20,
  marginBottom:12,
  borderRadius:10
},

amount:{
  fontSize:18,
  fontWeight:"bold",
  marginTop:4
}

});