import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { MapPin, Plus, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { Machine } from "../../context/AppContext";

export const AdminMachines = () => {
    const { machines, setMachines, updateMachineStatus } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState("All");

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        lat: "",
        lng: "",
        capacity: "0"
    });

    const handleAddMachine = (e: React.FormEvent) => {
        e.preventDefault();
        const newMachine: Machine = {
            id: `M${Date.now().toString().slice(-4)}`,
            name: formData.name,
            location: {
                address: formData.address,
                lat: parseFloat(formData.lat) || 0,
                lng: parseFloat(formData.lng) || 0
            },
            status: 'Available',
            capacity: parseInt(formData.capacity) || 0,
            lastActivity: 'Just now',
            installDate: new Date().toISOString().split('T')[0]
        };
        setMachines([...machines, newMachine]);
        setShowForm(false);
        setFormData({ name: "", address: "", lat: "", lng: "", capacity: "0" });
    };

    const filteredMachines = filter === "All"
        ? machines
        : machines.filter(m => m.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Machine Registry</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90"
                >
                    <Plus className="size-5" /> Register Machine
                </button>
            </div>

            {/* Stats/Filter Bar */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {['All', 'Available', 'Full', 'Maintenance'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${filter === status
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Machine List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMachines.map((machine) => (
                    <div key={machine.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{machine.name}</h3>
                                <p className="text-xs text-gray-500 font-mono">ID: {machine.id}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${machine.status === 'Available' ? 'bg-green-500/10 text-green-500' :
                                machine.status === 'Full' ? 'bg-red-500/10 text-red-500' :
                                    'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                {machine.status === 'Available' && <CheckCircle className="size-3" />}
                                {machine.status === 'Full' && <XCircle className="size-3" />}
                                {machine.status === 'Maintenance' && <AlertTriangle className="size-3" />}
                                {machine.status}
                            </span>
                        </div>

                        <div className="space-y-3 text-sm text-gray-400">
                            <div className="flex items-start gap-2">
                                <MapPin className="size-4 mt-0.5 shrink-0" />
                                {machine.location.address}
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Capacity:</span>
                                <span className={`font-bold ${machine.capacity > 90 ? 'text-red-500' : 'text-white'}`}>
                                    {machine.capacity}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${machine.capacity > 90 ? 'bg-red-500' : 'bg-primary'}`}
                                    style={{ width: `${machine.capacity}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 pt-2 border-t border-gray-800 flex justify-between">
                                <span>Last Active: {machine.lastActivity}</span>
                                <span>Installed: {machine.installDate}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-4 border-t border-gray-800 flex gap-2">
                            {machine.status !== 'Maintenance' && (
                                <button
                                    onClick={() => updateMachineStatus(machine.id, 'Maintenance')}
                                    className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-bold"
                                >
                                    Maintenance
                                </button>
                            )}
                            {machine.status === 'Maintenance' && (
                                <button
                                    onClick={() => updateMachineStatus(machine.id, 'Available')}
                                    className="flex-1 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-lg text-xs font-bold"
                                >
                                    Set Available
                                </button>
                            )}
                            {machine.status === 'Full' && (
                                <button
                                    onClick={() => updateMachineStatus(machine.id, 'Available')} // Simulating emptying
                                    className="flex-1 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 rounded-lg text-xs font-bold"
                                >
                                    Empty Bin
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Registration Modal (Simple Overlay) */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Register New Machine</h2>
                        <form onSubmit={handleAddMachine} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Machine Name</label>
                                <input
                                    required
                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Downtown Kiosk 2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Location Address</label>
                                <input
                                    required
                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none text-white"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Full street address"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Latitude</label>
                                    <input
                                        type="number" step="any"
                                        className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none text-white"
                                        value={formData.lat}
                                        onChange={e => setFormData({ ...formData, lat: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Longitude</label>
                                    <input
                                        type="number" step="any"
                                        className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none text-white"
                                        value={formData.lng}
                                        onChange={e => setFormData({ ...formData, lng: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Simulating Map Picker */}
                            <div className="bg-gray-800 h-32 rounded-lg flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:bg-gray-700 transition"
                                onClick={() => setFormData({ ...formData, lat: "19.0760", lng: "72.8777", address: "Pinned Location (Simulated)" })}
                            >
                                <MapPin className="size-4 mr-2" /> Click to Simulate Pin Drop
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 bg-gray-800 rounded-lg font-bold hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary/90"
                                >
                                    Register Machine
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
