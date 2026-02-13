import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MachineLayout } from "./layouts/MachineLayout";
import { MachineStart } from "./pages/StartSession";
import { MachineDeposit } from "./pages/Deposit";
import { MachineSummary } from "./pages/Summary";
import { MachineLogin } from "./pages/auth/MachineLogin";
import { MachineSignup } from "./pages/auth/MachineSignup";
import { MachineDashboard } from "./pages/dashboard/MachineDashboard";
import { MachineProvider } from "./context/MachineContext";

function App() {
  return (
    <MachineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/machine-login" element={<MachineLogin />} />
          <Route path="/machine-signup" element={<MachineSignup />} />
          <Route path="/machine-dashboard" element={<MachineDashboard />} />

          <Route path="/" element={<MachineLayout />}>
            <Route index element={<MachineStart />} />
            <Route path="deposit" element={<MachineDeposit />} />
            <Route path="summary" element={<MachineSummary />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MachineProvider>
  )
}

export default App
