import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Camera, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const Scan = () => {
    const navigate = useNavigate();
    const { addTransaction } = useApp();
    const [scanning, setScanning] = useState(true);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    // Simulated QR Scan
    const handleSimulateScan = () => {
        // Mocking a QR code data from the Machine App
        // Format: { id: "TX-123456", points: 150 }
        const mockData = {
            id: `TX-${Date.now().toString().slice(-6)}`,
            points: 150,
            machineId: "M402",
            timestamp: new Date().toISOString()
        };

        processScan(JSON.stringify(mockData));
    };

    const processScan = (dataString: string) => {
        try {
            const data = JSON.parse(dataString);

            // Basic Validation
            if (!data.id || !data.points) {
                throw new Error("Invalid QR Code format");
            }

            // In a real app, we would verify signature with backend here.

            setResult(data);
            setScanning(false);

            // Auto-add points
            addTransaction({
                id: data.id,
                machineId: data.machineId || "Unknown",
                userId: "user-1",
                items: [], // Details might not be in QR to save space, or fetched from ID
                totalPoints: data.points,
                timestamp: data.timestamp || new Date().toISOString(),
                status: 'Completed'
            });

        } catch (err) {
            setError("Invalid QR Code. Please try again.");
            setTimeout(() => setError(""), 3000);
        }
    };

    return (
        <>
            <Navbar />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800 min-h-screen flex flex-col items-center justify-center py-10 relative overflow-hidden">
                {/* Background scanning effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20 pointer-events-none"></div>

                {scanning ? (
                    <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center relative z-10 shadow-2xl">
                        <div className="mb-6 relative">
                            <div className="size-64 bg-black rounded-2xl border-2 border-gray-700 flex items-center justify-center overflow-hidden relative">
                                <Camera className="size-12 text-gray-600 animate-pulse" />
                                {/* Scanning Line Animation */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-[scan_2s_linear_infinite]"></div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Scan QR Code</h2>
                        <p className="text-gray-400 mb-8">Point your camera at the kiosk screen to claim your points.</p>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg mb-4">
                                <AlertTriangle className="size-4" /> {error}
                            </div>
                        )}

                        <button
                            onClick={handleSimulateScan}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all border border-gray-700 w-full mb-4"
                        >
                            Simulate Scan (Debug)
                        </button>

                        <p className="text-xs text-gray-500">
                            Align the code within the frame to scan automatically.
                        </p>
                    </div>
                ) : (
                    <div className="w-full max-w-md bg-gray-900 border border-green-500/30 rounded-3xl p-8 flex flex-col items-center text-center relative z-10 shadow-[0_0_50px_rgba(34,197,94,0.1)] animate-in zoom-in duration-300">
                        <div className="size-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6">
                            <CheckCircle className="size-10" />
                        </div>

                        <h2 className="text-3xl font-black text-white mb-2">Points Added!</h2>
                        <p className="text-gray-400 mb-8">Transaction successfully verified.</p>

                        <div className="bg-black/50 p-6 rounded-2xl border border-gray-800 w-full mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500 uppercase text-xs font-bold tracking-wider">Received</span>
                                <span className="text-4xl font-black text-primary">+{result?.points}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-primary hover:bg-primary/90 text-black px-8 py-4 rounded-xl font-black w-full flex items-center justify-center gap-2 transition-all"
                        >
                            Go to Dashboard <ArrowRight className="size-5" />
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};
