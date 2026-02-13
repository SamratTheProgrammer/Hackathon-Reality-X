import { ScanLine, Smartphone, Trophy, Recycle, Activity } from "lucide-react";

export const UserFlow = () => {
    const steps = [
        { icon: ScanLine, title: "1. Scan QR", desc: "Login to machine" },
        { icon: Smartphone, title: "2. Instructions", desc: "View AR guide" },
        { icon: Recycle, title: "3. Recycle", desc: "Identify & verify" },
        { icon: Trophy, title: "4. Earn Points", desc: "Get rewarded" },
        { icon: Activity, title: "5. Track", desc: "View impact" },
    ];

    return (
        <section className="py-12 border-b border-gray-800">
            <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10 transform -translate-y-1/2"></div>

                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center bg-black p-4 rounded-xl border border-gray-800 w-full md:w-40 text-center z-10">
                        <div className="bg-gray-900 p-3 rounded-full mb-3 text-primary">
                            <step.icon className="size-6" />
                        </div>
                        <h3 className="font-bold text-sm mb-1">{step.title}</h3>
                        <p className="text-xs text-gray-400">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
