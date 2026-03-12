import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Switch
} from "react-native";

import { router } from "expo-router";
import API from "@/services/api";
import { getWorker } from "@/utils/worker";

import "@/utils/i18n";
import { useTranslation } from "react-i18next";


import { format } from "date-fns";

export default function JobsScreen() {

  const { t, i18n } = useTranslation();

  const [jobs,setJobs] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);
  const [error,setError] = useState("");
  const [isHindi,setIsHindi] = useState(false);
  const [updatingId,setUpdatingId] = useState<string | null>(null);

  const toggleLanguage = () => {
    const newLang = isHindi ? "en" : "hi";
    i18n.changeLanguage(newLang);
    setIsHindi(!isHindi);
  };

  const fetchJobs = async () => {
    try {

      const worker = await getWorker();

      if(!worker){
        setError("Worker not found");
        return;
      }

      const res = await API.get(`/worker/jobs/${worker._id}`);

      setJobs(res.data.jobs || []);

      setError("");

    } catch(err:any) {

      console.log(err);
      setError("Failed to load jobs");

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };

  const updateStatus = async (id:string,status:string) => {
    try{
  
      setUpdatingId(id);
  
      await API.patch(`/booking/${id}/status`,{
        status
      });
  
      setJobs(prev =>
        prev.map(j =>
          j._id === id ? { ...j, status } : j
        )
      );
  
    }catch(err){
      console.log("Status update error",err);
    }finally{
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status:string)=>{
    switch(status){
      case "assigned":
        return "#2563eb";
      case "in_progress":
        return "#f59e0b";
      case "completed":
        return "#16a34a";
      case "cancelled":
        return "#ef4444";
      default:
        return "#64748b";
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

  const renderServices = (services:any[]) => {

    return services.map((s,index)=>{

      const type =
        s.bookingType === "inspection"
        ? t("inspection")
        : t("service");

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

          <Text style={styles.price}>
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
        <Text>Loading jobs...</Text>
      </View>
    );
  }

  if(jobs.length === 0){
    return(
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>{t("noJobs")}</Text>
      </View>
    );
  }

  return(

    <View style={{flex:1}}>

      {/* Language Switch */}

      <View style={styles.languageBar}>

        <Text style={{fontWeight:"600"}}>EN</Text>

        <Switch
          value={isHindi}
          onValueChange={toggleLanguage}
        />

        <Text style={{fontWeight:"600"}}>हिंदी</Text>

      </View>

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

            <TouchableOpacity
              style={styles.card}
              onPress={()=>openJob(item._id)}
            >

              {/* Header */}

              <View style={styles.header}>

                <Text style={styles.customerName}>
                  {item.customerDetails?.name}
                </Text>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {item.status}
                  </Text>
                </View>

              </View>

              {/* Address */}

              <Text style={styles.address}>
                {item.address?.fullAddress}
              </Text>

              {/* Schedule */}

              <Text style={styles.schedule}>
                {t("scheduled")} :
                {" "}
                {date} • {item.timeSlot}
              </Text>

              {/* Services */}

              <View style={styles.servicesBox}>

                <Text style={styles.sectionTitle}>
                  {t("services")}
                </Text>

                {renderServices(item.services)}

              </View>

              {/* Price Summary */}

              <View style={styles.summary}>

                <Text>
                  {t("extraCharge")} : ₹{item.extraCharge}
                </Text>

                <Text style={styles.total}>
                  {t("total")} : ₹{item.totalPrice}
                </Text>

              </View>

              <View style={styles.actions}>

  {item.status === "assigned" && (
    <TouchableOpacity
      style={styles.startBtn}
      onPress={()=>updateStatus(item._id,"in_progress")}
      disabled={updatingId === item._id}
    >
      <Text style={styles.btnText}>
        {updatingId === item._id ? "..." : "Start Job"}
      </Text>
    </TouchableOpacity>
  )}

  {item.status === "in_progress" && (
    <TouchableOpacity
      style={styles.completeBtn}
      onPress={()=>updateStatus(item._id,"completed")}
      disabled={updatingId === item._id}
    >
      <Text style={styles.btnText}>
        {updatingId === item._id ? "..." : "Complete"}
      </Text>
    </TouchableOpacity>
  )}

</View>

            </TouchableOpacity>

          );

        }}
      />

    </View>

  );

}

const styles = StyleSheet.create({

center:{
  flex:1,
  justifyContent:"center",
  alignItems:"center"
},

languageBar:{
  flexDirection:"row",
  justifyContent:"center",
  alignItems:"center",
  padding:12,
  gap:8
},

card:{
  backgroundColor:"#fff",
  marginHorizontal:14,
  marginVertical:8,
  padding:18,
  borderRadius:16,
  shadowColor:"#000",
  shadowOpacity:0.08,
  shadowRadius:10,
  elevation:4
},

header:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center"
},

customerName:{
  fontSize:17,
  fontWeight:"700"
},

statusBadge:{
  backgroundColor:"#e6f7ee",
  paddingHorizontal:10,
  paddingVertical:4,
  borderRadius:8
},

statusText:{
  color:"#0a7",
  fontWeight:"600"
},

address:{
  marginTop:6,
  color:"#666"
},

schedule:{
  marginTop:6,
  fontSize:13,
  color:"#444"
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
  marginBottom:8
},

serviceName:{
  fontWeight:"600"
},

serviceType:{
  fontSize:12,
  color:"#777"
},

price:{
  fontWeight:"600"
},
actions:{
  flexDirection:"row",
  marginTop:14,
  justifyContent:"flex-end"
},

startBtn:{
  backgroundColor:"#2563eb",
  paddingVertical:10,
  paddingHorizontal:18,
  borderRadius:10
},

completeBtn:{
  backgroundColor:"#16a34a",
  paddingVertical:10,
  paddingHorizontal:18,
  borderRadius:10
},

btnText:{
  color:"#fff",
  fontWeight:"600"
},

summary:{
  marginTop:12,
  borderTopWidth:1,
  borderColor:"#eee",
  paddingTop:10
},

total:{
  marginTop:4,
  fontWeight:"700",
  fontSize:15
},

emptyTitle:{
  fontSize:18,
  fontWeight:"700"
}

});