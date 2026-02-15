import { SummaryWidgets } from "../components/dashboard/SummaryWidgets";
import { QuickActions } from "../components/dashboard/QuickActions";
import { UserFlow } from "../components/dashboard/UserFlow";
import { CommunityFeed } from "../components/dashboard/CommunityFeed";
import { ImpactSection } from "../components/dashboard/ImpactSection";
import { Banner } from "../components/banner";
import { Footer } from "../components/footer";
import LenisScroll from "../components/lenis";
import { Navbar } from "../components/navbar";

import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useEffect } from "react";

export const Dashboard = () => {
    const { isAuthenticated, user, isLoading } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        // Only redirect if we're done loading and still not authenticated
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isLoading, navigate]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <>
            <Banner />
            <Navbar />
            <LenisScroll />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800 min-h-screen">
                <div className="pt-10 pb-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome Back, {user?.name || 'User'}!</h1>
                    <p className="text-gray-400 mb-8">Track your impact and manage your recycling.</p>

                    <SummaryWidgets />
                    <QuickActions />
                    <UserFlow />
                    <CommunityFeed />
                    <ImpactSection />
                </div>
            </main>
            <Footer />
        </>
    )
}
