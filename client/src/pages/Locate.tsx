import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { MapPin, Navigation, Info } from "lucide-react";

export const Locate = () => {
    const locations = [
        {
            id: 1,
            name: "Central Mall Station",
            address: "123 Shopping Ave, City Center",
            distance: "0.5 miles",
            status: "Available",
            type: "Plastic & Cans"
        },
        {
            id: 2,
            name: "University Campus Hub",
            address: "45 Education Lane, Westside",
            distance: "1.2 miles",
            status: "Full",
            type: "Glass & Paper"
        },
        {
            id: 3,
            name: "Community Park Entrance",
            address: "789 Green Park Blvd, Northside",
            distance: "2.8 miles",
            status: "Available",
            type: "All Materials"
        },
        {
            id: 4,
            name: "Metro Station Terminal",
            address: "101 Transit Way, Downtown",
            distance: "3.5 miles",
            status: "Maintenance",
            type: "Plastic Only"
        }
    ];

    return (
        <>
            <Navbar />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800 min-h-screen py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Locate Smart Bins
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Find the nearest Smart Waste Reverse Vending Machine to recycle your items and earn rewards instantly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Map Container */}
                        <div className="lg:col-span-2 h-[500px] bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15282225.79979123!2d73.7250245393691!3d20.750301298393563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1707736695679!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                            ></iframe>
                            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="size-3 rounded-full bg-green-500"></div> Available
                                </div>
                                <div className="flex items-center gap-2 text-sm mt-1">
                                    <div className="size-3 rounded-full bg-red-500"></div> Full
                                </div>
                                <div className="flex items-center gap-2 text-sm mt-1">
                                    <div className="size-3 rounded-full bg-yellow-500"></div> Maintenance
                                </div>
                            </div>
                        </div>

                        {/* Location List */}
                        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {locations.map((loc) => (
                                <div key={loc.id} className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 hover:bg-gray-800/60 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{loc.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${loc.status === 'Available' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                            loc.status === 'Full' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                                'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                                            }`}>
                                            {loc.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                                        <MapPin className="size-4" />
                                        {loc.address}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                                        <Info className="size-3" />
                                        Accepts: {loc.type}
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                        <div className="flex items-center gap-1 text-sm text-gray-300">
                                            <Navigation className="size-4 text-primary" />
                                            {loc.distance}
                                        </div>
                                        <button className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                            Directions
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
