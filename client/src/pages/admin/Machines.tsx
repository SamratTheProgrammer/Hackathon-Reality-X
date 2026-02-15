import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { MapPin, Plus, CheckCircle, AlertTriangle, XCircle, Power, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const AdminMachines = () => {
    // Use machines from context which is now dynamic
    const { machines, setMachines, backendUrl } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState("All");
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

    const togglePassword = (id: string) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Let's implement a refresh helper here that updates context if needed
    // or just rely on context. For now, let's keep a manual refresh 
    // that updates the context state.
    console.log("AdminMachines: Context Machines:", machines);

    const refreshMachines = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/machine/all`);
            const data = await res.json();
            if (data.success) {
                const mappedMachines = data.data.map((m: any) => ({
                    id: m.machineId,
                    name: m.name,
                    location: m.location,
                    status: m.status,
                    capacity: m.capacity,
                    isActive: m.isActive,
                    lastActivity: new Date(m.lastActivity).toLocaleString(),
                    installDate: new Date(m.createdAt || Date.now()).toLocaleDateString(),
                    password: m.password
                }));
                setMachines(mappedMachines);
            }
        } catch (error) {
            console.error("Failed to fetch machines:", error);
        }
    };

    useEffect(() => {
        refreshMachines();
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        machineId: "",
        name: "",
        address: "",
        lat: "",
        lng: "",
        password: ""
    });

    const [editMode, setEditMode] = useState(false);

    const handleEdit = (machine: any) => {
        setFormData({
            machineId: machine.id,
            name: machine.name,
            address: machine.location.address,
            lat: machine.location.lat.toString(),
            lng: machine.location.lng.toString(),
            password: "" // Don't fill password
        });
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to PERMANENTLY delete this machine?")) return;
        try {
            await fetch(`${backendUrl}/api/admin/machine/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ machineId: id })
            });
            refreshMachines();
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = editMode
                ? `${backendUrl}/api/admin/machine/update-details`
                : `${backendUrl}/api/machine/register`;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    machineId: formData.machineId || undefined,
                    name: formData.name,
                    location: {
                        address: formData.address,
                        lat: parseFloat(formData.lat) || 0,
                        lng: parseFloat(formData.lng) || 0
                    },
                    password: formData.password || (editMode ? undefined : 'admin123')
                })
            });
            const data = await res.json();
            if (data.success) {
                refreshMachines();
                setShowForm(false);
                resetForm();
                toast.success(editMode ? "Machine details updated" : "Machine registered successfully");
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            console.error("Form Error:", error);
            toast.error("An error occurred");
        }
    };

    const resetForm = () => {
        setFormData({ machineId: "", name: "", address: "", lat: "", lng: "", password: "" });
        setEditMode(false);
    };

    const updateMachineStatus = async (id: string, status: string) => {
        try {
            await fetch(`${backendUrl}/api/machine/update-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ machineId: id, status, capacity: status === 'Available' ? 0 : undefined })
            });
            refreshMachines();
        } catch (error) {
            console.error("Update Error:", error);
        }
    };

    const approveMachine = async (id: string) => {
        try {
            const res = await fetch(`${backendUrl}/api/machine/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ machineId: id })
            });
            const data = await res.json();
            if (data.success) {
                refreshMachines();
                toast.success("Machine approved and activated");
            } else {
                toast.error("Failed to approve");
            }
        } catch (error) {
            console.error("Approval Error:", error);
        }
    };

    const toggleDeactivate = async (id: string, currentStatus: boolean | undefined) => {
        // Toggle isActive
        const newStatus = !currentStatus;
        try {
            const res = await fetch(`${backendUrl}/api/admin/machine/deactivate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ machineId: id, isActive: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                refreshMachines();
            }
        } catch (error) {
            console.error("Deactivation Error:", error);
        }
    };

    const filteredMachines = filter === "All"
        ? machines
        : filter === "Pending"
            ? machines.filter(m => !m.isActive)
            : machines.filter(m => m.isActive && m.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Machine Registry</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-primary text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90"
                >
                    <Plus className="size-5" /> Register Machine
                </button>
            </div>

            {/* Stats/Filter Bar */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {['All', 'Available', 'Full', 'Maintenance', 'Pending'].map((status) => (
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
                    <div key={machine.id} className={`bg-gray-900 border ${!machine.isActive ? 'border-yellow-500/30' : 'border-gray-800'} rounded-xl p-5 hover:border-gray-700 transition-colors`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{machine.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-gray-500 font-mono">ID: {machine.id}</p>
                                    <div className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded text-xs">
                                        <span className="text-gray-400 font-mono">
                                            {visiblePasswords[machine.id] ? machine.password : '••••••••'}
                                        </span>
                                        <button
                                            onClick={() => togglePassword(machine.id)}
                                            className="ml-1 text-gray-500 hover:text-white"
                                            title={visiblePasswords[machine.id] ? "Hide Secret" : "Show Secret"}
                                        >
                                            {visiblePasswords[machine.id] ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {!machine.isActive ? (
                                <span className="px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-yellow-500/10 text-yellow-500">
                                    Pending
                                </span>
                            ) : (
                                <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${machine.status === 'Available' ? 'bg-green-500/10 text-green-500' :
                                    machine.status === 'Full' ? 'bg-red-500/10 text-red-500' :
                                        'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {machine.status === 'Available' && <CheckCircle className="size-3" />}
                                    {machine.status === 'Full' && <XCircle className="size-3" />}
                                    {machine.status === 'Maintenance' && <AlertTriangle className="size-3" />}
                                    {machine.status}
                                </span>
                            )}
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
                        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col gap-2">
                            <div className="flex gap-2">
                                {!machine.isActive ? (
                                    <button
                                        onClick={() => approveMachine(machine.id)}
                                        className="w-full py-2 bg-yellow-500 text-black hover:bg-yellow-400 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        Approve & Activate
                                    </button>
                                ) : (
                                    <>
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
                                        <button
                                            onClick={() => toggleDeactivate(machine.id, machine.isActive)}
                                            className="px-3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-lg"
                                            title={machine.isActive ? "Deactivate" : "Activate"}
                                        >
                                            <Power className="size-4" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* CRUD Actions */}
                            <div className="flex gap-2 justify-end pt-2 border-t border-gray-800/50">
                                <button className="text-sm text-gray-500 hover:text-white underline" onClick={() => handleEdit(machine)}>
                                    Edit Details
                                </button>
                                <button className="text-sm text-red-500/70 hover:text-red-500 underline" onClick={() => handleDelete(machine.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Registration/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Machine Details' : 'Register New Machine'}</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {editMode && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Machine ID (Read Only)</label>
                                    <input
                                        className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none text-white opacity-50 cursor-not-allowed"
                                        value={formData.machineId}
                                        readOnly
                                    />
                                </div>
                            )}
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
                                <label className="block text-sm text-gray-400 mb-1">Passcode {editMode && '(Leave blank to keep unchanged)'}</label>
                                <input
                                    required={!editMode}
                                    type="password"
                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 focus:border-primary outline-none text-white"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Set a secret key"
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
                                    {editMode ? 'Update Machine' : 'Register Machine'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
