import { useEffect, useState } from "react";
import { Recycle, Users } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface Activity {
    _id: string;
    userName: string;
    totalPoints: number;
    timestamp: string;
    items: any[];
}

export const CommunityFeed = () => {
    const { backendUrl } = useApp();
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/user/activities`);
                const data = await res.json();
                if (data.success) {
                    setActivities(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch community activities", error);
            }
        };

        fetchActivities();
        const interval = setInterval(fetchActivities, 10000); // Refresh every 10s

        return () => clearInterval(interval);
    }, [backendUrl]);

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

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
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, [backendUrl]);

    return (
        <section className="py-8 border-t border-gray-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="text-primary" />
                Community Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {activities.length === 0 ? (
                        <p className="text-gray-500 italic">No recent activity. Be the first!</p>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity._id} className="bg-gray-900/30 border border-gray-800 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-800 rounded-full text-primary">
                                        <Recycle className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            <span className="text-white">{activity.userName || 'Anonymous'}</span> <span className="text-gray-400">recycled waste</span>
                                        </p>
                                        <p className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    +{activity.totalPoints} pts
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Community Stats / Info Side Panel */}
                <div className="bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-800 flex flex-col justify-center">
                    <h3 className="text-lg font-bold mb-2">Impact Together 🌍</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        See what your neighbors are achieving! Every item recycled contributes to a cleaner city.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-black/20 rounded-xl">
                            <div className="text-2xl font-bold text-green-400">{stats.totalItems.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Total Items Recycled</div>
                        </div>
                        <div className="p-4 bg-black/20 rounded-xl">
                            <div className="text-2xl font-bold text-blue-400">{stats.activeUsers.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Active Users</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
