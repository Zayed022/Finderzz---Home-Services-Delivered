import { ScrollView, StatusBar, View } from "react-native";
import LocationHeader from "../../components/home/LocationHeader";
import MoreExploreSection from "../../components/home/MoreExploreSection";
import HomeBanner from "@/components/home/HomeBanner";
import HomeCategories from "../../components/home/HomeCategories";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    
    <ScrollView showsVerticalScrollIndicator={false}>
      <LocationHeader />
      <HomeBanner/>
      <HomeCategories />
      <MoreExploreSection />
      <View style={{ height: 20 }} />
    </ScrollView>
    
  );
}