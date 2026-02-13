import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMachine } from "../../context/MachineContext";
import { Lock, Server, ArrowRight } from "lucide-react";

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
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-6">
                        <Server className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Machine Access</h1>
                    <p className="text-gray-400">Authenticate to manage this node.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
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
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-4 pl-12 text-white focus:border-green-500 focus:outline-none transition-colors"
                                placeholder="M-1024"
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
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-4 pl-12 text-white focus:border-green-500 focus:outline-none transition-colors"
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
                </form>

                <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-500 text-sm">
                        New deployment? <Link to="/machine-signup" className="text-white hover:text-green-500 font-bold transition-colors">Register Machine</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
