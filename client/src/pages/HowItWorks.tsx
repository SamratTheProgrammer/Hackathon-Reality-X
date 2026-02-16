import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { SectionTitle } from "../components/section-title";
import { Link } from "react-router-dom";
import LenisScroll from "../components/lenis";

const steps = [
    {
        title: "1. Locate a Smart Bin",
        description: "Use our interactive map to find the nearest CleanLoop smart waste collection point. Our network covers major public areas, making it convenient for you to recycle.",
        image: "/location.png",
        action: { text: "Open Map", link: "/locate" }
    },
    {
        title: "2. Visit the Machine",
        description: "Approach any of our smart bins. They are designed to be easily accessible and user-friendly, ready to accept your recyclables 24/7.",
        image: "/smart.png"
    },
    {
        title: "3. Scan QR Code",
        description: "Launch the app and scan the unique QR code on the machine's display. This connects your account to the session and prepares the bin for your deposit.",
        image: "/qrscan.png"
    },
    {
        title: "4. Deposit Waste",
        description: "Follow the on-screen instructions to deposit your sorted waste (plastic, glass, or paper). The smart sensors will verify the item type and weight.",
        image: "/deposit.png"
    },
    {
        title: "5. Scan Points Code",
        description: "After the deposit is confirmed, the machine will generate a points code. Scan this code with your app to claim your eco-credits effectively.",
        image: "/scanpts.png"
    },
    {
        title: "6. Earn Points",
        description: "Watch your points balance grow instantly! You earn based on the type and quantity of waste you recycle, making every contribution count.",
        image: "/getpts.png"
    },
    {
        title: "7. Get Rewards",
        description: "Redeem your accumulated points for exciting rewards, coupons, or donate them to environmental causes directly from the marketplace.",
        image: "/getrewards.png",
        action: { text: "View Rewards", link: "/redeem" }
    }
];

export const HowItWorks = () => {
    return (
        <>
            <Navbar />
            <LenisScroll />
            <main className="min-h-screen bg-black pt-24 pb-12">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="text-center mb-20 space-y-4">
                        <SectionTitle
                            title="How It Works."
                            description="A simple, rewarding journey from waste to wealth. See how you can make a difference in just a few steps."
                        />
                    </div>

                    {/* Steps Flow */}
                    <div className="space-y-32">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                            >
                                <div className="w-full lg:w-1/2">
                                    <div className="relative group rounded-3xl overflow-hidden border border-gray-800 shadow-2xl bg-zinc-900/50 aspect-[4/3]">
                                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20 z-10"></div>
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="w-full h-full object-contain p-8 transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 space-y-6">
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-2">
                                        Step {index + 1}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-white font-urbanist">{step.title}</h2>
                                    <p className="text-xl text-gray-400 leading-relaxed">{step.description}</p>

                                    {step.action && (
                                        <Link
                                            to={step.action.link}
                                            className="inline-flex items-center gap-2 mt-4 text-white hover:text-primary transition-colors font-semibold text-lg group"
                                        >
                                            {step.action.text}
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Video Section */}
                    <div className="mt-32 mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white font-urbanist mb-4">See It In Action</h2>
                            <p className="text-gray-400">Watch the full process demonstration</p>
                        </div>
                        <div className="relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl mx-auto max-w-5xl bg-zinc-900">
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

                    {/* Bottom Map CTA */}
                    <div className="mt-32 border-t border-gray-800 pt-20 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-urbanist mb-6">Ready to Start?</h2>
                        <Link
                            to="/locate"
                            className="inline-block bg-primary hover:bg-secondary text-black text-lg font-bold px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-xl shadow-primary/20"
                        >
                            Locate Nearest Main
                        </Link>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    );
};
