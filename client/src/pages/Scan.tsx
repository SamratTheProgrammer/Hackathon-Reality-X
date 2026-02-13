import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Camera, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

export const Scan = () => {
    const navigate = useNavigate();
    // @ts-ignore
    const { addTransaction, isAuthenticated, user, backendUrl } = useApp();
    const [manualCode, setManualCode] = useState("");
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
            timestamp: new Date().toISOString(),
            items: [
                { wasteId: '1', count: 5, points: 50 }, // 5 Plastic Bottles
                { wasteId: '3', count: 10, points: 120 } // 10 Cans
            ]
        };

        processScan(JSON.stringify(mockData));
    };

    const processScan = async (dataString: string) => {
        try {
            // Parse Code/ID
            let transactionCode = "";
            let pointsPreview = 0;

            if (dataString.trim().startsWith('{')) {
                const data = JSON.parse(dataString);
                transactionCode = data.id;
                pointsPreview = data.points;
            } else {
                transactionCode = dataString;
            }

            if (!transactionCode) {
                throw new Error("Invalid Code");
            }

            // Call Backend to Claim
            setScanning(false);

            // Assuming we have user ID in context or can rely on backend? 
            // AppContext addTransaction was local. Now we need a direct fetch or context method.
            // Using fetch directly here for simplicity, or we could add `claimTransaction` to context.

            // We need the authToken/UserId. 
            // `useApp` provides `user`.

            if (!user?.id) {
                throw new Error("User not valid");
            }

            const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/user/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    transactionCode: transactionCode
                })
            });

            const resData = await response.json();

            if (resData.success) {
                setResult({ points: resData.pointsAdded });
            } else {
                if (resData.message?.includes("already claimed")) {
                    throw new Error("This code has already been used.");
                }
                throw new Error(resData.message || "Claim failed");
            }

        } catch (err: any) {
            setError(err.message || "Invalid Code. Please try again.");
            setScanning(true); // Reset to scan again
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualCode.trim()) return;

        // Check for "XXXXXX-PYY" format (Machine Display format)
        // Regex: 6 digits, hyphen, P, digits
        const machineCodeRegex = /^(\d{6})-P(\d+)$/;
        const match = manualCode.trim().match(machineCodeRegex);

        if (match) {
            const [_, idPart, pointsPart] = match;
            const mockData = {
                id: `TX-${idPart}`,
                points: parseInt(pointsPart, 10),
                machineId: "Manual",
                timestamp: new Date().toISOString()
            };
            processScan(JSON.stringify(mockData));
            return;
        }

        // Try to parse as JSON if they pasted the raw JSON, otherwise treat as ID
        try {
            // fast fail if it doesn't look like JSON
            if (!manualCode.trim().startsWith('{')) {
                throw new Error("Not JSON");
            }
            processScan(manualCode);
        } catch {
            // Assume it is just the ID "TX-..."
            if (manualCode.startsWith('TX-')) {
                const mockData = {
                    id: manualCode,
                    points: 150, // Default for manual entry simulation
                    machineId: "Manual",
                    timestamp: new Date().toISOString()
                };
                processScan(JSON.stringify(mockData));
            } else {
                setError("Invalid code format. Enter JSON, TX-..., or XXXXXX-PYY");
                setTimeout(() => setError(""), 3000);
            }
        }
    };

    const [scannerInitialized, setScannerInitialized] = useState(false);

    useEffect(() => {
        if (scanning && isAuthenticated && !scannerInitialized) {
            // Dynamically import to avoid SSR issues if any, though regular import is fine in Vite
            import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
                // Slight delay to ensure DOM is ready
                setTimeout(() => {
                    const scanner = new Html5QrcodeScanner(
                        "reader",
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                            aspectRatio: 1.0,
                            showTorchButtonIfSupported: true
                        },
                        /* verbose= */ false
                    );

                    scanner.render(
                        (decodedText) => {
                            console.log("Scan success:", decodedText);
                            scanner.clear();
                            setScannerInitialized(false);
                            processScan(decodedText);
                        },
                        (_) => {
                            // parse error, ignore typical scanning errors
                        }
                    );
                    setScannerInitialized(true);
                }, 100);
            });
        }
    }, [scanning, isAuthenticated, scannerInitialized]);

    // Cleanup not fully handled here because Html5QrcodeScanner is tricky to cleanup in React strict mode hooks without ref
    // For hackathon, strict mode might double render but we added scannerInitialized check.

    return (
        <>
            <Navbar />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800 min-h-screen flex flex-col items-center justify-center py-10 relative overflow-hidden">
                {/* Background scanning effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20 pointer-events-none"></div>

                {!isAuthenticated ? (
                    <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center relative z-10 shadow-2xl">
                        <div className="size-20 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-6">
                            <Camera className="size-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                        <p className="text-gray-400 mb-8">Please login to scan QR codes and earn points.</p>
                        <div className="flex gap-4 w-full">
                            <SignInButton mode="modal">
                                <button className="flex-1 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl font-bold transition-all">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="flex-1 bg-primary hover:bg-green-400 text-black px-6 py-3 rounded-xl font-bold transition-all">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </div>
                    </div>
                ) : scanning ? (
                    <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center relative z-10 shadow-2xl">
                        <div className="mb-6 relative w-full flex justify-center">
                            {/* Scanner Container */}
                            <div id="reader" className="w-full max-w-[350px] overflow-hidden rounded-2xl border-2 border-primary/50 bg-black">
                                {/* The library injects UI here */}
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
                            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all border border-gray-700 w-full mb-8"
                        >
                            Simulate Scan (Debug)
                        </button>

                        <div className="w-full border-t border-gray-800 pt-6">
                            <p className="text-sm text-gray-400 mb-4">Camera not working? Enter code manually:</p>
                            <form onSubmit={handleManualSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code (e.g., TX-123...)"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary"
                                />
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-green-400 text-black font-bold px-4 py-2 rounded-lg transition-colors"
                                >
                                    Claim Points
                                </button>
                            </form>
                        </div>
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
