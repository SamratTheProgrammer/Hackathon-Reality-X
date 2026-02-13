import { Route, Routes, Navigate } from "react-router-dom";
import { type ReactNode } from 'react';
import { ClerkProvider } from "@clerk/clerk-react";
import { AppProvider, useApp } from "./context/AppContext";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Scan } from "./pages/Scan";
import { Redeem } from "./pages/Redeem";
import { Locate } from "./pages/Locate";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AdminLogin } from "./pages/AdminLogin";

// Admin Imports
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminMachines } from "./pages/admin/Machines";
import { AdminWasteRules } from "./pages/admin/WasteRules";
import { AdminAnalytics } from "./pages/admin/Analytics";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

const ProtectedAdminRoute = ({ children }: { children: ReactNode }) => {
    const { user, isAuthenticated } = useApp();

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <AppProvider>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin-login" element={<AdminLogin />} />

                    {/* Client Routes - Protected by Auth Context + Clerk */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/scan" element={<Scan />} />
                    <Route path="/redeem" element={<Redeem />} />
                    <Route path="/locate" element={<Locate />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedAdminRoute>
                            <AdminLayout />
                        </ProtectedAdminRoute>
                    }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="machines" element={<AdminMachines />} />
                        <Route path="waste-rules" element={<AdminWasteRules />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                    </Route>

                </Routes>
            </AppProvider>
        </ClerkProvider>
    )
}

export default App