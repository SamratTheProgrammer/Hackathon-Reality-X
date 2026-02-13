import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    // Define all possible links
    const allLinks = [
        { name: "Home", href: "/", public: true },
        { name: "Dashboard", href: "/dashboard", public: false },
        { name: "Locate", href: "/locate", public: false },
        { name: "Scan QR", href: "/scan", public: false },
        { name: "Redeem", href: "/redeem", public: false },
    ];

    // Filter links based on auth state
    const links = allLinks.filter(link => link.public || isAuthenticated);

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
        } else {
            navigate('/login');
        }
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <Link to='/' className="flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" width={127} height={32} />
            </Link>

            {/* Desktop Navigation */}
            <ul className="max-md:hidden flex items-center gap-8">
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

            <div className="max-md:hidden flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        {isAdmin ? (
                            // Admin Custom Interface
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
                            // Clerk User Interface
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
                    <button
                        onClick={handleGetStarted}
                        className="bg-primary hover:bg-green-400 transition duration-300 text-black px-6 py-2.5 rounded-lg font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                        Get Started
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
            </button>

            {/* Mobile Menu Overlay */}
            <div className={`flex flex-col items-center justify-center gap-6 text-lg fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
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
                            // Clerk UserButton in Mobile Menu (might need customization or placement)
                            // Usually UserButton is small, so maybe just show it or a custom sign out
                            <div className="scale-150">
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{ baseTheme: dark }}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => { handleGetStarted(); setIsOpen(false); }}
                        className="bg-primary text-black px-8 py-3 rounded-xl font-bold text-xl mt-4"
                    >
                        Get Started
                    </button>
                )}
            </div>
        </div>
    );
};