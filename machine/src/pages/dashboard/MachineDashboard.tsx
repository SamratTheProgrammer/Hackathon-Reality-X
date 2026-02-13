import { useNavigate } from "react-router-dom";
import { useMachine } from "../../context/MachineContext";
import { Activity, Power, Settings, RotateCcw, MonitorPlay, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export const MachineDashboard = () => {
    const { machineData, isAuthenticated, isLoading, logout, capacity, currentTransaction, machineStatus } = useMachine();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/machine-login');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Machine Interface...</div>;
    }

    if (!machineData) return null;

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [logoutPassword, setLogoutPassword] = useState('');
    const [logoutError, setLogoutError] = useState('');

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
        setLogoutPassword('');
        setLogoutError('');
    };

    const confirmLogout = (e: React.FormEvent) => {
        e.preventDefault();
        if (logoutPassword === machineData.password) {
            logout();
            navigate('/machine-login');
        } else {
            setLogoutError('Incorrect machine password.');
        }
    };

    const handleKioskMode = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black p-6 lg:p-10 text-white relative">
            {/* Logout Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-sm w-full animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                                <LogOut className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Confirm Logout</h2>
                            <p className="text-gray-400 text-sm mt-2">Enter machine password to terminate session.</p>
                        </div>

                        <form onSubmit={confirmLogout} className="space-y-4">
                            <input
                                type="password"
                                autoFocus
                                value={logoutPassword}
                                onChange={(e) => setLogoutPassword(e.target.value)}
                                placeholder="Machine Password"
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors text-center font-mono"
                            />

                            {logoutError && (
                                <p className="text-red-500 text-sm text-center font-bold">{logoutError}</p>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 font-bold transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <MonitorPlay className="w-8 h-8 text-green-500" />
                        {machineData.name || machineData.machineId || machineData.id}
                    </h1>
                    <p className="text-gray-400 font-mono text-sm mt-1">ID: {machineData.machineId || machineData.id} • {machineData.location?.address || (typeof machineData.location === 'string' ? machineData.location : 'Unknown Location')}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-full border ${machineStatus === 'Available' ? 'border-green-500/50 bg-green-500/10 text-green-500' :
                        machineStatus === 'Full' ? 'border-red-500/50 bg-red-500/10 text-red-500' :
                            'border-yellow-500/50 bg-yellow-500/10 text-yellow-500'
                        } flex items-center gap-2`}>
                        <div className={`w-2 h-2 rounded-full ${machineStatus === 'Available' ? 'bg-green-500 animate-pulse' :
                            machineStatus === 'Full' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                        <span className="font-bold text-sm uppercase">{machineStatus}</span>
                    </div>

                    <button
                        onClick={handleLogoutClick}
                        className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-all flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Capacity Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-white">{capacity}%</span>
                    </div>
                    <h3 className="text-gray-400 font-medium mb-2">Storage Capacity</h3>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${capacity > 90 ? 'bg-red-500' : capacity > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}
                            style={{ width: `${capacity}%` }}
                        ></div>
                    </div>
                </div>

                {/* Today's Waste */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-500/20 rounded-xl text-green-500">
                            <RotateCcw className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-white">124</span>
                    </div>
                    <h3 className="text-gray-400 font-medium">Items Collected Today</h3>
                </div>

                {/* Status Control */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-500">
                            <Power className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-white font-bold text-sm">Online</span>
                        </div>
                    </div>
                    <h3 className="text-gray-400 font-medium">System Health</h3>
                </div>

                {/* Settings */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 cursor-not-allowed opacity-50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-700/50 rounded-xl text-gray-400">
                            <Settings className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-400 font-medium">Configuration</h3>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-900/50 to-gray-900 border border-green-500/30 rounded-3xl p-8 flex flex-col items-start justify-center text-left relative overflow-hidden group">
                    <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
                    <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Launch Kiosk Mode</h2>
                    <p className="text-gray-400 mb-6 max-w-sm relative z-10">Start the public-facing recycling interface. This will lock the screen to the innovative deposit flow.</p>
                    <button
                        onClick={handleKioskMode}
                        className="px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-black rounded-xl flex items-center gap-3 transition-all shadow-lg shadow-green-500/20 relative z-10"
                    >
                        <MonitorPlay className="w-6 h-6" /> Start Kiosk Session
                    </button>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                    {currentTransaction ? (
                        <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center font-bold">
                                    TX
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Active Transaction</h4>
                                    <p className="text-sm text-gray-400">{currentTransaction.id}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-bold uppercase">Pending</span>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-800 rounded-2xl">
                            No active transactions in realtime queue.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
