import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Area from './components/Area'
import AddArea from './components/area/AddArea'
import UpdateArea from './components/area/UpdateArea'
import DeleteArea from './components/area/DeleteArea'
import ManageAreas from './components/area/ManageArea'
import Banner from './components/Banner'
import AddBanner from './components/banner/AddBanner'
import DeleteBanner from './components/banner/DeleteBanner'
import ManageBanners from './components/banner/ManageBanner'
import ManageServices from './components/ManageServices'
import ManageBookings from './components/bookings/GetBookingsByStatus'



function App() {
  return (
    <>
     
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/area" element={<Area />} />
      <Route path = "/area/add" element={<AddArea/>}/>
      <Route path = "/area/update" element={<UpdateArea/>}/>
      <Route path = "/area/delete" element={<DeleteArea/>}/>
      <Route path = "/area/manage" element={<ManageAreas/>}/>
      <Route path = "/banner" element={<Banner/>}/>
      <Route path = "/banner/add" element={<AddBanner/>}/>
      <Route path = "/banner/delete" element={<DeleteBanner/>}/>
      <Route path = "/banner/manage" element={<ManageBanners/>}/>
      <Route path = "/services" element={<ManageServices/>}/>
      <Route path = "/bookings" element={<ManageBookings/>}/>

      
      
      
    </Routes>

    

    </>
  )
}

export default App
