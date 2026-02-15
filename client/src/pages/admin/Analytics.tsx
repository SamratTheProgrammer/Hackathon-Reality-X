import { useEffect, useState } from "react";
import { TrendingUp, Users, Trash } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminAnalytics = () => {
    const { backendUrl } = useApp();
    const [stats, setStats] = useState({
        activeUsers: 0,
        totalItems: 0,
        breakdown: { plastic: 0, glass: 0, cans: 0, ewaste: 0 },
        weeklyData: { labels: [] as string[], data: [] as number[] },
        wasteDistribution: [] as { label: string, val: number, count: number, color: string }[]
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Community Stats
                const res = await fetch(`${backendUrl}/api/user/community-stats`);
                const data = await res.json();

                // 2. Weekly Activity
                const resWeekly = await fetch(`${backendUrl}/api/admin/stats/weekly-activity`);
                const dataWeekly = await resWeekly.json();

                // 3. Waste Distribution
                const resDist = await fetch(`${backendUrl}/api/admin/stats/waste-distribution`);
                const dataDist = await resDist.json();

                if (data.success) {
                    setStats(prev => ({
                        ...prev,
                        ...data.data,
                        breakdown: data.data.breakdown || prev.breakdown
                    }));
                }

                if (dataWeekly.success) {
                    setStats(prev => ({
                        ...prev,
                        weeklyData: dataWeekly.data
                    }));
                }

                if (dataDist.success) {
                    setStats(prev => ({
                        ...prev,
                        wasteDistribution: dataDist.data
                    }));
                }

            } catch (error) {
                console.error("Failed to fetch analytics", error);
            }
        };
        fetchStats();
    }, [backendUrl]);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Analytics & Reports</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="text-gray-400 mb-2 flex items-center gap-2"><Trash className="size-4" /> Total Waste Collected</div>
                    <div className="text-3xl font-bold">{stats.totalItems.toLocaleString()} <span className="text-sm text-gray-500 font-normal">items</span></div>
                    <div className="text-xs text-green-500 mt-2 flex items-center"> <TrendingUp className="size-3 mr-1" /> +12% this week</div>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="text-gray-400 mb-2 flex items-center gap-2"><Users className="size-4" /> Active Users</div>
                    <div className="text-3xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                    <div className="text-xs text-green-500 mt-2 flex items-center"> <TrendingUp className="size-3 mr-1" /> +5% this week</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Waste Type Distribution */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="font-bold mb-6">Waste Type Distribution</h3>
                    <div className="space-y-4">
                        {stats.wasteDistribution.length > 0 ? (
                            stats.wasteDistribution.map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{item.label} ({item.count})</span>
                                        <span>{item.val}%</span>
                                    </div>
                                    <div className="w-full bg-black h-3 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-10">No distribution data available</div>
                        )}
                    </div>
                </div>

                {/* Weekly Collection Graph */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="font-bold mb-6">Weekly Collection Activity</h3>
                    <div className="flex items-end justify-between h-64 gap-2 md:gap-4">
                        {stats.weeklyData.labels.length > 0 ? (
                            stats.weeklyData.labels.map((label, index) => {
                                const value = stats.weeklyData.data[index];
                                const maxVal = Math.max(...stats.weeklyData.data, 10);
                                const height = (value / maxVal) * 100;

                                return (
                                    <div key={label} className="flex flex-col items-center gap-2 flex-1 group">
                                        <div className="w-full bg-gray-800 rounded-t-lg relative overflow-hidden h-full flex items-end">
                                            <div
                                                className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-500 rounded-t-lg"
                                                style={{ height: `${height}%` }}
                                            >
                                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold py-1 px-2 rounded pointer-events-none transition-opacity">
                                                    {value}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-gray-500 text-xs font-mono">{label}</span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                Loading graph data...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
