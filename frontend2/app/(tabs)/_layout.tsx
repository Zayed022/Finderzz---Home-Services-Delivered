import React, { useEffect, useState } from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getToken } from "@/utils/auth";
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() {

  const [token,setToken] = useState<string | null>(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const checkAuth = async ()=>{
      const t = await getToken();
      setToken(t);
      setLoading(false);
    };

    checkAuth();
  },[]);

  if(loading){
    return(
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  if(!token){
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown:false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:"Home",
          tabBarIcon: ({color,size}) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="jobs"
        options={{
          title:"Jobs",
          tabBarIcon: ({color,size}) => (
            <Ionicons name="briefcase" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title:"History",
          tabBarIcon: ({color,size}) => (
            <Ionicons name="time" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="earnings"
        options={{
          title:"Earnings",
          tabBarIcon: ({color,size}) => (
            <Ionicons name="wallet" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title:"Profile",
          tabBarIcon: ({color,size}) => (
            <Ionicons name="person" size={size} color={color} />
          )
        }}
      />

    </Tabs>
  );
}