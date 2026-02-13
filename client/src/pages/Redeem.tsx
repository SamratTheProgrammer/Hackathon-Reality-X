import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { useApp } from "../context/AppContext";
import { Ticket, Clock } from "lucide-react";

export const Redeem = () => {
    const { rewards, userPoints, redeemPoints } = useApp();

    const handleRedeem = (cost: number, name: string) => {
        if (redeemPoints(cost)) {
            alert(`Successfully redeemed: ${name}! Check your wallet for the voucher code.`);
        } else {
            alert("Insufficient points!");
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
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col items-center min-w-[200px]">
                            <span className="text-gray-400 text-sm uppercase tracking-wider">Your Balance</span>
                            <span className="text-4xl font-black text-primary">{userPoints} pts</span>
                        </div>
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
                                        <button
                                            onClick={() => handleRedeem(reward.cost, reward.name)}
                                            disabled={userPoints < reward.cost}
                                            className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Redeem
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Transaction/Redemption History Placeholder */}
                    <div className="border-t border-gray-800 pt-10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Clock className="size-6 text-gray-400" /> Recent Activity
                        </h2>
                        <div className="bg-gray-900/30 rounded-xl p-8 text-center border border-gray-800 border-dashed">
                            <p className="text-gray-500">No redemption history yet. Start recycling!</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};
