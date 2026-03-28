import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import API from "@/services/api";
import { getWorker } from "@/utils/worker";
import { useRouter } from "expo-router";

export default function HomeScreen() {

  const [dashboard,setDashboard] = useState<any>(null);
  const [available,setAvailable] = useState(true);
  const [settlement,setSettlement] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);
  const router = useRouter();

  const fetchDashboard = async () => {

    try{

      const worker = await getWorker();

      if(!worker) return;

      const res = await API.get(`/worker/dashboard/${worker._id}`);

      setDashboard(res.data.dashboard);

    }catch(error){

      console.log("Dashboard Error:",error);

    }

  };

  const fetchSettlement = async () => {

    try{

      const worker = await getWorker();

      if(!worker) return;

      const res = await API.get(`/worker/settlement/${worker._id}`);

      setSettlement(res.data.data || []);

    }catch(error){

      console.log("Settlement error",error);

    }finally{

      setLoading(false);

    }

  };

  const toggleAvailability = async () => {

    try{

      const worker = await getWorker();

      const res = await API.patch(`/worker/availability/${worker._id}`);

      setAvailable(res.data.isAvailable);

    }catch(error){

      console.log("Availability error",error);

    }

  };

  const submitSettlement = async (date:string) => {

    try{

      const worker = await getWorker();

      await API.post("/settlement/submit",{
        workerId:worker._id,
        date
      });

      fetchSettlement();

    }catch(error){

      console.log("Submit settlement error",error);

    }

  };

  const getSettlementColor = (status:string)=>{

    if(status === "approved") return "#dcfce7";
    if(status === "submitted") return "#fef9c3";

    return "#fff";
  };

  useEffect(()=>{
    fetchDashboard();
    fetchSettlement();
  },[]);

  if(loading){
    return(
      <View style={styles.center}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return(

    <ScrollView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Worker Dashboard
        </Text>

        <View style={styles.statusRow}>

          <Text style={styles.statusText}>
            {available ? "Online" : "Offline"}
          </Text>

          <Switch
            value={available}
            onValueChange={toggleAvailability}
          />

        </View>

      </View>
      <TouchableOpacity
  style={styles.quotationBtn}
  onPress={() => router.push("/quotation/create")}
>
  <Text style={styles.quotationText}>
    Create Quotation
  </Text>
</TouchableOpacity>

      {/* JOB STATS */}

      {dashboard && (

      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Job Statistics
        </Text>

        <View style={styles.stats}>

          <View style={styles.card}>
            <Text style={styles.number}>
              {dashboard.totalJobs}
            </Text>
            <Text style={styles.label}>Total Jobs</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.number}>
              {dashboard.pendingJobs}
            </Text>
            <Text style={styles.label}>Pending</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.number}>
              {dashboard.inProgressJobs}
            </Text>
            <Text style={styles.label}>In Progress</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.number}>
              {dashboard.completedJobs}
            </Text>
            <Text style={styles.label}>Completed</Text>
          </View>

        </View>

      </View>

      )}

      {/* DAILY SETTLEMENT */}

      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Daily Settlement
        </Text>

        {settlement.map((item,index)=>{

          const color = getSettlementColor(item.status);

          return(

            <View
              key={index}
              style={[styles.settlementCard,{backgroundColor:color}]}
            >

              <Text style={styles.date}>
                {item.date}
              </Text>

              <View style={styles.row}>

                <View>
                  <Text style={styles.smallLabel}>
                    Collected
                  </Text>
                  <Text style={styles.amount}>
                    ₹{item.totalCollected}
                  </Text>
                </View>

                <View>
                  <Text style={styles.smallLabel}>
                    Your Earnings
                  </Text>
                  <Text style={styles.worker}>
                    ₹{item.workerEarnings}
                  </Text>
                </View>

              </View>

              <View style={styles.row}>

                <View>
                  <Text style={styles.smallLabel}>
                    Submit to Admin
                  </Text>
                  <Text style={styles.admin}>
                    ₹{item.adminShare}
                  </Text>
                </View>

                <View>
                  <Text style={styles.smallLabel}>
                    Jobs
                  </Text>
                  <Text style={styles.jobs}>
                    {item.jobs}
                  </Text>
                </View>

              </View>

              {item.status === "pending" && (

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={()=>submitSettlement(item.date)}
                >
                  <Text style={styles.submitText}>
                    Submit Amount
                  </Text>
                </TouchableOpacity>

              )}

              {item.status === "submitted" && (
                <Text style={styles.waiting}>
                  Waiting for Admin Approval
                </Text>
              )}

              {item.status === "approved" && (
                <Text style={styles.approved}>
                  Settlement Approved ✓
                </Text>
              )}

            </View>

          );

        })}

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

container:{
  flex:1,
  backgroundColor:"#f4f6f8",
  padding:16
},

center:{
  flex:1,
  justifyContent:"center",
  alignItems:"center"
},

header:{
  marginBottom:20
},

title:{
  fontSize:26,
  fontWeight:"700"
},

statusRow:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginTop:12,
  alignItems:"center"
},

statusText:{
  fontSize:16,
  fontWeight:"600"
},

section:{
  marginBottom:24
},

sectionTitle:{
  fontSize:18,
  fontWeight:"700",
  marginBottom:12
},

stats:{
  flexDirection:"row",
  flexWrap:"wrap",
  justifyContent:"space-between"
},

card:{
  backgroundColor:"#fff",
  padding:18,
  borderRadius:14,
  width:"48%",
  marginBottom:12,
  alignItems:"center",
  shadowColor:"#000",
  shadowOpacity:0.05,
  shadowRadius:6,
  elevation:3
},

quotationBtn: {
  backgroundColor: "#2563eb",
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
  marginBottom: 20,
},

quotationText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},
number:{
  fontSize:22,
  fontWeight:"700"
},

label:{
  marginTop:4,
  color:"#6b7280"
},

settlementCard:{
  padding:18,
  borderRadius:16,
  marginBottom:12,
  shadowColor:"#000",
  shadowOpacity:0.05,
  shadowRadius:6,
  elevation:3
},

date:{
  fontSize:16,
  fontWeight:"700",
  marginBottom:10
},

row:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginTop:6
},

smallLabel:{
  color:"#6b7280",
  fontSize:12
},

amount:{
  fontSize:18,
  fontWeight:"700"
},

worker:{
  fontSize:18,
  fontWeight:"700",
  color:"#16a34a"
},

admin:{
  fontSize:18,
  fontWeight:"700",
  color:"#ef4444"
},

jobs:{
  fontSize:18,
  fontWeight:"700"
},

submitBtn:{
  marginTop:14,
  backgroundColor:"#2563eb",
  paddingVertical:10,
  borderRadius:10,
  alignItems:"center"
},

submitText:{
  color:"#fff",
  fontWeight:"600"
},

waiting:{
  marginTop:10,
  color:"#b45309",
  fontWeight:"600"
},

approved:{
  marginTop:10,
  color:"#15803d",
  fontWeight:"700"
}

});