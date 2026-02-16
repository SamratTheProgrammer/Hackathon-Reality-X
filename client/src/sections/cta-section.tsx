import { Link } from "react-router-dom";

export const CtaSection = () => {
    return (
        <div className="mt-30 border-t border-gray-800 pb-30">
            <div className="pb-20 grid grid-cols-1 md:grid-cols-2 border-b border-gray-800 p-6 md:p-20">
                <h3 className="font-urbanist text-4xl/12 max-md:text-center font-bold max-w-lg bg-linear-to-r from-white to-white/50 bg-clip-text text-transparent">
                    Ready to make the planet cleaner? Start today.
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 max-md:mt-10 md:pr-20 w-full md:w-auto">
                    <Link to="/how-it-works" className="w-full sm:w-auto text-center bg-transparent border border-white/20 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-white/10 transition-colors">
                        How It Works
                    </Link>
                    <Link to="/locate" className="w-full sm:w-auto text-center bg-primary hover:bg-secondary transition duration-300 text-black px-6 py-2.5 rounded-lg font-bold">
                        Locate Smart Bin
                    </Link>
                </div>
            </div>
        </div>
    );
};