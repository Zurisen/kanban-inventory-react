import { Routes, Route } from "react-router-dom";
import Projects from '../pages/Projects/Projects'
import Calendar from "../pages/Calendar/Calendar";
import Dashboard from "../pages/Dashboard/Dashboard";
import Inventory from "../pages/Inventory/Inventory";

export const AllRoutes = ({snapshotData, statesData, stateColors}) => {
  return (
    <>
    <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/Inventory" element={<Inventory snapshotData={snapshotData} statesData={statesData} stateColors={stateColors}/>} />
        <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
    </>
  )
}
