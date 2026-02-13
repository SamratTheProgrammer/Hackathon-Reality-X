import { ScanLine, Recycle, Award, BarChart3, Users, Zap } from "lucide-react";
import type { IFeature } from "../types";

export const features: IFeature[] = [
    {
        title: "AI Waste Recognition",
        description:
            "Simply scan your item, and our AI instantly identifies the material type and proper disposal method.",
        icon: ScanLine
    },
    {
        title: "Smart Sorting System",
        description:
            "Our intelligent bins automatically sort waste into appropriate categories to maximize recycling efficiency.",
        icon: Recycle
    },
    {
        title: "Instant Rewards",
        description:
            "Earn points for every item you recycle. Redeem them for gift cards, products, or charitable donations.",
        icon: Award
    },
    {
        title: "Impact Tracking",
        description:
            "Visualize your environmental contribution in real-time. See how much CO2 you've saved and waste diverted.",
        icon: BarChart3,
    },
    {
        title: "Community Leaderboards",
        description:
            "Compete with friends and neighbors. Join challenges to boost community recycling rates together.",
        icon: Users,
    },
    {
        title: "Fast & Convenient",
        description:
            "Locate nearby smart bins, scan via app, and recycle in seconds. Making sustainability effortless.",
        icon: Zap,
    },
]