import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { useApp } from "../context/AppContext";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Ticket, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Redeem = () => {
    const { rewards, userPoints, redeemPoints, isAuthenticated, user } = useApp();
    const navigate = useNavigate();

    const handleRedeem = async (cost: number, name: string) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const success = await redeemPoints(cost, name);
        if (success) {
            toast.success(`Successfully redeemed: ${name}! Check your wallet/history for the voucher code.`);
        } else {
            toast.error("Redemption failed. Insufficient points or network error.");
        }
    };

    return (
        <>
            <Navbar />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800 min-h-screen py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Rewards Store
                            </h1>
                            <p className="text-gray-400">Exchange your hard-earned eco-points for real value.</p>
                        </div>
                        {isAuthenticated && (
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col items-center min-w-[200px]">
                                <span className="text-gray-400 text-sm uppercase tracking-wider">Your Balance</span>
                                <span className="text-4xl font-black text-primary">{userPoints} pts</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {rewards.map((reward) => (
                            <div key={reward.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all group">
                                <div className="h-40 bg-gray-800 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
                                    {/* Placeholder for reward image */}
                                    <Ticket className="size-16 text-gray-700 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-6 relative z-20 -mt-10">
                                    <div className="bg-black/80 backdrop-blur-md border border-gray-700 p-4 rounded-xl mb-4">
                                        <h3 className="font-bold text-lg leading-tight">{reward.name}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{reward.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-yellow-500">{reward.cost} pts</span>
                                        {isAuthenticated ? (
                                            <button
                                                onClick={() => handleRedeem(reward.cost, reward.name)}
                                                disabled={userPoints < reward.cost}
                                                className="px-4 py-2 font-bold rounded-lg transition-colors bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Redeem
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <SignInButton mode="modal">
                                                    <button className="px-3 py-2 text-sm font-bold rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                                                        Sign In
                                                    </button>
                                                </SignInButton>
                                                <SignUpButton mode="modal">
                                                    <button className="px-3 py-2 text-sm font-bold rounded-lg bg-primary text-black hover:bg-green-400 transition-colors">
                                                        Sign Up
                                                    </button>
                                                </SignUpButton>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Transaction/Redemption History */}
                    {isAuthenticated && (
                        <div className="border-t border-gray-800 pt-10">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Clock className="size-6 text-gray-400" /> Your Redemptions
                            </h2>

                            {!user?.redemptions || user.redemptions.length === 0 ? (
                                <div className="bg-gray-900/30 rounded-xl p-8 text-center border border-gray-800 border-dashed">
                                    <p className="text-gray-500">No redemption history yet. Start recycling!</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {user.redemptions.slice().reverse().map((redemption, idx) => (
                                        <div key={idx} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 bg-green-900/20 rounded-full flex items-center justify-center text-green-500">
                                                    <Ticket className="size-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{redemption.rewardName}</h4>
                                                    <p className="text-sm text-gray-400">
                                                        Redeemed on {new Date(redemption.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1">
                                                <div className="bg-black border border-gray-700 px-3 py-1 rounded-md">
                                                    <code className="text-green-400 font-mono font-bold tracking-wider">{redemption.code}</code>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    Expires: {new Date(redemption.expiresAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};
