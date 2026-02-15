
import { Link } from "react-router-dom";
import { QrCode, ArrowRight, Ban, Settings, X } from "lucide-react";
import { useMachine } from "../context/MachineContext";
import { useState } from "react";
import QRCode from "react-qr-code";

export const MachineStart = () => {
    const { machineStatus, capacity } = useMachine();
    const [showAppQr, setShowAppQr] = useState(false);

    if (machineStatus === 'Full' || machineStatus === 'Maintenance') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-500">
                <div className="bg-red-500/20 p-8 rounded-full text-red-500 mb-6">
                    {machineStatus === 'Full' ? <Ban className="w-24 h-24" /> : <Settings className="w-24 h-24" />}
                </div>
                <img src="/logo.png" alt="EcoLoop" className="w-20 h-auto mb-4 mx-auto" />
                <h1 className="text-3xl font-black text-white mb-2">Welcome to EcoLoop</h1>
                <h1 className="text-5xl font-black text-white mb-4">
                    Machine {machineStatus}
                </h1>
                <p className="text-2xl text-gray-400 max-w-xl">
                    {machineStatus === 'Full'
                        ? "Storage capacity reached. Please find another nearby unit."
                        : "System is currently undergoing maintenance."}
                </p>
                <div className="mt-8 px-6 py-2 bg-gray-900 rounded-full border border-gray-800 text-sm text-gray-500 font-mono">
                    Capacity: {capacity}%
                </div>
            </div>
        );
    }

    if (showAppQr) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in duration-300 relative">
                <button
                    onClick={() => setShowAppQr(false)}
                    className="absolute top-10 right-10 p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                >
                    <X className="w-8 h-8" />
                </button>

                <h2 className="text-4xl font-bold mb-8">Scan to Open App</h2>
                <div className="p-8 bg-white rounded-3xl shadow-xl mb-8">
                    <QRCode value="https://reality-x-server.vercel.app" size={256} />
                </div>
                <p className="text-gray-400 text-xl max-w-md">
                    Scan this QR code with your mobile device to access the companion web app.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 text-center space-y-6 md:space-y-10 animate-in fade-in duration-700">
            <div className="space-y-4 pt-10 md:pt-0">
                <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                    Start Recycling
                </h1>
                <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto">
                    Deposit your plastic bottles, cans, and e-waste to earn instant rewards.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-4xl">
                <div
                    onClick={() => setShowAppQr(true)}
                    className="bg-gray-900/50 border border-gray-800 p-6 md:p-10 rounded-3xl flex flex-col items-center gap-4 md:gap-6 hover:bg-gray-800/80 transition-colors cursor-pointer group"
                >
                    <div className="p-4 md:p-6 bg-green-500/20 rounded-full text-green-500 group-hover:scale-110 transition-transform">
                        <QrCode className="w-10 h-10 md:w-16 md:h-16" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Scan App QR</h3>
                        <p className="text-sm md:text-base text-gray-400">Get the EcoLoop App</p>
                    </div>
                </div>

                <Link to="/deposit" className="bg-white text-black border border-white p-6 md:p-10 rounded-3xl flex flex-col items-center gap-4 md:gap-6 hover:bg-gray-200 transition-colors cursor-pointer group">
                    <div className="p-4 md:p-6 bg-black/10 rounded-full text-black group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-10 h-10 md:w-16 md:h-16" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Deposit Waste</h3>
                        <p className="text-sm md:text-base text-gray-600">Start recycling immediately</p>
                    </div>
                </Link>
            </div>

            <div className="mt-10 flex gap-4 text-sm text-gray-500 font-mono">
                <span>ACCEPTED: PET BOTTLES • ALUM. CANS • GLASS • E-WASTE</span>
            </div>
        </div>
    );
};

