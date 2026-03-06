import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity
} from "react-native";

import API from "@/services/api";
import { getWorker } from "@/utils/worker";

export default function ProfileScreen(){

const [worker,setWorker] = useState<any>(null);
const [loading,setLoading] = useState(true);

const [name,setName] = useState("");
const [phone,setPhone] = useState("");
const [address,setAddress] = useState("");
const [skills,setSkills] = useState("");

const fetchProfile = async ()=>{

try{

const workerData = await getWorker();

const res = await API.get(`/worker/profile/${workerData._id}`);

setWorker(res.data.worker);

setName(res.data.worker.name);
setPhone(res.data.worker.phone);
setAddress(res.data.worker.address);
setSkills(res.data.worker.skills);

}catch(err){

console.log("Profile error",err);

}finally{

setLoading(false);

}

};

useEffect(()=>{
fetchProfile();
},[]);

const updateProfile = async()=>{

try{

const workerData = await getWorker();

await API.patch(`/worker/profile/${workerData._id}`,{
name,
phone,
address,
skills
});

Alert.alert("Success","Profile updated");

}catch(err){

Alert.alert("Error","Failed to update profile");

}

};

if(loading){
return(
<View style={styles.center}>
<ActivityIndicator size="large"/>
</View>
);
}

return(

<ScrollView style={styles.container}>

{/* PROFILE HEADER */}

<View style={styles.profileCard}>

<Image
source={{uri:worker.profileImage}}
style={styles.avatar}
/>

<Text style={styles.workerName}>{worker.name}</Text>

<Text style={styles.workerSkill}>{worker.skills}</Text>

<View style={styles.statusBadge}>
<Text style={styles.statusText}>
{worker.status}
</Text>
</View>

</View>


{/* FORM SECTION */}

<View style={styles.formCard}>

<Text style={styles.label}>Name</Text>

<TextInput
value={name}
onChangeText={setName}
style={styles.input}
/>

<Text style={styles.label}>Phone</Text>

<TextInput
value={phone}
onChangeText={setPhone}
style={styles.input}
/>

<Text style={styles.label}>Address</Text>

<TextInput
value={address}
onChangeText={setAddress}
style={styles.input}
/>

<Text style={styles.label}>Skills</Text>

<TextInput
value={skills}
onChangeText={setSkills}
style={styles.input}
/>

</View>


{/* UPDATE BUTTON */}

<TouchableOpacity
style={styles.updateBtn}
onPress={updateProfile}
>

<Text style={styles.updateText}>
Update Profile
</Text>

</TouchableOpacity>

</ScrollView>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f5f6fa"
},

center:{
flex:1,
justifyContent:"center",
alignItems:"center"
},

/* PROFILE CARD */

profileCard:{
backgroundColor:"#fff",
alignItems:"center",
padding:25,
margin:16,
borderRadius:14,
shadowColor:"#000",
shadowOpacity:0.05,
shadowOffset:{width:0,height:2},
elevation:3
},

avatar:{
width:90,
height:90,
borderRadius:45,
marginBottom:10
},

workerName:{
fontSize:20,
fontWeight:"bold"
},

workerSkill:{
color:"#666",
marginTop:4
},

statusBadge:{
marginTop:8,
backgroundColor:"#e7f9ef",
paddingHorizontal:10,
paddingVertical:4,
borderRadius:8
},

statusText:{
color:"#18a558",
fontWeight:"600"
},

/* FORM CARD */

formCard:{
backgroundColor:"#fff",
marginHorizontal:16,
borderRadius:14,
padding:20,
shadowColor:"#000",
shadowOpacity:0.05,
shadowOffset:{width:0,height:2},
elevation:3
},

label:{
marginTop:10,
fontWeight:"600",
color:"#333"
},

input:{
borderWidth:1,
borderColor:"#e2e2e2",
borderRadius:8,
padding:12,
marginTop:6,
backgroundColor:"#fafafa"
},

/* BUTTON */

updateBtn:{
backgroundColor:"#2f80ed",
margin:16,
padding:16,
borderRadius:10,
alignItems:"center"
},

updateText:{
color:"#fff",
fontWeight:"bold",
fontSize:16
}

});