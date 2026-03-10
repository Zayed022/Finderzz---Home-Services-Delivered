import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Area from "../components/Area";


export default function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="/area" element={<Area />} />

        

      </Routes>

    </BrowserRouter>
  );

}