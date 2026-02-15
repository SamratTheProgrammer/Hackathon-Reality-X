import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";

export const AdminDashboard = () => {
    // const { machines } = useApp(); // AppContext machines might be just for user view or empty
    const { backendUrl } = useApp();
    const [stats, setStats] = useState({
        totalMachines: 0,
        totalTransactions: 0,
        activeUsers: 0,
        weeklyData: { labels: [] as string[], data: [] as number[] }
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Fetch Community Stats (Users, Items)
                const resCommunity = await fetch(`${backendUrl}/api/user/community-stats`);
                const dataCommunity = await resCommunity.json();

                // 2. Fetch Machines count
                const resMachines = await fetch(`${backendUrl}/api/machine/all`); // Assuming this exists from previous step
                const dataMachines = await resMachines.json();

                if (dataCommunity.success) {
                    setStats(prev => ({
                        ...prev,
                        totalTransactions: dataCommunity.data.totalItems, // Or items
                        activeUsers: dataCommunity.data.activeUsers
                    }));
                }

                if (dataMachines.success) {
                    setStats(prev => ({
                        ...prev,
                        totalMachines: dataMachines.data.length
                    }));
                }

                // 3. Fetch Weekly Activity
                const resWeekly = await fetch(`${backendUrl}/api/admin/stats/weekly-activity`);
                const dataWeekly = await resWeekly.json();

                if (dataWeekly.success) {
                    setStats(prev => ({
                        ...prev,
                        weeklyData: dataWeekly.data
                    }));
                }

            } catch (error) {
                console.error("Admin Dashboard Fetch Error:", error);
            }
        };

        fetchStats();
    }, [backendUrl]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm">Total Machines</h3>
                    <p className="text-3xl font-bold mt-2">{stats.totalMachines}</p>
                </div>
                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm">Total Items Recycled</h3>
                    <p className="text-3xl font-bold mt-2">{stats.totalTransactions}</p>
                </div>
                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm">Active Users</h3>
                    <p className="text-3xl font-bold mt-2 text-blue-500">{stats.activeUsers}</p>
                </div>
            </div>

            {/* Weekly Activity Graph */}
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-6">Weekly Collection Activity</h3>
                <div className="flex items-end justify-between h-64 gap-2 md:gap-4">
                    {stats.weeklyData.labels.length > 0 ? (
                        stats.weeklyData.labels.map((label, index) => {
                            const value = stats.weeklyData.data[index];
                            const maxVal = Math.max(...stats.weeklyData.data, 10); // Avoid div by zero
                            const height = (value / maxVal) * 100;

                            return (
                                <div key={label} className="flex flex-col items-center gap-2 flex-1 group">
                                    <div className="w-full bg-gray-800 rounded-t-lg relative overflow-hidden h-full flex items-end">
                                        <div
                                            className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-500 rounded-t-lg"
                                            style={{ height: `${height}%` }}
                                        >
                                            {/* Tooltip */}
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

            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                <h3 className="text-gray-400 text-sm">System Status</h3>
                <p className="text-3xl font-bold mt-2 text-green-500">Healthy</p>
                <p className="text-xs text-gray-500 mt-1">All services operational</p>
            </div>
        </div>
    );
};
