import { useApp } from "../../context/AppContext";
import { Save } from "lucide-react";
import { useState } from "react";

export const AdminWasteRules = () => {
    const { wasteTypes, setWasteTypes } = useApp();
    const [hasChanges, setHasChanges] = useState(false);

    // Local state for editing before save
    const [localTypes, setLocalTypes] = useState(wasteTypes);

    const handlePointChange = (id: string, val: string) => {
        const points = parseInt(val) || 0;
        setLocalTypes(prev => prev.map(t => t.id === id ? { ...t, pointsPerUnit: points } : t));
        setHasChanges(true);
    };

    const handleSave = () => {
        setWasteTypes(localTypes);
        setHasChanges(false);
        // In real app, API call here
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Waste & Points Configuration</h1>
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse"
                    >
                        <Save className="size-5" /> Save Changes
                    </button>
                )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">Waste Type</th>
                            <th className="p-4">Unit</th>
                            <th className="p-4">Points</th>
                            <th className="p-4">Accepted</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {localTypes.map((type) => (
                            <tr key={type.id} className="hover:bg-gray-800/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-8 rounded-full ${type.color} flex items-center justify-center text-white font-bold text-xs`}>
                                            {type.name.charAt(0)}
                                        </div>
                                        <span className="font-bold">{type.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-400">per {type.unit}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            className="w-20 bg-black border border-gray-700 rounded px-2 py-1 text-center font-bold focus:border-primary outline-none"
                                            value={type.pointsPerUnit}
                                            onChange={(e) => handlePointChange(type.id, e.target.value)}
                                        />
                                        <span className="text-sm text-yellow-500">pts</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-xl text-sm text-blue-300">
                <span className="font-bold">Note:</span> Changing point values will only affect future transactions. Existing records remain unchanged.
            </div>
        </div>
    );
};
