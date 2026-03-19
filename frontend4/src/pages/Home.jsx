import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import CTA from '../components/CTA'
import ServiceCategories from '../components/ServiceCategories'

function Home() {
  return (
    <>
    <Navbar/>
    <Hero/>
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
