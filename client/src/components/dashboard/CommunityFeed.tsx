import { useEffect, useState } from "react";
import { Recycle, Trophy, Leaf, Users } from "lucide-react";

interface Activity {
    id: number;
    user: string;
    action: string;
    time: string;
    impact: string;
    icon: any;
}

export const CommunityFeed = () => {
    const [activities, setActivities] = useState<Activity[]>([
        { id: 1, user: "Alex M.", action: "recycled 5 plastic bottles", time: "Just now", impact: "+50 pts", icon: Recycle },
        { id: 2, user: "Sarah J.", action: "redeemed a coffee voucher", time: "2 mins ago", impact: "Reward", icon: Trophy },
        { id: 3, user: "Mike T.", action: "saved 0.5kg CO2", time: "5 mins ago", impact: "High Impact", icon: Leaf },
        { id: 4, user: "Community", action: "reached 10,000 items recycled!", time: "1 hour ago", impact: "Milestone", icon: Users },
    ]);

    useEffect(() => {
        const names = ["Emma W.", "David L.", "Sophie K.", "Ryan P.", "Olivia D."];
        const actions = [
            { text: "recycled 3 aluminum cans", impact: "+30 pts", icon: Recycle },
            { text: "recycled 10 glass bottles", impact: "+100 pts", icon: Recycle },
            { text: "redeemed a cinema ticket", impact: "Reward", icon: Trophy },
            { text: "completed a daily challenge", impact: "+150 pts", icon: Trophy },
        ];

        const interval = setInterval(() => {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];

            const newActivity = {
                id: Date.now(),
                user: randomName,
                action: randomAction.text,
                time: "Just now",
                impact: randomAction.impact,
                icon: randomAction.icon
            };

            setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
        }, 5000); // Add new activity every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-8 border-t border-gray-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="text-primary" />
                Community Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="bg-gray-900/30 border border-gray-800 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-800 rounded-full text-primary">
                                    <activity.icon className="size-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        <span className="text-white">{activity.user}</span> <span className="text-gray-400">{activity.action}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {activity.impact}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Community Stats / Info Side Panel */}
                <div className="bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-800 flex flex-col justify-center">
                    <h3 className="text-lg font-bold mb-2">Impact Together 🌍</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        See what your neighbors are achieving! Every item recycled contributes to a cleaner city.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-black/20 rounded-xl">
                            <div className="text-2xl font-bold text-green-400">12.5k</div>
                            <div className="text-xs text-gray-500">Total Items Today</div>
                        </div>
                        <div className="p-4 bg-black/20 rounded-xl">
                            <div className="text-2xl font-bold text-blue-400">842</div>
                            <div className="text-xs text-gray-500">Active Users</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
