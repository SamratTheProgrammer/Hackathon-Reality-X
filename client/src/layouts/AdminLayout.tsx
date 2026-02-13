import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Trash2, BarChart, LogOut, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";

export const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useApp();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    const menu = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { name: "Machines", icon: Zap, path: "/admin/machines" },
        { name: "Waste Rules", icon: Trash2, path: "/admin/waste-rules" },
        { name: "Analytics", icon: BarChart, path: "/admin/analytics" },
    ];

    return (
        <div className="flex min-h-screen bg-black text-white font-urbanist">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 bg-gray-900/50 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        Reality-X Admin
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menu.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-primary/20 text-primary font-bold"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <item.icon className="size-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                    >
                        <LogOut className="size-5" />
                        Exit Admin
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md">
                    <h1 className="font-bold text-lg">
                        {menu.find(m => m.path === location.pathname)?.name || "Admin Portal"}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="size-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                            AD
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
