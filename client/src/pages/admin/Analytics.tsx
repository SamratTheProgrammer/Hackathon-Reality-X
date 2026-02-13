import { TrendingUp, Users, Trash } from "lucide-react";

export const AdminAnalytics = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Analytics & Reports</h1>

            {/* Simulated Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="text-gray-400 mb-2 flex items-center gap-2"><Trash className="size-4" /> Total Waste Collected</div>
                    <div className="text-3xl font-bold">12,450 <span className="text-sm text-gray-500 font-normal">items</span></div>
                    <div className="text-xs text-green-500 mt-2 flex items-center"> <TrendingUp className="size-3 mr-1" /> +12% this week</div>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="text-gray-400 mb-2 flex items-center gap-2"><Users className="size-4" /> Active Users</div>
                    <div className="text-3xl font-bold">8,203</div>
                    <div className="text-xs text-green-500 mt-2 flex items-center"> <TrendingUp className="size-3 mr-1" /> +5% this week</div>
                </div>
                {/* More cards... */}
            </div>

            {/* Simulated Charts (HTML/CSS bars for dependency-free viz) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="font-bold mb-6">Waste Type Distribution</h3>
                    <div className="space-y-4">
                        {[
                            { label: "PET Bottles", val: 65, color: "bg-blue-500" },
                            { label: "Aluminum Cans", val: 20, color: "bg-gray-400" },
                            { label: "Glass", val: 10, color: "bg-green-500" },
                            { label: "E-Waste", val: 5, color: "bg-purple-500" },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{item.label}</span>
                                    <span>{item.val}%</span>
                                </div>
                                <div className="w-full bg-black h-3 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="font-bold mb-6">Weekly Collection</h3>
                    <div className="flex items-end justify-between h-48 gap-2">
                        {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="w-full bg-primary/20 rounded-t-lg relative group hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {h * 10} items
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
