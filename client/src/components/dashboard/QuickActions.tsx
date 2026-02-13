import { ArrowRight, QrCode, Ticket, Wallet, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
    const actions = [
        {
            title: "Scan QR",
            icon: QrCode,
            link: "/scan",
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            title: "Redeem Code",
            icon: Ticket,
            link: "/redeem",
            color: "text-green-400",
            bg: "bg-green-400/10"
        },
        {
            title: "Find Nearby",
            icon: MapPin,
            link: "/locate",
            color: "text-purple-400",
            bg: "bg-purple-400/10"
        },
        {
            title: "Points Wallet",
            icon: Wallet,
            link: "/#wallet",
            color: "text-amber-400",
            bg: "bg-amber-400/10"
        },
    ];

    return (
        <section className="py-8">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.link}
                        className="group relative overflow-hidden p-6 rounded-2xl border border-gray-800 bg-gray-900/40 hover:bg-gray-800/60 transition-all duration-300"
                    >
                        <div className={`mb-4 inline-flex p-3 rounded-lg ${action.bg} ${action.color}`}>
                            <action.icon className="size-6" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                            <ArrowRight className="size-5 text-gray-500" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
