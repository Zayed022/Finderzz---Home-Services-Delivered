import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function About(){

return(

<ScrollView style={styles.container}>

<Text style={styles.title}>About Finderzz</Text>

<Text style={styles.text}>
Finderzz is a service marketplace platform that connects customers
with professional workers for home services.
</Text>

<Text style={styles.subtitle}>Our Mission</Text>

<Text style={styles.text}>
To provide reliable and efficient home services while empowering
workers with stable earning opportunities.
</Text>

<Text style={styles.subtitle}>Contact</Text>

<Text style={styles.text}>
Support Email: support@finderzz.com
</Text>

<Text style={styles.text}>
Phone: +91 8262990986
</Text>

<Text style={styles.version}>
Finderzz Worker App v1.0.0
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
},

version:{
marginTop:40,
textAlign:"center",
color:"#888"
}

});