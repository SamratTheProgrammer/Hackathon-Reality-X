import { XIcon } from "lucide-react";
import { useState } from "react";

export const Banner = () => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="relative bg-secondary flex flex-nowrap items-center justify-center gap-2 px-3 py-2 md:px-8 md:py-3 text-center transition-all duration-300 overflow-hidden">
            <p className="text-black font-medium text-[10px] sm:text-xs md:text-base truncate max-w-[70%] md:max-w-none">
                Make a difference today! Join the Smart Waste Revolution.
            </p>
            <span className="px-1.5 py-0.5 md:px-3 md:py-1 rounded-full bg-white text-black uppercase text-[9px] md:text-xs font-bold shadow-sm whitespace-nowrap shrink-0">
                New
            </span>
            <button
                onClick={() => setIsOpen(false)}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1 md:p-2 hover:bg-black/10 rounded-full transition-colors shrink-0"
                aria-label="Close banner"
            >
                <XIcon className="size-3 md:size-5 text-black" />
            </button>
        </div>
    );
};