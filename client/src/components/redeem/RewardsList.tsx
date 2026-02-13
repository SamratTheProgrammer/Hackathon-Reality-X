import { Gift, Lock } from "lucide-react";

export const RewardsList = () => {
    const rewards = [
        { id: 1, name: "$5 Amazon Gift Card", cost: 500, image: "https://placehold.co/100x100?text=Amazon", available: true },
        { id: 2, name: "Free Coffee Voucher", cost: 200, image: "https://placehold.co/100x100?text=Coffee", available: true },
        { id: 3, name: "Movie Ticket (50% Off)", cost: 350, image: "https://placehold.co/100x100?text=Movie", available: true },
        { id: 4, name: "Premium Subscription", cost: 1000, image: "https://placehold.co/100x100?text=Premium", available: false }, // Not enough points simulated
    ];

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Gift className="text-primary" />
                Available Rewards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rewards.map((reward) => (
                    <div key={reward.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all group">
                        <div className="h-32 overflow-hidden bg-gray-800 relative">
                            <img src={reward.image} alt={reward.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            {!reward.available && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Lock className="text-gray-400 size-8" />
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{reward.name}</h3>
                            <p className="text-primary font-medium mb-4">{reward.cost} pts</p>
                            <button
                                disabled={!reward.available}
                                className={`w-full py-2 rounded-lg font-medium transition-colors ${reward.available
                                        ? 'bg-white text-black hover:bg-gray-200'
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {reward.available ? "Redeem" : "Insufficient Points"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
