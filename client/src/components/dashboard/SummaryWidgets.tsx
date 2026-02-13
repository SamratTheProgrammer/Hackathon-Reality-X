import { Leaf, Recycle, Coins, TrendingUp } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const SummaryWidgets = () => {
    const { user, userPoints } = useApp();

    const stats = [
        {
            label: "Total Points",
            value: userPoints.toLocaleString(),
            unit: "pts",
            icon: Coins,
            color: "text-yellow-400"
        },
        {
            label: "CO₂ Saved",
            value: user?.wasteStats?.totalWeight
                ? (user.wasteStats.totalWeight * 0.0025).toFixed(1) // Mock or real calc
                : "0",
            unit: "kg",
            icon: Leaf,
            color: "text-green-400"
        },
        {
            label: "Waste Recycled",
            value: user?.wasteStats?.totalWeight
                ? (user.wasteStats.totalWeight / 1000).toFixed(1)
                : "0",
            unit: "kg",
            icon: Recycle,
            color: "text-blue-400"
        },
        {
            label: "Bottles & Cans",
            value: user?.wasteStats
                ? ((user.wasteStats.plasticBottles || 0) + (user.wasteStats.glassBottles || 0) + (user.wasteStats.aluminumCans || 0)).toString()
                : "0",
            unit: "items",
            icon: TrendingUp,
            color: "text-purple-400"
        },
    ];

    return (
        <section className="py-8 border-b border-gray-800">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="p-5 rounded-2xl border border-gray-800 bg-black/50 hover:border-gray-700 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                            <stat.icon className={`size-5 ${stat.color} opacity-80`} />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                            <span className="text-xs text-gray-500">{stat.unit}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
