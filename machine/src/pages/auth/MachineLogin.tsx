import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMachine } from "../../context/MachineContext";
import { Lock, Server, ArrowRight, Shield, Zap } from "lucide-react";

export const MachineLogin = () => {
    const { login } = useMachine();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        machineId: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(formData.machineId, formData.password);
            if (success) {
                navigate('/machine-dashboard');
            } else {
                setError("Invalid Machine ID or Secret Key");
            }
        } catch (err) {
            setError("Login failed. Please check connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row">
            {/* Left Side - Info */}
            <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center bg-gray-900 border-r border-gray-800">
                <div className="mb-10">
                    <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
                        Machine<br />Access Control
                    </h1>
                    <p className="text-xl text-gray-400 max-w-md">
                        Secure login for Smart Waste Vending Machines. Authenticate to manage capacity and transactions.
                    </p>
                </div>

                <div className="space-y-6">
                    {[
                        { icon: Server, title: "Node Management", desc: "Monitor status and capacity in real-time." },
                        { icon: Shield, title: "Secure Protocol", desc: "End-to-end encrypted communication." },
                        { icon: Zap, title: "Instant Sync", desc: "Live transaction processing." }
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
            <div className="lg:w-1/2 p-6 lg:p-20 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/icon1.png" alt="EcoLoop" className="w-12 h-auto" />
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">EcoLoop Machine</h1>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Machine Login</h2>
                        <p className="text-gray-400">Enter credentials to unlock kiosk mode.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Machine ID</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="machineId"
                                    value={formData.machineId}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 pl-12 text-white focus:border-green-500 focus:outline-none transition-colors"
                                    placeholder="e.g. M-1024"
                                />
                                <Server className="w-5 h-5 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Secret Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 pl-12 text-white focus:border-green-500 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                                <Lock className="w-5 h-5 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Authenticating...' : (
                                <>
                                    Access Dashboard <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <div className="text-center pt-4">
                            <p className="text-gray-500 text-sm">
                                New deployment? <Link to="/machine-signup" className="text-white hover:text-green-500 font-bold transition-colors">Register Machine</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
