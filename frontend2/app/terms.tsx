import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Terms(){

return(

<ScrollView style={styles.container}>

<Text style={styles.title}>Terms & Conditions</Text>

<Text style={styles.text}>
By using the Finderzz Worker App, you agree to the following terms
and conditions.
</Text>

<Text style={styles.subtitle}>Worker Responsibilities</Text>

<Text style={styles.text}>
Workers must complete jobs professionally and maintain good service quality.
</Text>

<Text style={styles.subtitle}>Payments</Text>

<Text style={styles.text}>
Workers must submit the daily collected amount to the admin as per
the settlement policy.
</Text>

<Text style={styles.subtitle}>Account Suspension</Text>

<Text style={styles.text}>
Finderzz reserves the right to suspend accounts that violate
platform policies.
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