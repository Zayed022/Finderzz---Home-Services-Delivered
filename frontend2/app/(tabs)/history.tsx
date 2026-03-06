import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import API from "@/services/api";
import { getWorker } from "@/utils/worker";

export default function HistoryScreen(){

  const [jobs,setJobs] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);
  const [error,setError] = useState("");

  const fetchHistory = async ()=>{

    try{

      const worker = await getWorker();

      if(!worker){
        setError("Worker not found");
        return;
      }

      const res = await API.get(`/worker/history/${worker._id}`);

      setJobs(res.data.jobs || []);

      setError("");

    }catch(err){

      console.log("History error",err);

      setError("Failed to load history");

    }finally{

      setLoading(false);
      setRefreshing(false);

    }

  };

  useEffect(()=>{
    fetchHistory();
  },[]);

  const onRefresh = ()=>{
    setRefreshing(true);
    fetchHistory();
  };

  if(loading){
    return(
      <View style={styles.center}>
        <ActivityIndicator size="large"/>
        <Text>Loading history...</Text>
      </View>
    );
  }

  if(error){
    return(
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  if(jobs.length === 0){
    return(
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No completed jobs yet</Text>
      </View>
    );
  }

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

        <View style={styles.card}>

          <Text style={styles.service}>
            {item.services?.[0]?.subServiceId?.name || "Service"}
          </Text>

          <Text>
            Customer: {item.customerDetails?.name}
          </Text>

          <Text>
            Address: {item.address?.fullAddress}
          </Text>

          <Text>
            Date: {new Date(item.createdAt).toLocaleDateString()}
          </Text>

          <Text style={styles.price}>
            ₹{item.totalPrice}
          </Text>

        </View>

      )}
    />

  );
}

const styles = StyleSheet.create({

center:{
  flex:1,
  justifyContent:"center",
  alignItems:"center"
},

card:{
  padding:18,
  borderBottomWidth:1,
  borderColor:"#eee",
  backgroundColor:"#fff"
},

service:{
  fontWeight:"bold",
  fontSize:16
},

price:{
  marginTop:6,
  fontWeight:"bold",
  color:"#0a7"
},

emptyTitle:{
  fontSize:18,
  fontWeight:"bold"
}

});