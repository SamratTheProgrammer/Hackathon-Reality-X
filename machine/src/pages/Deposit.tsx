import { useState } from "react";
import { useMachine } from "../context/MachineContext";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, ArrowRight, X } from "lucide-react";

export const MachineDeposit = () => {
    const { wasteTypes, completeTransaction, capacity, machineStatus } = useMachine();
    const navigate = useNavigate();

    const [counts, setCounts] = useState<Record<string, number>>({});

    const updateCount = (id: string, delta: number) => {
        setCounts(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [id]: next };
        });
    };

    const totalPoints = wasteTypes.reduce((sum, type) => {
        return sum + (counts[type.id] || 0) * type.pointsPerUnit;
    }, 0);

    const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);

    const handleFinish = () => {
        if (totalItems === 0) return;

        const items = Object.entries(counts)
            .filter(([_, count]) => count > 0)
            .map(([id, count]) => {
                const type = wasteTypes.find(t => t.id === id)!;
                return {
                    wasteId: id,
                    count,
                    points: count * type.pointsPerUnit
                };
            });

        completeTransaction(items, totalPoints);
        navigate('/summary');
    };

    return (
        <div className="h-full flex flex-col p-6 max-w-7xl mx-auto w-full pt-24 relative">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex items-center gap-6">
                    <h1 className="text-4xl font-black">Deposit Items</h1>

                    {/* Capacity Indicator */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-3 flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Storage</p>
                            <p className={`text-xl font-bold ${capacity >= 90 ? 'text-red-500' : 'text-white'}`}>
                                {capacity}% {capacity >= 95 && '(FULL)'}
                            </p>
                        </div>
                        <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${capacity >= 90 ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${capacity}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-gray-400 text-sm">Session Total</p>
                    <p className="text-4xl font-bold text-green-500">{totalPoints} <span className="text-lg text-white">pts</span></p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pb-32 pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {wasteTypes.map((type) => {
                        const count = counts[type.id] || 0;
                        return (
                            <div key={type.id} className={`
                            relative border rounded-3xl p-6 flex flex-col items-center justify-between gap-4 transition-all select-none
                            ${count > 0 ? 'bg-gray-800 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'bg-gray-900/50 border-gray-800'}
                        `}>
                                <div className={`w-16 h-16 rounded-2xl ${type.color} bg-opacity-20 flex items-center justify-center text-2xl`}>
                                    {type.icon === 'Bottle' && '🍾'}
                                    {type.icon === 'Can' && '🥫'}
                                    {type.icon === 'Glass' && '🍷'}
                                    {type.icon === 'FileText' && '📄'}
                                    {type.icon === 'Cpu' && '🔌'}
                                </div>

                                <div className="text-center">
                                    <h3 className="font-bold text-xl">{type.name}</h3>
                                    <p className="text-green-500 font-mono text-sm">{type.pointsPerUnit} pts / {type.unit}</p>
                                </div>

                                <div className="flex items-center gap-4 w-full justify-center">
                                    <button
                                        onClick={() => updateCount(type.id, -1)}
                                        className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700 active:scale-90 transition-all disabled:opacity-30"
                                        disabled={count === 0}
                                    >
                                        <Minus className="w-6 h-6" />
                                    </button>
                                    <span className="text-3xl font-black w-12 text-center">{count}</span>
                                    <button
                                        onClick={() => updateCount(type.id, 1)}
                                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all"
                                    >
                                        <Plus className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="fixed bottom-0 left-0 w-full p-6 bg-black/80 backdrop-blur-xl border-t border-gray-800 flex justify-between items-center z-50">
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-4 rounded-2xl bg-gray-900 border border-gray-700 text-gray-400 font-bold flex items-center gap-3 hover:bg-gray-800"
                    >
                        <X className="w-6 h-6" /> Cancel
                    </button>
                    <button
                        onClick={handleFinish}
                        disabled={totalItems === 0 || machineStatus === 'Full'}
                        className="px-12 py-4 rounded-2xl bg-green-500 text-black font-black text-xl flex items-center gap-3 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all"
                    >
                        {machineStatus === 'Full' ? 'Bin Full' : 'Finish Deposit'} <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};
