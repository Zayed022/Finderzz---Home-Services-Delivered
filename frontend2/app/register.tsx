import { useState } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert,
ActivityIndicator,
ScrollView,
Image
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import API from "@/services/api";

export default function Register(){

const [name,setName] = useState("");
const [phone,setPhone] = useState("");
const [password,setPassword] = useState("");
const [address,setAddress] = useState("");
const [skills,setSkills] = useState("");
const [aadhaarNumber,setAadhaarNumber] = useState("");
const [panNumber,setPanNumber] = useState("");

const [aadhaarImage,setAadhaarImage] = useState<any>(null);
const [panImage,setPanImage] = useState<any>(null);
const [profileImage,setProfileImage] = useState<any>(null);

const [loading,setLoading] = useState(false);

const pickImage = async (setter:any) => {

const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
quality:1
});

if(!result.canceled){
setter(result.assets[0]);
}
};

const register = async ()=>{

if(
!name || !phone || !password ||
!aadhaarNumber || !panNumber ||
!address || !skills ||
!aadhaarImage || !panImage || !profileImage
){
Alert.alert("Error","Please fill all fields");
return;
}

try{

setLoading(true);

const formData = new FormData();

formData.append("name",name);
formData.append("phone",phone);
formData.append("password",password);
formData.append("address",address);
formData.append("skills",skills);
formData.append("aadhaarNumber",aadhaarNumber);
formData.append("panNumber",panNumber);

formData.append("aadhaarImage",{
uri:aadhaarImage.uri,
type:"image/jpeg",
name:"aadhaar.jpg"
} as any);

formData.append("panImage",{
uri:panImage.uri,
type:"image/jpeg",
name:"pan.jpg"
} as any);

formData.append("profileImage",{
uri:profileImage.uri,
type:"image/jpeg",
name:"profile.jpg"
} as any);

await API.post("/worker/register",formData);

Alert.alert(
"Registration Submitted",
"Your profile will be reviewed by admin."
);

router.replace("/login");

}catch(err:any){

    console.log("ERROR:",err);
    console.log("RESPONSE:",err?.response?.data);
    
    Alert.alert(
      "Register Failed",
      err.response?.data?.message || err.message || "Something went wrong"
    );
    
    }
};

return(

<ScrollView
contentContainerStyle={styles.container}
showsVerticalScrollIndicator={false}
>

<Text style={styles.title}>
Worker Registration
</Text>

<Text style={styles.subtitle}>
Create your worker account
</Text>

<View style={styles.card}>

<TextInput
placeholder="Full Name"
placeholderTextColor="#9ca3af"
value={name}
onChangeText={setName}
style={styles.input}
/>

<TextInput
placeholder="Phone Number"
placeholderTextColor="#9ca3af"
value={phone}
keyboardType="phone-pad"
onChangeText={setPhone}
style={styles.input}
/>

<TextInput
placeholder="Password"
placeholderTextColor="#9ca3af"
value={password}
secureTextEntry
onChangeText={setPassword}
style={styles.input}
/>

<TextInput
placeholder="Address"
placeholderTextColor="#9ca3af"
value={address}
onChangeText={setAddress}
style={styles.input}
/>

<TextInput
placeholder="Skills (Plumber, Electrician...)"
value={skills}
onChangeText={setSkills}
placeholderTextColor="#9ca3af"
style={styles.input}
/>

<TextInput
placeholder="Aadhaar Number"
placeholderTextColor="#9ca3af"
value={aadhaarNumber}
keyboardType="number-pad"
onChangeText={setAadhaarNumber}
style={styles.input}
/>

<TextInput
placeholder="PAN Number"
placeholderTextColor="#9ca3af"
value={panNumber}
onChangeText={setPanNumber}
style={styles.input}
/>

{/* Image Upload Buttons */}

<TouchableOpacity
style={styles.imageButton}
onPress={()=>pickImage(setProfileImage)}
>
<Text style={styles.imageButtonText}>
Upload Profile Photo
</Text>
</TouchableOpacity>

{profileImage && (
<Image
source={{uri:profileImage.uri}}
style={styles.preview}
/>
)}

<TouchableOpacity
style={styles.imageButton}
onPress={()=>pickImage(setAadhaarImage)}
>
<Text style={styles.imageButtonText}>
Upload Aadhaar Image
</Text>
</TouchableOpacity>

{aadhaarImage && (
<Image
source={{uri:aadhaarImage.uri}}
style={styles.preview}
/>
)}

<TouchableOpacity
style={styles.imageButton}
onPress={()=>pickImage(setPanImage)}
>
<Text style={styles.imageButtonText}>
Upload PAN Image
</Text>
</TouchableOpacity>

{panImage && (
<Image
source={{uri:panImage.uri}}
style={styles.preview}
/>
)}

{/* Register Button */}

<TouchableOpacity
style={styles.registerButton}
onPress={register}
disabled={loading}
>

{loading ? (
<ActivityIndicator color="#fff"/>
) : (
<Text style={styles.registerText}>
Register
</Text>
)}

</TouchableOpacity>

</View>

<View style={styles.loginRow}>

<Text style={{color:"#666"}}>
Already have an account?
</Text>

<TouchableOpacity
onPress={()=>router.push("/login")}
>
<Text style={styles.loginLink}>
 Login
</Text>
</TouchableOpacity>

</View>

</ScrollView>
);
}

const styles = StyleSheet.create({

container:{
padding:25,
paddingBottom:40,
backgroundColor:"#f4f6f8"
},

title:{
fontSize:28,
fontWeight:"bold",
textAlign:"center",
marginTop:20
},

subtitle:{
textAlign:"center",
color:"#666",
marginBottom:25
},

card:{
backgroundColor:"#fff",
padding:20,
borderRadius:12,
shadowColor:"#000",
shadowOpacity:0.1,
shadowOffset:{width:0,height:4},
elevation:5
},

input:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:8,
padding:12,
marginBottom:15
},

imageButton:{
backgroundColor:"#e5e7eb",
padding:12,
borderRadius:8,
alignItems:"center",
marginBottom:10
},

imageButtonText:{
fontWeight:"600"
},

preview:{
width:"100%",
height:150,
borderRadius:8,
marginBottom:15
},

registerButton:{
backgroundColor:"#2563eb",
padding:14,
borderRadius:8,
alignItems:"center",
marginTop:10
},

registerText:{
color:"#fff",
fontWeight:"bold",
fontSize:16
},

loginRow:{
flexDirection:"row",
justifyContent:"center",
marginTop:20
},

loginLink:{
color:"#2563eb",
fontWeight:"bold"
}

});