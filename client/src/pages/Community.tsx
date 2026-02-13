import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Users } from "lucide-react";

export const Community = () => {
    return (
        <>
            <Navbar />
            <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
                <Users className="size-20 text-green-500 mb-6" />
                <h1 className="text-4xl font-bold mb-4">Community</h1>
                <p className="text-gray-400 text-center max-w-md">
                    Connect with other eco-warriors and track our collective impact.
                    <br />
                    <span className="text-sm mt-4 block text-gray-600">Coming Soon</span>
                </p>
            </main>
            <Footer />
        </>
    );
};
