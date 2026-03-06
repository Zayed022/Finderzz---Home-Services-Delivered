import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import API from "@/services/api";

export default function JobDetails() {

  const { id } = useLocalSearchParams();

  const [job,setJob] = useState<any>(null);
  const [loading,setLoading] = useState(true);

  const fetchJob = async ()=>{

    try{

      const res = await API.get(`/worker/job/${id}`);

      setJob(res.data.job);

    }catch(err){

      console.log("Job fetch error",err);

    }finally{
      setLoading(false);
    }

  };

  useEffect(()=>{
    fetchJob();
  },[]);

  const startJob = async ()=>{

    try{

      await API.patch(`/worker/job/start/${id}`);

      Alert.alert("Success","Job started");

      fetchJob();

    }catch(err){

      Alert.alert("Error","Failed to start job");

    }

  };

  const completeJob = async ()=>{

    try{

      await API.patch(`/worker/job/complete/${id}`);

      Alert.alert("Success","Job completed");

      router.replace("/(tabs)/history");

    }catch(err){

      Alert.alert("Error","Failed to complete job");

    }

  };

  if(loading){
    return(
      <View style={styles.center}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  if(!job){
    return(
      <View style={styles.center}>
        <Text>Job not found</Text>
      </View>
    );
  }

  return(

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        {job.services?.[0]?.subServiceId?.name}
      </Text>

      <Text style={styles.section}>
        Customer
      </Text>

      <Text>{job.customerDetails?.name}</Text>
      <Text>{job.customerDetails?.phone}</Text>

      <Text style={styles.section}>
        Address
      </Text>

      <Text>{job.address?.fullAddress}</Text>

      <Text style={styles.section}>
        Schedule
      </Text>

      <Text>{job.scheduledDate}</Text>
      <Text>{job.timeSlot}</Text>

      <Text style={styles.section}>
        Status
      </Text>

      <Text>{job.status}</Text>

      {/* Actions */}

      {job.status === "assigned" && (
        <Button title="Start Job" onPress={startJob}/>
      )}

      {job.status === "in_progress" && (
        <Button title="Complete Job" onPress={completeJob}/>
      )}

    </ScrollView>

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

section:{
  marginTop:20,
  fontWeight:"bold"
}

});