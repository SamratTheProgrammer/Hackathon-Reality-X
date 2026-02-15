import { useNavigate } from "react-router-dom";
import { useMachine } from "../context/MachineContext";
import { CheckCircle, Home } from "lucide-react";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

export const MachineSummary = () => {
    const navigate = useNavigate();
    const { currentTransaction, resetTransaction } = useMachine();
    const [countdown, setCountdown] = useState(120);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    resetTransaction();
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate, resetTransaction]);

    if (!currentTransaction) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center">
                <p>No active transaction.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-green-500 underline">Return Home</button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-500 h-screen overflow-hidden">
            <div className="bg-green-500/20 p-4 rounded-full text-green-500 mb-4 shrink-0">
                <CheckCircle className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-black text-white mb-2">Thank you for using EcoLoop!</h2>
            <p className="text-lg text-gray-400 max-w-md mx-auto mb-6">
                You've recycled <span className="text-white font-bold">{currentTransaction.items.reduce((a, b) => a + b.count, 0)} items</span>
            </p>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full mx-auto shrink-0">
                <div className="bg-white p-3 rounded-lg">
                    <QRCode value={JSON.stringify({
                        id: currentTransaction.id,
                        points: currentTransaction.totalPoints,
                        items: currentTransaction.items
                    })} size={140} />
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-xs text-gray-500 uppercase font-mono mb-1">Total Reward</p>
                    <p className="text-5xl font-black text-green-500">{currentTransaction.totalPoints} <span className="text-2xl text-white">pts</span></p>
                </div>

                <div className="w-full h-px bg-gray-800 my-1"></div>

                <div className="flex flex-col items-center w-full">
                    <p className="text-xs text-gray-500 uppercase font-mono mb-1">Redeem Code</p>
                    <div className="w-full bg-gray-800 py-2 rounded-lg border border-gray-700 font-mono text-xl tracking-widest text-center select-all text-white">
                        {currentTransaction.id.split('-')[1]}-P{currentTransaction.totalPoints}
                    </div>
                </div>
            </div>

            <p className="mt-6 text-sm text-gray-500">
                Scan with EcoLoop App to claim.<br />
                Auto-closing in {countdown}s
            </p>

            <button
                onClick={() => { resetTransaction(); navigate('/'); }}
                className="mt-6 px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold flex items-center gap-2 text-sm transition-colors border border-gray-700"
            >
                <Home className="w-4 h-4" /> Done
            </button>
        </div>
    );
};
