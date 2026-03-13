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
  TouchableOpacity,
  Linking
} from "react-native";

import API from "@/services/api";
import { getWorker, removeWorker } from "@/utils/worker";
import { router } from "expo-router";

export default function ProfileScreen(){

const [worker,setWorker] = useState<any>(null);
const [loading,setLoading] = useState(true);

const [name,setName] = useState("");
const [phone,setPhone] = useState("");
const [address,setAddress] = useState("");
const [skills,setSkills] = useState("");

/* ---------------- FETCH PROFILE ---------------- */

const fetchProfile = async ()=>{

try{

const workerData = await getWorker();

if(!workerData) return;

const res = await API.get(`/worker/profile/${workerData._id}`);

const w = res.data.worker;

setWorker(w);

setName(w.name || "");
setPhone(w.phone || "");
setAddress(w.address || "");
setSkills(w.skills || "");

}catch(err){

console.log("Profile error",err);

}finally{

setLoading(false);

}

};

useEffect(()=>{
fetchProfile();
},[]);

/* ---------------- UPDATE PROFILE ---------------- */

const updateProfile = async()=>{

try{

const workerData = await getWorker();

await API.patch(`/worker/profile/${workerData._id}`,{
name,
phone,
address,
skills
});

Alert.alert("Success","Profile updated successfully");

}catch(err){

Alert.alert("Error","Failed to update profile");

}

};

/* ---------------- LOGOUT ---------------- */

const logout = async () => {

try {

const workerData = await getWorker();

if(!workerData) return;

await API.post(`/worker/logout/${workerData._id}`);

await removeWorker();

router.replace("/login");

}catch(error){

console.log("Logout error:",error);

Alert.alert("Error","Logout failed");

}

};

const confirmLogout = ()=>{

Alert.alert(
"Logout",
"Are you sure you want to logout?",
[
{ text:"Cancel", style:"cancel" },
{ text:"Logout", style:"destructive", onPress:logout }
]
);

};

/* ---------------- SUPPORT FUNCTIONS ---------------- */

const callSupport = ()=>{
Linking.openURL("tel:+918262990986");
};

const emailSupport = ()=>{
Linking.openURL("mailto:support@finderzz.com");
};

const openPrivacy = ()=>{
  router.push("/privacy");
  };
  
  const openTerms = ()=>{
  router.push("/terms");
  };
  
  const openAbout = ()=>{
  router.push("/about");
  };

/* ---------------- LOADING ---------------- */

if(loading){
return(
<View style={styles.center}>
<ActivityIndicator size="large"/>
</View>
);
}

/* ---------------- UI ---------------- */

return(

<ScrollView style={styles.container}>

{/* PROFILE HEADER */}

<View style={styles.profileCard}>

<Image
source={{uri:worker?.profileImage || "https://i.pravatar.cc/150"}}
style={styles.avatar}
/>

<Text style={styles.workerName}>
{worker?.name}
</Text>

<Text style={styles.workerSkill}>
{worker?.skills}
</Text>

<View style={styles.statusBadge}>
<Text style={styles.statusText}>
{worker?.status}
</Text>
</View>

</View>

{/* EDIT PROFILE */}

<View style={styles.formCard}>

<Text style={styles.sectionTitle}>
Edit Profile
</Text>

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

{/* SUPPORT */}

<View style={styles.sectionCard}>

<Text style={styles.sectionTitle}>
Support
</Text>

<TouchableOpacity style={styles.menuItem} onPress={callSupport}>
<Text style={styles.menuText}>📞 Call Support</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={emailSupport}>
<Text style={styles.menuText}>✉️ Email Support</Text>
</TouchableOpacity>

</View>

{/* LEGAL */}

<View style={styles.sectionCard}>

<Text style={styles.sectionTitle}>
Legal
</Text>

<TouchableOpacity style={styles.menuItem} onPress={openPrivacy}>
<Text style={styles.menuText}>Privacy Policy</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={openTerms}>
<Text style={styles.menuText}>Terms & Conditions</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={openAbout}>
<Text style={styles.menuText}>About Finderzz</Text>
</TouchableOpacity>

</View>

{/* LOGOUT */}

<TouchableOpacity
style={styles.logoutBtn}
onPress={confirmLogout}
>

<Text style={styles.logoutText}>
Logout
</Text>

</TouchableOpacity>

{/* APP VERSION */}

<Text style={styles.version}>
Finderzz Worker App • v1.0.0
</Text>

</ScrollView>

);

}

/* ---------------- STYLES ---------------- */

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

profileCard:{
backgroundColor:"#fff",
alignItems:"center",
padding:25,
margin:16,
borderRadius:16,
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

formCard:{
backgroundColor:"#fff",
marginHorizontal:16,
borderRadius:16,
padding:20,
shadowColor:"#000",
shadowOpacity:0.05,
shadowOffset:{width:0,height:2},
elevation:3
},

sectionTitle:{
fontSize:16,
fontWeight:"700",
marginBottom:10
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
},

sectionCard:{
backgroundColor:"#fff",
marginHorizontal:16,
marginTop:16,
borderRadius:14,
paddingVertical:10,
shadowColor:"#000",
shadowOpacity:0.05,
shadowOffset:{width:0,height:2},
elevation:3
},

menuItem:{
paddingVertical:14,
paddingHorizontal:16,
borderTopWidth:1,
borderColor:"#f1f1f1"
},

menuText:{
fontSize:15,
color:"#333"
},

logoutBtn:{
backgroundColor:"#ef4444",
marginHorizontal:16,
marginTop:20,
padding:16,
borderRadius:10,
alignItems:"center"
},

logoutText:{
color:"#fff",
fontWeight:"bold",
fontSize:16
},

version:{
textAlign:"center",
color:"#999",
marginVertical:20
}

});