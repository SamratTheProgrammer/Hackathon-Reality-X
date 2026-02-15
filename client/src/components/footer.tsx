export const Footer = () => {
    return (
        <>
            <footer className="px-6 md:px-16 lg:px-24 xl:px-32 border-t border-gray-800">
                <div className="border-x p-8 md:p-14 border-gray-800 grid gap-12 md:grid-cols-2">
                    <div>
                        <img
                            src="/logo-mark.svg"
                            alt="Logo Mark"
                            width={30}
                            height={30}
                        />
                        <p className="mt-6 text-sm/7 max-w-sm text-gray-500">
                            Empowering communities to recycle smarter, earn rewards, and build a sustainable future together.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-urbanist text-lg/8 font-semibold">
                                Features
                            </h4>
                            <ul className="mt-3">
                                <li className="text-sm/7 text-gray-500">
                                    <a href="/dashboard" className="hover:underline">
                                        Dashboard
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="/scan" className="hover:underline">
                                        Scan Waste
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="/redeem" className="hover:underline">
                                        Redeem Rewards
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="/locate" className="hover:underline">
                                        Locate Machines
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="/community" className="hover:underline">
                                        Community
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-urbanist text-lg/8 font-semibold">
                                Company
                            </h4>
                            <ul className="mt-3">
                                <li className="text-sm/7 text-gray-500">
                                    <a href="/#testimonials" className="hover:underline">
                                        About Us
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="https://www.instagram.com/__itzsamrat__/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        Contact
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="/login" className="hover:underline">
                                        Login
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="/signup" className="hover:underline">
                                        Sign Up
                                    </a>
                                </li>
                                <li className="text-sm/7 text-gray-500">
                                    <a href="/admin-login" className="hover:underline text-primary/80 hover:text-primary">
                                        Admin Login
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
            <div className="border-t border-gray-800">
                <p className="text-gray-500 py-6 text-center">
                    Copyright {new Date().getFullYear()} &copy; Smart Waste Systems.
                    All Right Reserved.
                </p>
            </div>
        </>
    );
};