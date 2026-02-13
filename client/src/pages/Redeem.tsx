import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { useState } from "react";
import { Ticket, Loader2 } from "lucide-react";
import { RewardsList } from "../components/redeem/RewardsList";
import { RedemptionHistory } from "../components/redeem/RedemptionHistory";

export const Redeem = () => {
    const [code, setCode] = useState("");
    const [redeemState, setRedeemState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    const handleRedeem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setRedeemState('loading');

        // Simulate API call
        setTimeout(() => {
            if (code === "ERROR") {
                setRedeemState('error');
                setMessage("Invalid or expired code.");
            } else {
                setRedeemState('success');
                setMessage(`Successfully redeemed: ${code}`);
                setCode("");
            }
        }, 1500);
    };

    return (
        <>
            <Navbar />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800 min-h-screen py-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-center">Redeem Rewards</h1>

                    {/* Code Redemption Section */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-12 text-center">
                        <h2 className="text-2xl font-bold mb-4">Have a Voucher Code?</h2>
                        <p className="text-gray-400 mb-6">Enter your code below to claim points or rewards.</p>

                        <form onSubmit={handleRedeem} className="max-w-md mx-auto relative">
                            <div className="relative">
                                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => { setCode(e.target.value); setRedeemState('idle'); }}
                                    placeholder="Enter Code (e.g. WELCOME2024)"
                                    className="w-full bg-black border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                    disabled={redeemState === 'loading' || redeemState === 'success'}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!code || redeemState === 'loading' || redeemState === 'success'}
                                className="w-full mt-4 bg-primary hover:bg-secondary disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {redeemState === 'loading' && <Loader2 className="animate-spin size-5" />}
                                {redeemState === 'success' ? "Redeemed!" : "Claim Reward"}
                            </button>

                            {redeemState === 'error' && (
                                <p className="mt-3 text-red-500 font-medium animate-pulse">{message}</p>
                            )}
                            {redeemState === 'success' && (
                                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <p className="text-green-400 font-medium">{message}</p>
                                    <button
                                        type="button"
                                        className="text-sm underline text-green-300 mt-2"
                                        onClick={() => setRedeemState('idle')}
                                    >
                                        Redeem another
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    <RewardsList />
                    <RedemptionHistory />
                </div>
            </main>
            <Footer />
        </>
    )
}
