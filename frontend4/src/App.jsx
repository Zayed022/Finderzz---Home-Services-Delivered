import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ServiceDetails from './pages/ServiceDetails'
import CartPage from './pages/CartPage'
import SelectArea from './pages/SelectAreas'
import Checkout from './pages/Checkout'
import BookingSuccess from './pages/BookingSuccess'
import SubServiceDetails from './pages/SubServiceDetails'
import InspectionDetails from './pages/InspectionDetails'
import ServicesPage from './pages/Service'
import About from './pages/AboutUs'
import MyBookings from './pages/MyBookings'
import Terms from './pages/Terms'
import Privacy from './pages/Policy'
import CustomerCare from './pages/CustomerCare'

function App() {
  return (
   <>
   <Routes>

   <Route path="/" element={<Home />} />
   <Route path="/service/:id" element={<ServiceDetails />} />
   <Route path="/cart" element={<CartPage />} />
   <Route path="/select-area" element={<SelectArea />} />
   <Route path="/checkout" element={<Checkout />} />
   <Route path="/booking-success" element={<BookingSuccess />} />
   <Route path="/sub-service/:id" element={<SubServiceDetails />} />
   <Route path="/inspection/:id" element={<InspectionDetails />} />
   <Route path="/services" element={<ServicesPage />} />
   <Route path="/about" element={<About />} />
   <Route path="/my-bookings" element={<MyBookings />} />
   <Route path="/terms" element={<Terms />} />
   <Route path="/policy" element={<Privacy />} />
   <Route path="/customer-care" element={<CustomerCare />} />
   </Routes>
   </>
  )
}

export default App
