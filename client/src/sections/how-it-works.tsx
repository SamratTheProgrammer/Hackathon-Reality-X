import { SectionTitle } from "../components/section-title";
import { Link } from "react-router-dom";

const steps = [
    {
        title: "Locate",
        description: "Find the nearest smart bin via app.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: "Scan QR",
        description: "Scan the machine's QR code.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H10V10H3V3Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 3H21V10H14V3Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 14H21V21H14V14Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 14H10V21H3V14Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: "Deposit",
        description: "Deposit your waste item.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 11V17" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 11V17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: "Scan Points",
        description: "Collect points code.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 3V21" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 3V21" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 3H21" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 21H21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: "Get Rewards",
        description: "Redeem points for rewards.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

export const HowItWorks = () => {
    return (
        <div className="py-24 border-t border-gray-800 relative">
            <div className="container mx-auto px-4">
                <div className="mb-16">
                    <SectionTitle
                        title="How It Works."
                        description="Simple steps to start contributing to a cleaner planet and earning rewards."
                    />
                </div>

                {/* Location + Steps Split */}
                <div className="flex flex-col lg:flex-row items-stretch gap-8 mb-24 max-w-7xl mx-auto">
                    {/* Left: Location Image */}
                    <div className="w-full lg:w-1/2 flex">
                        <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group w-full flex-1">
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10"></div>

                            <img
                                src="/location.png"
                                alt="Locate smart bins on map"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                <h3 className="text-3xl font-bold text-white mb-2">Find Nearest Bin</h3>
                                <p className="text-gray-300 mb-6 max-w-md">Use our interactive map to locate the closest CleanLoop smart waste collection point in your area instantly.</p>
                                <Link to="/locate" className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/20">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Open Map
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right: Steps Grid */}
                    <div className="w-full lg:w-1/2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                            {steps.map((step, index) => (
                                <div key={index} className="bg-zinc-900/40 backdrop-blur-sm border border-gray-800 p-6 rounded-2xl hover:bg-zinc-900/80 hover:border-primary/30 transition-all duration-300 flex flex-col justify-center group">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {step.icon}
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Video Section */}
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-zinc-900">
                        {/* 16:9 Aspect Ratio Container */}
                        <div className="aspect-w-16 aspect-h-9 relative pb-[56.25%]">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src="https://www.youtube.com/embed/cYVeVz5BnSg?modestbranding=1&rel=0"
                                title="How it Works Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
