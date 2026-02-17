import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Camera, CheckCircle, AlertTriangle, ArrowRight, Zap, ZapOff, RefreshCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Html5Qrcode } from "html5-qrcode";

export const Scan = () => {
    const navigate = useNavigate();
    // @ts-ignore
    const { addTransaction, isAuthenticated, user, backendUrl, refreshUser } = useApp();
    const [manualCode, setManualCode] = useState("");
    const [scanning, setScanning] = useState(true);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    // Custom Camera UI State
    const [cameraId, setCameraId] = useState<string | null>(null);
    const [cameras, setCameras] = useState<Array<any>>([]);
    const [torchOn, setTorchOn] = useState(false);

    // Scanner references
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isScannerRunning = useRef(false);

    // Validation Helper
    const isValidQR = (data: string): boolean => {
        // Check for JSON structure with 'id'
        if (data.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(data);
                return !!parsed.id;
            } catch {
                return false;
            }
        }
        // Check for 'TX-' or 'REDEEM-' prefix if using simple strings
        if (data.startsWith('TX-') || data.startsWith('REDEEM-')) {
            return true;
        }
        return false;
    };

    const processScan = async (dataString: string) => {
        try {
            // Pre-fetch Validation
            if (!isValidQR(dataString)) {
                throw new Error("Invalid QR Code Format");
            }

            // Parse Code/ID
            let transactionCode = "";

            if (dataString.trim().startsWith('{')) {
                const data = JSON.parse(dataString);
                transactionCode = data.id;
            } else {
                transactionCode = dataString;
            }

            if (!transactionCode) {
                throw new Error("Invalid Code");
            }

            // Call Backend to Claim
            setScanning(false);

            // Stop scanner if running
            if (scannerRef.current && isScannerRunning.current) {
                await scannerRef.current.stop();
                isScannerRunning.current = false;
            }

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
                // Refresh user data to update dashboard
                if (refreshUser) {
                    await refreshUser();
                }
            } else {
                // Backend returns specific messages now
                throw new Error(resData.message || "Claim failed");
            }

        } catch (err: any) {
            setError(err.message || "Invalid Code. Please try again.");
            setScanning(false); // Temporarily stop scanning loop logic in UI

            // Re-enable scanning after error
            setTimeout(() => {
                setScanning(true);
                setError("");
            }, 3000);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualCode.trim()) return;

        // Check for "XXXXXX-PYY" format (Machine Display format)
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

        try {
            if (!manualCode.trim().startsWith('{')) {
                throw new Error("Not JSON");
            }
            processScan(manualCode);
        } catch {
            if (manualCode.startsWith('TX-')) {
                const mockData = {
                    id: manualCode,
                    points: 150,
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

    // Initialize Scanner and toggle based on scanning state
    useEffect(() => {
        let isMounted = true;

        const initAndStart = async () => {
            if (scanning && isAuthenticated) {
                try {
                    // Initialize instance if not exists
                    if (!scannerRef.current) {
                        scannerRef.current = new Html5Qrcode("reader", {
                            verbose: false,
                        });
                    }

                    // Get Cameras if needed and Filter (1 Front, 1 Back)
                    if (cameras.length === 0) {
                        try {
                            const devices = await Html5Qrcode.getCameras();
                            if (isMounted && devices && devices.length > 0) {
                                // Filter Logic
                                const uniqueCameras: any[] = [];
                                const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
                                const frontCam = devices.find(d => d.label.toLowerCase().includes('front') || d.label.toLowerCase().includes('user'));

                                if (backCam) uniqueCameras.push(backCam);
                                if (frontCam) uniqueCameras.push(frontCam);

                                // If detection failed, just take first 2 unique
                                if (uniqueCameras.length === 0) {
                                    uniqueCameras.push(devices[0]);
                                    if (devices.length > 1) uniqueCameras.push(devices[1]);
                                } else if (uniqueCameras.length === 1 && devices.length > 1) {
                                    // If only one found but more exist, add another one that is not already added
                                    const other = devices.find(d => d.id !== uniqueCameras[0].id);
                                    if (other) uniqueCameras.push(other);
                                }

                                setCameras(uniqueCameras);

                                // Set default camera (back) if not set
                                if (!cameraId) {
                                    setCameraId(backCam ? backCam.id : uniqueCameras[0].id);
                                    return; // Return here, effect will re-run when cameraId updates
                                }
                            }
                        } catch (e) {
                            console.error("Error getting cameras", e);
                            if (isMounted) setError("Camera access required.");
                        }
                    }

                    // Start Scanning
                    if (cameraId && !isScannerRunning.current) {
                        await scannerRef.current.start(
                            cameraId,
                            {
                                fps: 10,
                                qrbox: { width: 250, height: 250 },
                                aspectRatio: 1.0,
                            },
                            (decodedText) => {
                                processScan(decodedText);
                            },
                            (_) => {
                                // ignore scan errors
                            }
                        );
                        isScannerRunning.current = true;
                    }
                } catch (err) {
                    console.error("Failed to start scanner", err);
                    if (isMounted) isScannerRunning.current = false;
                }
            } else {
                // Stop if not scanning
                if (scannerRef.current && isScannerRunning.current) {
                    try {
                        await scannerRef.current.stop();
                        isScannerRunning.current = false;
                    } catch (e) {
                        console.error("Error stopping scanner", e);
                    }
                }
            }
        };

        // Delay slightly to ensure DOM is ready
        const timer = setTimeout(() => {
            initAndStart();
        }, 100);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [scanning, isAuthenticated, cameraId, cameras.length]); // Dependencies

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current && isScannerRunning.current) {
                scannerRef.current.stop().catch(e => console.error("Unmount stop fail", e));
                isScannerRunning.current = false;
            }
        };
    }, []);

    const toggleTorch = async () => {
        if (scannerRef.current && isScannerRunning.current) {
            try {
                // Robust Torch Check
                // @ts-ignore - getRunningTrack might be missing in some type versions
                const track = scannerRef.current.getRunningTrack ? scannerRef.current.getRunningTrack() : null;

                if (!track) {
                    // Fallback if getRunningTrack is not available
                    await scannerRef.current.applyVideoConstraints({
                        advanced: [{ torch: !torchOn }]
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any);
                    setTorchOn(!torchOn);
                    return;
                }

                const capabilities = track.getCapabilities();
                // @ts-ignore - torch is not in standard types sometimes
                if (!capabilities.torch) {
                    console.warn("Torch not supported on this device/track");
                    // Optionally show UI feedback "Torch not available"
                    return;
                }

                await track.applyConstraints({
                    advanced: [{ torch: !torchOn }]
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any);
                setTorchOn(!torchOn);
            } catch (err) {
                console.error("Torch toggle failed", err);
                // Fallback attempt with video constraints on scanner instance directly if track method fails
                try {
                    await scannerRef.current.applyVideoConstraints({
                        advanced: [{ torch: !torchOn }]
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any);
                    setTorchOn(!torchOn);
                } catch (e) {
                    console.error("Fallback torch failed", e);
                }
            }
        }
    };

    const switchCamera = () => {
        if (cameras.length > 1) {
            const currentIdx = cameras.findIndex(c => c.id === cameraId);
            const nextIdx = (currentIdx + 1) % cameras.length;
            const nextCamId = cameras[nextIdx].id;

            // Stop current scan first
            if (scannerRef.current && isScannerRunning.current) {
                scannerRef.current.stop().then(() => {
                    isScannerRunning.current = false;
                    setCameraId(nextCamId); // This will trigger the effect to restart
                    setTorchOn(false); // Reset torch
                }).catch(err => {
                    console.error("Failed to stop for switch", err);
                    // Force switch anyway?
                    setCameraId(nextCamId);
                });
            } else {
                setCameraId(nextCamId);
            }
        }
    };

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
                    <div className="w-full max-w-md flex flex-col items-center relative z-10">
                        {/* Premium Scanner UI */}
                        <div className="relative w-full aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800/50 mb-8">
                            {/* Video Element */}
                            <div id="reader" className="w-full h-full object-cover"></div>

                            {/* Overlay UI */}
                            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                                {/* Top Controls */}
                                <div className="flex justify-between items-start pointer-events-auto">
                                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-medium text-white/80">
                                        Scan QR
                                    </div>
                                    <div className="flex gap-3">
                                        {/* Camera Switch Button */}
                                        {cameras.length > 1 && (
                                            <button
                                                onClick={switchCamera}
                                                className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
                                            >
                                                <RefreshCcw className="size-5" />
                                            </button>
                                        )}
                                        {/* Torch Button */}
                                        <button
                                            onClick={toggleTorch}
                                            className={`size-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all active:scale-95 ${torchOn ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-black/40 border-white/10 text-white hover:bg-white/20'}`}
                                        >
                                            {torchOn ? <ZapOff className="size-5" /> : <Zap className="size-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Center Target Frame */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-48 opacity-80">
                                    <div className="absolute top-0 left-0 size-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                                    <div className="absolute top-0 right-0 size-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                                    <div className="absolute bottom-0 left-0 size-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                                    <div className="absolute bottom-0 right-0 size-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                                    {/* Scanning Line Animation */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_20px_rgba(34,197,94,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                                </div>

                                {/* Bottom Status */}
                                <div className="text-center">
                                    <p className="text-white/80 text-sm font-medium drop-shadow-md bg-black/20 backdrop-blur-sm inline-block px-3 py-1 rounded-full">
                                        Point camera at code
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Setup for scan animation */}
                        <style>{`
                            @keyframes scan {
                                0% { top: 0%; opacity: 0; }
                                10% { opacity: 1; }
                                90% { opacity: 1; }
                                100% { top: 100%; opacity: 0; }
                            }
                        `}</style>

                        {/* Error Display */}
                        {error && (
                            <div className="flex items-center gap-2 text-white bg-red-500/90 backdrop-blur-sm px-4 py-3 rounded-xl mb-6 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                                <AlertTriangle className="size-5" /> {error}
                            </div>
                        )}

                        {/* Manual Entry Section */}
                        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-xl">
                            <p className="text-sm text-gray-400 mb-4 font-medium">Having trouble? Enter code manually:</p>
                            <form onSubmit={handleManualSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code (e.g., TX-123...)"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    className="flex-1 bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition-all active:scale-95 whitespace-nowrap"
                                >
                                    Claim
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
