import { XIcon } from "lucide-react";

export const Banner = () => {
    return (
        <div className="relative bg-secondary flex flex-wrap items-center justify-center gap-3 px-4 py-2">
            <p className="text-black font-medium">
                Make a difference today! Join the Smart Waste Revolution.
            </p>
            <span className="px-3 py-1 rounded-full bg-white text-black uppercase text-xs font-bold">
                New
            </span>
            <button className="absolute right-8">
                <XIcon className="size-5" />
            </button>
        </div>
    );
};