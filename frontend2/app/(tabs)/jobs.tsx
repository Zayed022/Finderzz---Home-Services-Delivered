import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Switch,
  Linking
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
  const [isHindi,setIsHindi] = useState(false);
  const [updatingId,setUpdatingId] = useState<string | null>(null);

  const toggleLanguage = () => {
    const newLang = isHindi ? "en" : "hi";
    i18n.changeLanguage(newLang);
    setIsHindi(!isHindi);
  };

  const callCustomer = (phone:string)=>{
    if(!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const fetchJobs = async () => {

    try{

      const worker = await getWorker();

      if(!worker) return;

      const res = await API.get(`/worker/jobs/${worker._id}`);

      setJobs(res.data.jobs || []);

    }catch(err){
      console.log("Jobs error",err);
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

  const updateStatus = async(id:string,status:string)=>{

    try{

      setUpdatingId(id);

      await API.patch(`/booking/${id}/status`,{status});

      setJobs(prev =>
        prev.map(j =>
          j._id === id ? {...j,status} : j
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
        return "#3b82f6";

      case "in_progress":
        return "#f59e0b";

      case "completed":
        return "#22c55e";

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
        <Text>Loading jobs...</Text>
      </View>
    );
  }

  if(jobs.length === 0){
    return(
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>
          {t("noJobs")}
        </Text>
      </View>
    );
  }

  return(

<View style={{flex:1}}>

{/* Language Switch */}

<View style={styles.languageBar}>

<Text style={styles.lang}>EN</Text>

<Switch
value={isHindi}
onValueChange={toggleLanguage}
/>

<Text style={styles.lang}>हिंदी</Text>

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

<View style={styles.card}>

{/* HEADER */}

<View style={styles.header}>

<View>

<Text style={styles.customerName}>
{item.customerDetails?.name}
</Text>

<TouchableOpacity
onPress={()=>callCustomer(item.customerDetails?.phone)}
style={styles.callBtn}
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
{t("scheduled")} : {date} • {item.timeSlot}
</Text>

{/* SERVICES */}

<View style={styles.servicesBox}>

<Text style={styles.sectionTitle}>
{t("services")}
</Text>

{renderServices(item.services)}

</View>

{/* PAYMENT */}

<View style={styles.summary}>

<View style={styles.summaryRow}>
<Text style={styles.summaryLabel}>
{t("extraCharge")}
</Text>

<Text style={styles.summaryValue}>
₹{item.extraCharge}
</Text>
</View>

<View style={styles.summaryRow}>
<Text style={styles.totalLabel}>
{t("total")}
</Text>

<Text style={styles.totalAmount}>
₹{item.totalPrice}
</Text>
</View>

</View>

{/* ACTION BUTTONS */}

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
{updatingId === item._id ? "..." : "Complete Job"}
</Text>

</TouchableOpacity>

)}

</View>

</View>

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
padding:12
},

lang:{
fontWeight:"600",
marginHorizontal:6
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
fontSize:13,
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

actions:{
marginTop:14,
flexDirection:"row",
justifyContent:"flex-end"
},

startBtn:{
backgroundColor:"#2563eb",
paddingVertical:10,
paddingHorizontal:20,
borderRadius:10
},

completeBtn:{
backgroundColor:"#16a34a",
paddingVertical:10,
paddingHorizontal:20,
borderRadius:10
},

btnText:{
color:"#fff",
fontWeight:"600"
},

emptyTitle:{
fontSize:18,
fontWeight:"700"
}

});