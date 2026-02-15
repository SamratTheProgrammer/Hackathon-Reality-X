import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Plus, Edit, X, Trash2 } from "lucide-react";

export const AdminRewards = () => {
    const { rewards, setRewards, backendUrl } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        cost: "",
        description: "",
        image: "gift.png",
        isActive: true
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${backendUrl}/api/admin/rewards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: formData.id || undefined,
                    name: formData.name,
                    cost: parseInt(formData.cost) || 0,
                    description: formData.description,
                    image: formData.image,
                    isActive: formData.isActive
                })
            });
            const data = await res.json();
            if (data.success) {
                // Refresh rewards
                const resRewards = await fetch(`${backendUrl}/api/admin/rewards`);
                const dataRewards = await resRewards.json();
                if (dataRewards.success) {
                    setRewards(dataRewards.data.map((r: any) => ({ ...r, id: r._id || r.id })));
                }
                setShowForm(false);
                setFormData({ id: "", name: "", cost: "", description: "", image: "gift.png", isActive: true });
            }
        } catch (error) {
            console.error("Failed to save reward:", error);
        }
    };

    const handleEdit = (reward: any) => {
        setFormData({
            id: reward.id,
            name: reward.name,
            cost: reward.cost.toString(),
            description: reward.description,
            image: reward.image,
            isActive: reward.isActive !== false
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            const res = await fetch(`${backendUrl}/api/admin/rewards/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                // Refresh rewards
                const resRewards = await fetch(`${backendUrl}/api/admin/rewards`);
                const dataRewards = await resRewards.json();
                if (dataRewards.success) {
                    setRewards(dataRewards.data.map((r: any) => ({ ...r, id: r._id || r.id })));
                }
            }
        } catch (error) {
            console.error("Failed to delete reward:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Rewards Management</h1>
                <button
                    onClick={() => {
                        setFormData({ id: "", name: "", cost: "", description: "", image: "gift.png", isActive: true });
                        setShowForm(true);
                    }}
                    className="bg-primary text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90"
                >
                    <Plus className="size-5" /> Add Reward
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                    <div key={reward.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 relative group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(reward)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                                <Edit className="size-4 text-white" />
                            </button>
                            <button onClick={() => handleDelete(reward.id, reward.name)} className="p-2 bg-red-900/50 rounded-full hover:bg-red-900">
                                <Trash2 className="size-4 text-red-400" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="size-16 bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                                🎁
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{reward.name}</h3>
                                <p className="text-primary font-black">{reward.cost} pts</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">{reward.description}</p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{formData.id ? 'Edit Reward' : 'Add New Reward'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                                <X className="size-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Reward Name</label>
                                <input
                                    required
                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Cost (Points)</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none"
                                    value={formData.cost}
                                    onChange={e => setFormData({ ...formData, cost: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none h-24 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary/90 mt-4"
                            >
                                Save Reward
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
