import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useMachine } from "../context/MachineContext";
import { PasswordModal } from "../components/PasswordModal";
import { LogOut } from "lucide-react";

export const MachineLayout = () => {
    const { logout, machineData } = useMachine();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = (password: string) => {
        // Verify against machine secret
        if (password === machineData?.secret) {
            logout();
            setIsLogoutModalOpen(false);
        } else {
            alert("Incorrect Password"); // Simple alert for now, could be improved
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-urbanist selection:bg-primary selection:text-black overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 animate-pulse"></div>

            {/* Kiosk Header */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-gray-800 pointer-events-auto flex items-center gap-4">
                    <div>
                        <span className="font-bold text-xl tracking-tighter">Reality-X</span>
                        <span className="text-xs text-green-500 ml-2 uppercase font-mono">Machine #{machineData?.machineId || machineData?.id || '...'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 pointer-events-auto">
                    <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-mono text-gray-300">SYSTEM ONLINE</span>
                    </div>

                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-full border border-red-500/20 transition-all"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="h-screen w-full flex flex-col relative z-0 text-white">
                <Outlet />
            </main>

            {/* Kiosk Footer / Legal */}
            <footer className="absolute bottom-4 left-0 w-full text-center text-zinc-600 text-xs z-10 pointer-events-none">
                Smart Waste Management System v2.0 • 24/7 Support: 1800-RECYCLE
            </footer>

            <PasswordModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="System Logout"
                description="Enter machine secret key to logout."
            />
        </div>
    );
};
