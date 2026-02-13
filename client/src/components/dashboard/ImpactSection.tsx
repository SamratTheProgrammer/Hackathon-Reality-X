import { TreeDeciduous, Users, Trash2 } from "lucide-react";

export const ImpactSection = () => {
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
                                <span className="font-bold">45 kg / 100 kg</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Plastic Bottles Saved</span>
                                <span className="font-bold">120 / 500 bottles</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2.5">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "24%" }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Segregation Accuracy</span>
                                <span className="font-bold">92%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2.5">
                                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "92%" }}></div>
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
                            <p className="text-2xl font-bold">12,540</p>
                            <p className="text-xs text-gray-400">Active Users</p>
                        </div>
                        <div className="bg-black p-4 rounded-xl border border-gray-800 text-center">
                            <Trash2 className="size-8 mx-auto text-red-500 mb-2" />
                            <p className="text-2xl font-bold">8.5 Tons</p>
                            <p className="text-xs text-gray-400">Waste Collected</p>
                        </div>
                        <div className="col-span-2 bg-gradient-to-r from-green-900/20 to-blue-900/20 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Total CO₂ Offset</p>
                                <p className="text-3xl font-bold text-white">1,240 <span className="text-sm font-normal text-gray-400">tons</span></p>
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
