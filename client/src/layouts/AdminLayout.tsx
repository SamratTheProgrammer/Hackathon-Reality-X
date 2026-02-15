import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Trash2, BarChart, LogOut, Zap, Users, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useApp();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    const menu = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { name: "Machines", icon: Zap, path: "/admin/machines" },
        { name: "Users", icon: Users, path: "/admin/users" },
        { name: "Waste Rules", icon: Trash2, path: "/admin/waste-rules" },
        { name: "Rewards", icon: Zap, path: "/admin/rewards" },
        { name: "Analytics", icon: BarChart, path: "/admin/analytics" },
    ];

    return (
        <div className="flex min-h-screen bg-black text-white font-urbanist">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 bg-black/90 md:bg-gray-900/50 border-r border-gray-800
                transform transition-all duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
                ${isCollapsed ? 'md:w-20' : 'md:w-64'}
                flex flex-col
            `}>
                <div className={`p-6 border-b border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {/* Logo Logic: Show full logo if mobile OR not collapsed. Show icon if desktop AND collapsed */}
                    {(isMobileOpen || !isCollapsed) && <img src="/logo-admin.png" alt="EcoLoop-Admin" className="h-8 w-auto" />}
                    {(!isMobileOpen && isCollapsed) && <img src="/icon0.svg" alt="EcoLoop" className="h-8 w-8" />}

                    {/* Mobile Close Button */}
                    <button className="md:hidden text-gray-400" onClick={() => setIsMobileOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-5 top-24 bg-gray-800 border border-gray-700 rounded-full p-1.5 text-gray-400 hover:text-white transition-colors z-50 hidden md:block" // Increased padding and size
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />} {/* Increased icon size */}
                </button>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    {menu.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileOpen(false)}
                                title={isCollapsed && !isMobileOpen ? item.name : ''}
                                className={`flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-primary/20 text-primary font-bold"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <item.icon className="size-5 shrink-0" />
                                {/* Show text if Mobile OR Not Collapsed */}
                                {(isMobileOpen || !isCollapsed) && <span className="whitespace-nowrap">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        title={isCollapsed && !isMobileOpen ? "Exit Admin" : ''}
                        className={`flex w-full items-center ${isCollapsed && !isMobileOpen ? 'justify-center' : 'gap-3'} px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left`}
                    >
                        <LogOut className="size-5 shrink-0" />
                        {(isMobileOpen || !isCollapsed) && <span className="whitespace-nowrap">Exit Admin</span>}
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-gray-400 hover:text-white"
                            onClick={() => setIsMobileOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2">
                            <img src="/logo-admin.png" alt="EcoLoop-Admin" className="h-8 w-auto" />
                        </div>
                    </div>

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
