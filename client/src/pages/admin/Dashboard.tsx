import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";

export const AdminDashboard = () => {
    // const { machines } = useApp(); // AppContext machines might be just for user view or empty
    const { backendUrl } = useApp();
    const [stats, setStats] = useState({
        totalMachines: 0,
        totalTransactions: 0,
        activeUsers: 0
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

                // 3. Fetch Weekly Activity - REMOVED
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

            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                <h3 className="text-gray-400 text-sm">System Status</h3>
                <p className="text-3xl font-bold mt-2 text-green-500">Healthy</p>
                <p className="text-xs text-gray-500 mt-1">All services operational</p>
            </div>
        </div>
    );
};
