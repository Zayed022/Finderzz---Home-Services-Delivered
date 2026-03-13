import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Linking
} from "react-native";

import API from "@/services/api";
import { getWorker } from "@/utils/worker";
import { format } from "date-fns";

export default function HistoryScreen() {

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

  const callCustomer = (phone:string)=>{
    if(!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const getStatusColor = (status:string)=>{

    switch(status){

      case "completed":
        return "#16a34a";

      case "cancelled":
        return "#ef4444";

      default:
        return "#64748b";

    }

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
        <Text style={styles.emptyTitle}>
          No completed jobs yet
        </Text>
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

            {/* HEADER */}

            <View style={styles.header}>

              <View>

                <Text style={styles.customerName}>
                  {item.customerDetails?.name}
                </Text>

                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() =>
                    callCustomer(item.customerDetails?.phone)
                  }
                >
                  <Text style={styles.callText}>
                    📞 {item.customerDetails?.phone}
                  </Text>
                </TouchableOpacity>

              </View>

              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor:getStatusColor(item.status)}
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status.replace("_"," ").toUpperCase()}
                </Text>
              </View>

            </View>

            {/* ADDRESS */}

            <View style={styles.addressBox}>

              <Text style={styles.addressTitle}>
                Address
              </Text>

              <Text style={styles.addressLine}>
                🏠 House: {item.address.houseNumber}
              </Text>

              <Text style={styles.addressLine}>
                🏢 Building: {item.address.buildingName}
              </Text>

              <Text style={styles.addressLine}>
                📍 Landmark: {item.address.landmark}
              </Text>

              <Text style={styles.addressMain}>
                {item.address.fullAddress}
              </Text>

            </View>

            {/* SCHEDULE */}

            <Text style={styles.schedule}>
              Scheduled : {date} • {item.timeSlot}
            </Text>

            {/* AREA */}

            <Text style={styles.area}>
              Area : {item.areaId?.name}
            </Text>

            {/* SERVICES */}

            <View style={styles.servicesBox}>

              <Text style={styles.sectionTitle}>
                Services
              </Text>

              {renderServices(item.services)}

            </View>

            {/* PAYMENT SUMMARY */}

            <View style={styles.summary}>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Subtotal
                </Text>
                <Text style={styles.summaryValue}>
                  ₹{item.subtotal}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Area Charge
                </Text>
                <Text style={styles.summaryValue}>
                  ₹{item.extraCharge}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>
                  Total
                </Text>
                <Text style={styles.totalAmount}>
                  ₹{item.totalPrice}
                </Text>
              </View>

            </View>

            {/* COMPLETED TIME */}

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
  marginHorizontal:16,
  marginVertical:10,
  padding:18,
  borderRadius:18,

  shadowColor:"#000",
  shadowOpacity:0.08,
  shadowRadius:10,
  elevation:4
},

header:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"flex-start"
},

customerName:{
  fontSize:18,
  fontWeight:"700"
},

callBtn:{
  marginTop:4
},

callText:{
  color:"#2563eb",
  fontWeight:"600"
},

statusBadge:{
  paddingHorizontal:10,
  paddingVertical:4,
  borderRadius:20
},

statusText:{
  color:"#fff",
  fontSize:12,
  fontWeight:"600"
},

addressBox:{
  marginTop:12
},

addressTitle:{
  fontWeight:"700",
  marginBottom:4
},

addressLine:{
  color:"#555",
  fontSize:13
},

addressMain:{
  marginTop:4,
  fontWeight:"500"
},

schedule:{
  marginTop:10,
  fontSize:16,
  color:"#555"
},

area:{
  marginTop:4,
  fontSize:15,
  color:"#555"
},

servicesBox:{
  marginTop:14,
  borderTopWidth:1,
  borderColor:"#eee",
  paddingTop:10
},

sectionTitle:{
  fontWeight:"700",
  marginBottom:6
},

serviceRow:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginBottom:8
},

serviceName:{
  fontWeight:"600"
},

serviceType:{
  fontSize:12,
  color:"#888"
},

servicePrice:{
  fontWeight:"700"
},

summary:{
  marginTop:12,
  borderTopWidth:1,
  borderColor:"#eee",
  paddingTop:10
},

summaryRow:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginBottom:4
},

summaryLabel:{
  color:"#555"
},

summaryValue:{
  fontWeight:"600"
},

totalLabel:{
  fontWeight:"700"
},

totalAmount:{
  fontSize:16,
  fontWeight:"700"
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