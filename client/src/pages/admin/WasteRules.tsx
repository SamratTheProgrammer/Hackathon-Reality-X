import { useApp } from "../../context/AppContext";
import { Save, Plus, Trash2, X, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";

// Define WasteType interface locally if not available globally, or extend it
interface WasteTypeWithId {
    _id?: string;
    id: string;
    name: string;
    pointsPerUnit: number;
    unit: string;
    color: string;
    icon: string;
}

export const AdminWasteRules = () => {
    const { wasteTypes, setWasteTypes, backendUrl } = useApp();
    const [localTypes, setLocalTypes] = useState<WasteTypeWithId[]>(wasteTypes as any);
    const [hasChanges, setHasChanges] = useState(false);

    // Modal State
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        pointsPerUnit: 10,
        unit: 'item',
        color: 'bg-gray-500',
        icon: 'Recycle'
    });

    useEffect(() => {
        setLocalTypes(wasteTypes);
    }, [wasteTypes]);

    const handlePointChange = (id: string, val: string) => {
        if (!id) return; // Guard against undefined IDs
        const points = parseInt(val) || 0;
        setLocalTypes(prev => prev.map(t => {
            // Use _id for reliable matching
            if (t._id === id || (t as any).id === id) {
                return { ...t, pointsPerUnit: points };
            }
            return t;
        }));
        setHasChanges(true);
    };

    const handleSavePoints = async () => {
        // Only save items that have changed
        const updates = localTypes.filter(local => {
            const original = wasteTypes.find((w: any) => w._id === local._id);
            return original && original.pointsPerUnit !== local.pointsPerUnit;
        });

        if (updates.length === 0) {
            setHasChanges(false);
            return;
        }

        try {
            await Promise.all(updates.map(type =>
                fetch(`${backendUrl}/api/admin/waste-types`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...type, id: type._id })
                })
            ));
            refreshData(); // This will exist in scope
            toast.success(`Updated ${updates.length} waste type(s) successfully!`);
        } catch (error) {
            console.error("Save failed:", error);
            toast.error("Failed to save changes");
        }
    };

    const refreshData = async () => {
        const res = await fetch(`${backendUrl}/api/admin/waste-types`);
        const data = await res.json();
        if (data.success) {
            setWasteTypes(data.data);
            setHasChanges(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this waste type?")) return;
        try {
            const res = await fetch(`${backendUrl}/api/admin/waste-types/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }) // Ensure ID is sent correctly
            });
            if (res.ok) {
                // Remove locally to reflect instantly
                setLocalTypes(prev => prev.filter(t => (t as any)._id !== id));
                setWasteTypes(prev => prev.filter(t => (t as any)._id !== id));
                toast.success("Waste type deleted successfully");
            } else {
                console.error("Delete failed");
                toast.error("Failed to delete waste type");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`${backendUrl}/api/admin/waste-types`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editMode ? formData.id : undefined,
                    name: formData.name,
                    pointsPerUnit: formData.pointsPerUnit,
                    unit: formData.unit,
                    color: formData.color,
                    icon: formData.icon
                })
            });
            refreshData();
            setShowForm(false);
            resetForm();
            toast.success(editMode ? "Waste type updated successfully" : "Waste type created successfully");
        } catch (error) {
            console.error(error);
            toast.error("Operation failed");
        }
    };

    const resetForm = () => {
        setFormData({ id: '', name: '', pointsPerUnit: 10, unit: 'item', color: 'bg-gray-500', icon: 'Recycle' });
        setEditMode(false);
    };

    const openEdit = (type: any) => {
        setFormData({
            id: type._id || type.id, // Map _id to id for the form
            name: type.name,
            pointsPerUnit: type.pointsPerUnit,
            unit: type.unit,
            color: type.color,
            icon: type.icon || 'Recycle'
        });
        setEditMode(true);
        setShowForm(true);
    };

    const PRESET_OPTIONS = [
        { emoji: "🧴", name: "Plastic Bottle" },
        { emoji: "🥫", name: "Aluminum Can" },
        { emoji: "🍾", name: "Glass Bottle" },
        { emoji: "📄", name: "Paper" },
        { emoji: "📦", name: "Cardboard" },
        { emoji: "🔋", name: "E-Waste" },
        { emoji: "🍏", name: "Organic" },
        { emoji: "🥡", name: "Tetra Pak" },
        { emoji: "👕", name: "Textiles" },
        { emoji: "🔩", name: "Metal Scrap" },
        { emoji: "🥤", name: "Plastic Cup" },
        { emoji: "🛍️", name: "Plastic Bag" },
        { emoji: "💿", name: "CD/DVD" },
        { emoji: "💊", name: "Medical Waste" },
        { emoji: "💡", name: "Light Bulb" },
        { emoji: "🍕", name: "Food Waste" },
        { emoji: "🪵", name: "Wood" },
        { emoji: "🚲", name: "Scrap Metal" },
        { emoji: "📱", name: "Electronics" },
        { emoji: "♻️", name: "Other Recyclable" }
    ];

    const COLOR_OPTIONS = [
        "bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500",
        "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500",
        "bg-teal-500", "bg-cyan-500", "bg-lime-500", "bg-emerald-500",
        "bg-violet-500", "bg-fuchsia-500", "bg-rose-500"
    ];

    const handlePresetSelect = (preset: { emoji: string, name: string }) => {
        const randomColor = COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)];
        setFormData({ ...formData, icon: preset.emoji, name: preset.name, color: randomColor });
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" theme="dark" />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Waste & Points Configuration</h1>
                <div className="flex gap-3">
                    {hasChanges && (
                        <button
                            onClick={handleSavePoints}
                            className="bg-green-500 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse"
                        >
                            <Save className="size-5" /> Save Points
                        </button>
                    )}
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="bg-primary text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90"
                    >
                        <Plus className="size-5" /> Add New Type
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">Waste Type</th>
                            <th className="p-4">Unit</th>
                            <th className="p-4">Points</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {localTypes.length > 0 ? localTypes.map((type) => (
                            <tr key={type._id || type.id} className="hover:bg-gray-800/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-8 rounded-full ${type.color || 'bg-gray-500'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                            {type.icon || type.name.charAt(0)}
                                        </div>
                                        <span className="font-bold">{type.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-400">per {type.unit}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="w-20 bg-black border border-gray-700 rounded px-2 py-1 text-center font-bold focus:border-primary outline-none"
                                            value={localTypes.find(t => (t as any)._id === (type as any)._id)?.pointsPerUnit || type.pointsPerUnit}
                                            onChange={(e) => handlePointChange(type._id as string, e.target.value)}
                                        />
                                        <span className="text-sm text-yellow-500">pts</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => openEdit(type)} className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg mr-2">
                                        <Edit className="size-4" />
                                    </button>
                                    <button onClick={() => handleDelete(type._id as string)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg">
                                        <Trash2 className="size-4" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No waste types configured.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editMode ? 'Edit Waste Type' : 'Add New Waste Type'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                                <X className="size-6" />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="space-y-4">

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">1. Select Type (Emoji)</label>
                                <div className="grid grid-cols-5 gap-2 mb-2 max-h-40 overflow-y-auto p-1">
                                    {PRESET_OPTIONS.map(preset => (
                                        <button
                                            key={preset.emoji}
                                            type="button"
                                            onClick={() => handlePresetSelect(preset)}
                                            className={`aspect-square flex flex-col items-center justify-center rounded-lg hover:bg-gray-800 transition-colors ${formData.icon === preset.emoji ? 'bg-gray-800 ring-2 ring-primary' : ''}`}
                                            title={preset.name}
                                        >
                                            <span className="text-2xl mb-1">{preset.emoji}</span>
                                            <span className="text-[10px] text-gray-500 truncate w-full text-center px-1 leading-tight">{preset.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">2. Name</label>
                                <input required className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Plastic Bottle" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Points</label>
                                    <input type="number" required className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none"
                                        value={formData.pointsPerUnit} onChange={e => setFormData({ ...formData, pointsPerUnit: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Unit</label>
                                    <select className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none"
                                        value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value as any })}>
                                        <option value="item">per item</option>
                                        <option value="kg">per kg</option>
                                        <option value="g">per g</option>
                                    </select>
                                </div>
                            </div>

                            {/* Color Preview & Manual Override */}
                            <div className="flex items-center gap-3">
                                <div className={`size-10 rounded-lg shrink-0 ${formData.color} shadow-lg transition-colors border border-gray-700`}></div>
                                <div className="grow">
                                    <label className="block text-sm text-gray-400 mb-1">Color Class (Auto-filled)</label>
                                    <input className="w-full bg-black border border-gray-700 rounded-lg p-2 text-xs focus:border-primary outline-none text-gray-500"
                                        value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="bg-blue-500" />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary/90 mt-4">
                                {editMode ? 'Update Type' : 'Create Type'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
