import { Helmet } from "react-helmet-async";
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import CTA from '../components/CTA'
import ServiceCategories from '../components/ServiceCategories'
import Notice from "../components/Notice";




function Home() {
  return (
    <>
      <Helmet>
        <title>Home Services in Bhiwandi | Finderzz</title>
        <meta name="description" content="Book trusted home services in Bhiwandi including maid, plumbing, painting & inspection services. Verified professionals." />
        <link rel="canonical" href="https://finderzz.com/" />
      </Helmet>

      <Navbar/>
      <Hero/>
      <Notice/>
      <Stats/>
      <ServiceCategories/>
      <HowItWorks/>
      <Testimonials/>
      <CTA/>
      <Footer/>
    </>
  )
}

export default Home