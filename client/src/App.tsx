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
import { Community } from "./pages/Community";
import { HowItWorks } from "./pages/HowItWorks";

// Admin Imports
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminMachines } from "./pages/admin/Machines";
import { AdminWasteRules } from "./pages/admin/WasteRules";
import { AdminUsers } from "./pages/admin/Users";
import { AdminAnalytics } from "./pages/admin/Analytics";
import { AdminRewards } from "./pages/admin/Rewards";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

const ProtectedAdminRoute = ({ children }: { children: ReactNode }) => {
    const { user, isAuthenticated, isLoading } = useApp();

    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>; // Or a nice spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    if (user?.role !== 'admin') {
        // Prevent loop if logic is weird, but technically this means a User is trying to access Admin
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

import { Toaster } from 'sonner';

function App() {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <AppProvider>
                <Toaster position="top-center" theme="dark" />
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
                    <Route path="/community" element={<Community />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedAdminRoute>
                            <AdminLayout />
                        </ProtectedAdminRoute>
                    }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="machines" element={<AdminMachines />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="waste-rules" element={<AdminWasteRules />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                        <Route path="rewards" element={<AdminRewards />} />
                    </Route>

                </Routes>
            </AppProvider>
        </ClerkProvider>
    )
}

export default App