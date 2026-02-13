import { XIcon } from "lucide-react";
import { useState } from "react";

export const Banner = () => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="relative bg-secondary flex flex-wrap items-center justify-center gap-3 px-8 py-3 text-center transition-all duration-300">
            <p className="text-black font-medium text-sm md:text-base">
                Make a difference today! Join the Smart Waste Revolution.
            </p>
            <span className="px-3 py-1 rounded-full bg-white text-black uppercase text-[10px] md:text-xs font-bold shadow-sm">
                New
            </span>
            <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/10 rounded-full transition-colors"
                aria-label="Close banner"
            >
                <XIcon className="size-4 md:size-5 text-black" />
            </button>
        </div>
    );
};