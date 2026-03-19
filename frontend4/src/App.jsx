import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ServiceDetails from './pages/ServiceDetails'
import CartPage from './pages/CartPage'

function App() {
  return (
   <>
   <Routes>

   <Route path="/" element={<Home />} />
   <Route path="/service/:id" element={<ServiceDetails />} />
   <Route path="/cart" element={<CartPage />} />
   </Routes>
   </>
  )
}

export default App
