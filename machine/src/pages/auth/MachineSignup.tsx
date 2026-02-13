import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMachine } from "../../context/MachineContext";
import { MapPin, Server, Shield, CheckCircle, ArrowRight, Loader2 } from "lucide-react";

export const MachineSignup = () => {
    const { register } = useMachine();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirmPassword: '',
        location: '',
        lat: '',
        lng: '',
        capacity: 1000
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGetLocation = () => {
        setGettingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        lat: position.coords.latitude.toString(),
                        lng: position.coords.longitude.toString(),
                        location: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
                    }));
                    setGettingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError("Failed to get location. Please enter manually.");
                    setGettingLocation(false);
                }
            );
        } else {
            setError("Geolocation not supported");
            setGettingLocation(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!formData.password || !formData.location) {
            setError("All fields are required");
            return;
        }

        try {
            await register({
                name: formData.name,
                location: {
                    address: formData.location,
                    lat: parseFloat(formData.lat) || 0,
                    lng: parseFloat(formData.lng) || 0
                },
                password: formData.password,
                maxCapacity: formData.capacity,
                // ID is auto-generated on backend
            });
            setSuccess(true);
        } catch (err) {
            setError("Registration failed. Please try again.");
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-yellow-500/20 p-6 rounded-full text-yellow-500 mb-6">
                    <CheckCircle className="w-20 h-20" />
                </div>
                <h1 className="text-4xl font-black text-white mb-4">Registration Successful!</h1>
                <p className="text-xl text-gray-300 mb-6">Your Machine ID has been generated.</p>

                <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl max-w-md w-full mb-6">
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-yellow-500 font-bold text-lg flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Pending Approval
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Please wait for an administrator to activate this machine before logging in.
                    </p>
                </div>

                <Link to="/machine-login" className="text-green-500 hover:text-green-400 underline">
                    Return to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row">
            {/* Left Side - Info */}
            <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center bg-gray-900 border-r border-gray-800">
                <div className="mb-10">
                    <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
                        Machine<br />Provisioning
                    </h1>
                    <p className="text-xl text-gray-400 max-w-md">
                        Register a new Smart Waste Vending Machine to the Reality-X network.
                    </p>
                </div>

                <div className="space-y-6">
                    {[
                        { icon: Server, title: "Auto Provisioning", desc: "Machine ID is automatically assigned." },
                        { icon: MapPin, title: "Geo-Location", desc: "Precise tracking for user discovery." },
                        { icon: Shield, title: "Admin Approval", desc: "Secure activation workflow." }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-800 bg-black/50">
                            <item.icon className="w-6 h-6 text-green-500 mt-1" />
                            <div>
                                <h3 className="font-bold text-white">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:w-1/2 p-6 lg:p-20 overflow-y-auto">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Register Machine</h2>
                        <p className="text-gray-400">Enter device details to initialize.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Machine ID</label>
                            <input
                                type="text"
                                value="Auto-generated (e.g. M-1024)"
                                disabled
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Device Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                                placeholder="e.g. Campus Node 1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Machine Secret (Password)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Confirm Secret</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Max Capacity (Items)</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Location Address</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                                    placeholder="Click button or enter address"
                                />
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={gettingLocation}
                                    className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl border border-gray-700 transition-colors"
                                    title="Get Current Location"
                                >
                                    {gettingLocation ? <Loader2 className="w-6 h-6 animate-spin" /> : <MapPin className="w-6 h-6" />}
                                </button>
                            </div>
                            {formData.lat && (
                                <p className="text-xs text-green-500 mt-1">
                                    Coords captured: {parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lng).toFixed(4)}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                    >
                        Register Machine <ArrowRight className="w-5 h-5" />
                    </button>

                    <div className="text-center pt-4">
                        <Link to="/machine-login" className="text-gray-500 hover:text-white transition-colors text-sm">
                            Already registered? Access Dashboard
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
