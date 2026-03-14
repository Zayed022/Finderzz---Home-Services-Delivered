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

import AddCategory from './components/category/AddCategory'
import AddService from './components/category/AddService'
import AddSubService from './components/category/AddSubService'
import EditCategory from './components/EditCategory'
import EditService from './components/EditService'
import EditSubService from './components/EditSubService'
import ManageBookings from './components/ManageBookings'
import Bookings from './components/Bookings'
import GetBookingById from './components/bookings/GetBookingsById'
import Worker from './components/Worker'



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
      <Route path = "/services/add-category" element={<AddCategory/>}/>
      <Route path = "/services/add-service" element={<AddService/>}/>
      <Route path = "/services/add-subservice" element={<AddSubService/>}/>
      <Route path="/services/edit-category/:id" element={<EditCategory />} />
      <Route path="/services/edit-service/:id" element={<EditService />} />
      <Route
  path="/services/edit-subservice/:id"
  element={<EditSubService />}
/>
      <Route path = "/bookings" element={<Bookings/>}/>
      <Route path = "/bookings/manage" element={<ManageBookings/>}/>
      <Route path = "/bookings/id" element={<GetBookingById/>}/>
      <Route path = "/worker" element={<Worker/>}/>

      
      
      
    </Routes>

    

    </>
  )
}

export default App
