import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { useState } from "react";
import { Camera, Image, Keyboard, CheckCircle2, MapPin } from "lucide-react";

export const Scan = () => {
    const [scanState, setScanState] = useState<'initial' | 'scanning' | 'manual' | 'success'>('initial');
    const [manualCode, setManualCode] = useState("");
    const [error, setError] = useState("");

    const handleStartScan = () => {
        setScanState('scanning');
        // Simulate scan delay then success
        setTimeout(() => {
            setScanState('success');
        }, 3000);
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode.length < 5) {
            setError("Code must be at least 5 characters");
            return;
        }
        setError("");
        setScanState('success');
    };

    return (
        <>
            <Navbar />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800 min-h-screen py-10 flex flex-col items-center justify-center">

                <h1 className="text-4xl font-bold mb-2 text-center">Scan QR / Login</h1>
                <p className="text-gray-400 mb-8 text-center">Connect to a nearby Smart Waste Machine</p>

                <div className="w-full max-w-md p-6 border border-gray-800 rounded-2xl bg-gray-900/50 relative overflow-hidden">

                    {scanState === 'initial' && (
                        <div className="flex flex-col gap-4">
                            <div className="aspect-square bg-gray-950 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center mb-4">
                                <Camera className="size-16 text-gray-600" />
                            </div>

                            <button
                                onClick={handleStartScan}
                                className="bg-primary hover:bg-secondary text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <Camera className="size-5" />
                                Start Scan
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                    <Image className="size-5" />
                                    Upload Image
                                </button>
                                <button
                                    onClick={() => setScanState('manual')}
                                    className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Keyboard className="size-5" />
                                    Enter Code
                                </button>
                            </div>
                        </div>
                    )}

                    {scanState === 'scanning' && (
                        <div className="flex flex-col items-center justify-center h-80">
                            <div className="relative size-48">
                                <div className="absolute inset-0 border-4 border-primary/30 rounded-lg"></div>
                                <div className="absolute inset-0 border-t-4 border-primary rounded-lg animate-pulse"></div>
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(30,255,0,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
                            </div>
                            <p className="mt-6 text-primary animate-pulse font-medium">Scanning...</p>
                        </div>
                    )}

                    {scanState === 'manual' && (
                        <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                            <label className="text-sm font-medium text-gray-300">Enter Machine QR Code / ID</label>
                            <input
                                type="text"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                placeholder="e.g. WM-2049-X"
                                className="bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => { setScanState('initial'); setError(''); }}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-secondary text-black font-bold py-3 rounded-xl transition-colors"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    )}

                    {scanState === 'success' && (
                        <div className="flex flex-col items-center text-center py-4">
                            <div className="size-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="size-8 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">Connected!</h3>
                            <p className="text-gray-400 mb-6">You've successfully logged in.</p>

                            <div className="bg-gray-950 rounded-xl p-4 w-full mb-6 flex items-start text-left gap-3">
                                <MapPin className="size-5 text-gray-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-400">Machine Location</p>
                                    <p className="font-semibold text-white">Central Mall, 2nd Floor (Zone B)</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="flex size-2 bg-green-500 rounded-full"></span>
                                        <span className="text-xs text-green-400 font-medium">Session Active</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-primary hover:bg-secondary text-black font-bold py-3 px-6 rounded-xl transition-colors">
                                Continue to AR Instructions
                            </button>
                        </div>
                    )}
                </div>

                <style>{`
                    @keyframes scan {
                        0% { top: 0; }
                        50% { top: 100%; }
                        100% { top: 0; }
                    }
                `}</style>
            </main>
            <Footer />
        </>
    )
}
