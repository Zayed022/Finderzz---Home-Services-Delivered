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
import { format } from "date-fns";

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

  const renderServices = (services:any[])=>{
    return services.map((s,index)=>{

      const type =
        s.bookingType === "inspection"
        ? "Inspection"
        : "Service";

      return(

        <View key={index} style={styles.serviceRow}>

          <View>
            <Text style={styles.serviceName}>
              {s.subServiceId?.name}
            </Text>

            <Text style={styles.serviceType}>
              {type}
            </Text>
          </View>

          <Text style={styles.servicePrice}>
            ₹{s.price}
          </Text>

        </View>

      );

    });
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
      renderItem={({item})=>{

        const date = format(
          new Date(item.scheduledDate),
          "dd MMM yyyy"
        );

        return(

          <View style={styles.card}>

            {/* Customer */}

            <View style={styles.header}>
              <Text style={styles.customer}>
                {item.customerDetails?.name}
              </Text>

              <Text style={styles.status}>
                {item.status.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.phone}>
              {item.customerDetails?.phone}
            </Text>

            {/* Address */}

            <Text style={styles.address}>
              {item.address?.fullAddress}
            </Text>

            {/* Schedule */}

            <Text style={styles.schedule}>
              Scheduled : {date} • {item.timeSlot}
            </Text>

            {/* Area */}

            <Text style={styles.area}>
              Area : {item.areaId?.name}
            </Text>

            {/* Services */}

            <View style={styles.servicesBox}>

              <Text style={styles.sectionTitle}>
                Services
              </Text>

              {renderServices(item.services)}

            </View>

            {/* Price Summary */}

            <View style={styles.summary}>

              <Text>
                Subtotal : ₹{item.subtotal}
              </Text>

              <Text>
                Area Charge : ₹{item.extraCharge}
              </Text>

              <Text style={styles.total}>
                Total : ₹{item.totalPrice}
              </Text>

            </View>

            {/* Completion Time */}

            <Text style={styles.completed}>
              Completed : {format(
                new Date(item.updatedAt),
                "dd MMM yyyy, hh:mm a"
              )}
            </Text>

          </View>

        );

      }}
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
  backgroundColor:"#fff",
  marginHorizontal:14,
  marginVertical:8,
  padding:18,
  borderRadius:14,
  shadowColor:"#000",
  shadowOpacity:0.08,
  shadowRadius:6,
  elevation:3
},

header:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center"
},

customer:{
  fontSize:17,
  fontWeight:"700"
},

phone:{
  color:"#666",
  marginTop:2
},

status:{
  color:"#16a34a",
  fontWeight:"700"
},

address:{
  marginTop:8,
  color:"#444"
},

schedule:{
  marginTop:6,
  fontSize:13,
  color:"#666"
},

area:{
  marginTop:4,
  fontSize:13,
  color:"#666"
},

servicesBox:{
  marginTop:14
},

sectionTitle:{
  fontWeight:"700",
  marginBottom:6
},

serviceRow:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginBottom:6
},

serviceName:{
  fontWeight:"600"
},

serviceType:{
  fontSize:12,
  color:"#777"
},

servicePrice:{
  fontWeight:"600"
},

summary:{
  marginTop:14,
  borderTopWidth:1,
  borderColor:"#eee",
  paddingTop:10
},

total:{
  marginTop:4,
  fontWeight:"700",
  fontSize:15
},

completed:{
  marginTop:10,
  fontSize:12,
  color:"#777"
},

emptyTitle:{
  fontSize:18,
  fontWeight:"700"
}

});