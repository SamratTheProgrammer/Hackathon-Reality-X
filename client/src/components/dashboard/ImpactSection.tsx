import { useState, useEffect } from "react";
import { TreeDeciduous, Users, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ImpactSection = () => {
    const { user, backendUrl } = useApp();
    const [stats, setStats] = useState({
        activeUsers: 0,
        totalWeight: 0,
        totalItems: 0,
        totalCO2: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/user/community-stats`);
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch community stats", error);
            }
        };
        fetchStats();
    }, [backendUrl]);

    return (
        <section id="impact" className="py-12 border-b border-gray-800">
            <h2 className="text-3xl font-bold mb-8 text-center">Your Environmental Impact</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Personal Impact */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TreeDeciduous className="text-green-500" />
                        My Contribution
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Cardboard Recycled</span>
                                <span className="font-bold">
                                    {((user?.wasteStats?.paperWeight || 0) / 1000).toFixed(1)} kg <span className="text-gray-600 font-normal">/ 10 kg</span>
                                </span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2.5">
                                <div
                                    className="bg-green-500 h-2.5 rounded-full"
                                    style={{ width: `${Math.min(((user?.wasteStats?.paperWeight || 0) / 10000) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Plastic Bottles Saved</span>
                                <span className="font-bold">
                                    {user?.wasteStats?.plasticBottles || 0} <span className="text-gray-600 font-normal">/ 100 bottles</span>
                                </span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2.5">
                                <div
                                    className="bg-blue-500 h-2.5 rounded-full"
                                    style={{ width: `${Math.min(((user?.wasteStats?.plasticBottles || 0) / 100) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Segregation Accuracy</span>
                                <span className="font-bold">98%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2.5">
                                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "98%" }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Community Stats */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Users className="text-blue-500" />
                        Community Impact
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black p-4 rounded-xl border border-gray-800 text-center">
                            <Users className="size-8 mx-auto text-yellow-500 mb-2" />
                            <p className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Active Users</p>
                        </div>
                        <div className="bg-black p-4 rounded-xl border border-gray-800 text-center">
                            <Trash2 className="size-8 mx-auto text-red-500 mb-2" />
                            <p className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Items Collected</p>
                        </div>
                        <div className="col-span-2 bg-gradient-to-r from-green-900/20 to-blue-900/20 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Total CO₂ Offset</p>
                                <p className="text-3xl font-bold text-white">{stats.totalCO2.toFixed(1)} <span className="text-sm font-normal text-gray-400">kg</span></p>
                            </div>
                            <div className="size-12 bg-green-500/10 rounded-full flex items-center justify-center">
                                <TreeDeciduous className="text-green-500 size-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
