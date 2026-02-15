import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { UserButton, SignInButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    // Define all possible links
    const navLinks = [
        { name: "Home", href: "/", public: true },
        { name: "Locate", href: "/locate", public: true },
        { name: "Scan", href: "/scan", public: true },
        { name: "Redeem", href: "/redeem", public: true },
        { name: "Dashboard", href: "/dashboard", public: false },
    ];

    const isAdmin = user?.role === 'admin';

    // Filter links based on auth state and role
    const links = navLinks.filter(link => {
        // Public links are always shown (unless we want to hide them for admin? keeping them for now)
        if (link.public) return true;

        // Private links
        if (!isAuthenticated) return false;

        // If Admin, hide specific user links (Dashboard is ambiguous, but usually User Dashboard)
        // Let's hide 'Dashboard' from main nav if Admin, because Admin has their own Dashboard link
        if (isAdmin && (link.name === 'Dashboard' || link.name === 'Scan' || link.name === 'Redeem')) return false;

        return true;
    });

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };



    return (
        <>
            <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <Link to='/' className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" width={127} height={32} />
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.href}
                                className={`hover:opacity-70 py-1 font-medium transition-colors ${location.pathname === link.href ? "text-primary" : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            {isAdmin ? (
                                <>
                                    <span className="text-sm text-gray-400">Admin</span>
                                    <Link to="/admin" className="text-primary hover:text-green-400 font-bold text-sm">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 hover:text-red-400 font-medium text-sm border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-400 hidden lg:block">Hi, {user?.name?.split(' ')[0]}</span>
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            baseTheme: dark,
                                            elements: {
                                                avatarBox: "w-10 h-10 border border-gray-700"
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                            <button className="bg-primary hover:bg-green-400 transition duration-300 text-black px-6 py-2.5 rounded-lg font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                Get Started
                            </button>
                        </SignInButton>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white cursor-pointer relative z-50" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            <div className={`flex flex-col items-center justify-center gap-6 text-lg fixed inset-0 z-40 bg-black backdrop-blur-xl transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                {links.map((link) => (
                    <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-2xl font-bold ${location.pathname === link.href ? "text-primary" : "text-gray-300 hover:text-white"
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}

                {isAuthenticated ? (
                    <div className="flex flex-col items-center gap-6 mt-4">
                        {isAdmin ? (
                            <>
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="text-primary font-bold text-xl"
                                >
                                    Admin Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 font-medium text-xl"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="scale-150">
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{ baseTheme: dark }}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                        <button className="bg-primary text-black px-8 py-3 rounded-xl font-bold text-xl mt-4">
                            Get Started
                        </button>
                    </SignInButton>
                )}
            </div>
        </>
    );
};