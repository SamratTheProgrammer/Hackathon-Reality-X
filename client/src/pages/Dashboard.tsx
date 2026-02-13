import { SummaryWidgets } from "../components/dashboard/SummaryWidgets";
import { QuickActions } from "../components/dashboard/QuickActions";
import { UserFlow } from "../components/dashboard/UserFlow";
import { CommunityFeed } from "../components/dashboard/CommunityFeed";
import { ImpactSection } from "../components/dashboard/ImpactSection";
import { Banner } from "../components/banner";
import { Footer } from "../components/footer";
import LenisScroll from "../components/lenis";
import { Navbar } from "../components/navbar";

export const Dashboard = () => {
    return (
        <>
            <Banner />
            <Navbar />
            <LenisScroll />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800 min-h-screen">
                <div className="pt-10 pb-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome Back, User!</h1>
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
