import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import API from "@/services/api";
import { getWorker } from "@/utils/worker";

export default function JobsScreen() {

  const [jobs,setJobs] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);
  const [error,setError] = useState("");

  const fetchJobs = async () => {
    try{

      const worker = await getWorker();

      if(!worker){
        setError("Worker not found");
        setLoading(false);
        return;
      }

      const res = await API.get(`/worker/jobs/${worker._id}`);

      setJobs(res.data.jobs || []);

      setError("");

    }catch(err:any){

      console.log("Jobs error:",err);

      setError("Failed to load jobs");

    }finally{
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(()=>{
    fetchJobs();
  },[]);

  const onRefresh = ()=>{
    setRefreshing(true);
    fetchJobs();
  };

  const openJob = (id:string)=>{
    router.push(`/job/${id}`);
  };

  /* ---------------- Loading UI ---------------- */

  if(loading){
    return(
      <View style={styles.center}>
        <ActivityIndicator size="large"/>
        <Text>Loading jobs...</Text>
      </View>
    );
  }

  /* ---------------- Error UI ---------------- */

  if(error){
    return(
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  /* ---------------- Empty State ---------------- */

  if(jobs.length === 0){
    return(
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No Jobs Assigned</Text>
        <Text style={styles.emptySub}>
          When admin assigns jobs they will appear here.
        </Text>
      </View>
    );
  }

  /* ---------------- Job List ---------------- */

  return(

    <FlatList
      data={jobs}
      keyExtractor={(item)=>item._id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      renderItem={({item})=>(

        <TouchableOpacity
          onPress={()=>openJob(item._id)}
          style={styles.card}
        >

          <Text style={styles.title}>
            {item.services?.[0]?.subServiceId?.name || "Service"}
          </Text>

          <Text>
            {item.customerDetails?.name || "Customer"}
          </Text>

          <Text>
            {item.address?.fullAddress || "Address unavailable"}
          </Text>

          <Text style={styles.status}>
            {item.status}
          </Text>

        </TouchableOpacity>

      )}
    />

  );
}

const styles = StyleSheet.create({

center:{
  flex:1,
  justifyContent:"center",
  alignItems:"center",
  padding:20
},

card:{
  padding:18,
  borderBottomWidth:1,
  borderColor:"#eee",
  backgroundColor:"#fff"
},

title:{
  fontSize:16,
  fontWeight:"bold"
},

status:{
  marginTop:6,
  color:"#0a7"
},

emptyTitle:{
  fontSize:18,
  fontWeight:"bold"
},

emptySub:{
  marginTop:6,
  color:"#777"
}

});