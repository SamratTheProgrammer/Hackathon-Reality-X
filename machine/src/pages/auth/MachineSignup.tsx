import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMachine } from "../../context/MachineContext";
import { MapPin, Server, Shield, CheckCircle, ArrowRight, Loader2, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to update map view when coords change
const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
};

// Helper to handle map clicks
const LocationMarker = ({ setFormData }: { setFormData: any }) => {
    const map = useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            try {
                // Show loading state or temporary coords while fetching
                setFormData((prev: any) => ({
                    ...prev,
                    lat: lat.toString(),
                    lng: lng.toString(),
                    location: "Fetching address..."
                }));

                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const data = await res.json();

                setFormData((prev: any) => ({
                    ...prev,
                    location: data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
                }));
            } catch (error) {
                setFormData((prev: any) => ({
                    ...prev,
                    location: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
                }));
            }
            map.flyTo(e.latlng, map.getZoom());
        },
    });
    return null;
};

export const MachineSignup = () => {
    const { register } = useMachine();

    const [formData, setFormData] = useState({
        machineId: '',
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

    const [generatedId, setGeneratedId] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [searching, setSearching] = useState(false);

    const handleGetLocation = () => {
        setGettingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // Optional: Reverse geocode to get address from coords
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await res.json();
                        setFormData(prev => ({
                            ...prev,
                            lat: latitude.toString(),
                            lng: longitude.toString(),
                            location: data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
                        }));
                    } catch (e) {
                        setFormData(prev => ({
                            ...prev,
                            lat: latitude.toString(),
                            lng: longitude.toString(),
                            location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
                        }));
                    }
                    setGettingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    let msg = "Failed to get location.";
                    if (error.code === error.TIMEOUT) msg = "Location request timed out.";
                    else if (error.code === error.PERMISSION_DENIED) msg = "Location permission denied.";

                    setError(msg);
                    setGettingLocation(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setError("Geolocation not supported");
            setGettingLocation(false);
        }
    };

    const handleSearchLocation = async () => {
        if (!formData.location) return;
        setSearching(true);
        setError('');

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`);
            const data = await res.json();

            if (data && data.length > 0) {
                const first = data[0];
                setFormData(prev => ({
                    ...prev,
                    lat: first.lat,
                    lng: first.lon,
                    location: first.display_name // Update to full name
                }));
            } else {
                setError("Location not found. Try a different query.");
            }
        } catch (err) {
            setError("Failed to search location.");
        } finally {
            setSearching(false);
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
            const machine = await register({
                id: '', // Auto-gen
                name: formData.name,
                location: {
                    address: formData.location,
                    lat: parseFloat(formData.lat) || 0,
                    lng: parseFloat(formData.lng) || 0
                },
                password: formData.password,
                maxCapacity: formData.capacity,
            });
            if (machine) {
                setGeneratedId(machine.machineId);
                setSuccess(true);
            } else {
                setError("Registration failed. Please try again.");
            }
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
                <p className="text-xl text-gray-300 mb-6">Your Machine ID has been generated: <br /><span className="text-primary font-mono text-3xl font-bold">{generatedId}</span></p>

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
                        Register a new Smart Waste Vending Machine to the EcoLoop network.
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
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/icon1.png" alt="EcoLoop" className="w-12 h-auto" />
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">EcoLoop Machine</h1>
                        </div>
                        <p className="text-gray-400">Enter device details to initialize.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Machine ID Input REMOVED */}

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
                            <div className="flex gap-2 mb-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSearchLocation();
                                            }
                                        }}
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors pr-10"
                                        placeholder="Enter city or address..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearchLocation}
                                        disabled={searching || !formData.location}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white"
                                    >
                                        {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={gettingLocation}
                                    className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl border border-gray-700 transition-colors"
                                    title="User Current Location"
                                >
                                    {gettingLocation ? <Loader2 className="w-6 h-6 animate-spin" /> : <MapPin className="w-6 h-6" />}
                                </button>
                            </div>

                            {/* Interactive Map - Shows only when coords are present */}
                            {(formData.lat && formData.lng) && (
                                <div className="animate-in fade-in zoom-in duration-300">
                                    <div className="h-48 w-full rounded-xl overflow-hidden border border-gray-800 mb-2 relative z-0">
                                        <MapContainer
                                            center={[parseFloat(formData.lat), parseFloat(formData.lng)]}
                                            zoom={15}
                                            className="h-full w-full"
                                            style={{ height: '100%', width: '100%', background: '#111827' }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <ChangeView center={[parseFloat(formData.lat), parseFloat(formData.lng)]} />
                                            <Marker position={[parseFloat(formData.lat), parseFloat(formData.lng)]} />
                                            <LocationMarker setFormData={setFormData} />
                                        </MapContainer>
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mb-4">
                                        Confirming location: <span className="text-green-500">{formData.lat.substring(0, 7)}, {formData.lng.substring(0, 7)}</span>
                                        <br />Drag or click map to adjust.
                                    </p>
                                </div>
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
