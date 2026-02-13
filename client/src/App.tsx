import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Scan } from "./pages/Scan";
import { Redeem } from "./pages/Redeem";
import { Locate } from "./pages/Locate";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/redeem" element={<Redeem />} />
            <Route path="/locate" element={<Locate />} />
        </Routes>
    )
}