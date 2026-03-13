import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Privacy(){

return(

<ScrollView style={styles.container}>

<Text style={styles.title}>Privacy Policy</Text>

<Text style={styles.text}>
Your privacy is important to us. This policy explains how Finderzz collects,
uses and protects your personal information when you use our platform.
</Text>

<Text style={styles.subtitle}>Information We Collect</Text>

<Text style={styles.text}>
• Name and phone number  
• Location and address  
• Service activity and bookings  
</Text>

<Text style={styles.subtitle}>How We Use Information</Text>

<Text style={styles.text}>
We use this information to provide services, improve the platform
and support workers and customers.
</Text>

<Text style={styles.subtitle}>Data Protection</Text>

<Text style={styles.text}>
We implement security measures to protect your information from
unauthorized access or disclosure.
</Text>

</ScrollView>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
padding:20,
backgroundColor:"#fff"
},

title:{
fontSize:24,
fontWeight:"bold",
marginBottom:20
},

subtitle:{
fontSize:18,
fontWeight:"600",
marginTop:20
},

text:{
fontSize:15,
color:"#444",
marginTop:8,
lineHeight:22
}

});