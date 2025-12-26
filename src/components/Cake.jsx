import React from 'react';
import { clsx } from 'clsx';

export const Cake = ({ isCandleLit, onBlow }) => {
    return (
        <div className="relative w-64 h-64 flex items-end justify-center select-none" onClick={onBlow} onTouchStart={onBlow}>
            {/* Plate */}
            <div className="absolute bottom-0 w-72 h-4 bg-white/30 rounded-full shadow-sm backdrop-blur-sm" />

            {/* Cake Body */}
            <div className="relative z-10 w-48 h-32 bg-matcha-300 rounded-lg shadow-lg flex flex-col items-center justify-end overflow-hidden group">
                {/* Texture detail */}
                <div className="absolute inset-0 bg-white/10 opacity-50" />
            </div>

            {/* Icing Drips */}
            <div className="absolute bottom-32 z-20 w-52 h-12 bg-matcha-100 rounded-t-xl shadow-sm flex justify-around items-end">
                <div className="w-8 h-8 bg-matcha-100 rounded-full -mb-4"></div>
                <div className="w-8 h-6 bg-matcha-100 rounded-full -mb-3"></div>
                <div className="w-8 h-9 bg-matcha-100 rounded-full -mb-5"></div>
                <div className="w-8 h-5 bg-matcha-100 rounded-full -mb-2"></div>
            </div>

            {/* Candle */}
            <div className="absolute bottom-40 z-10 w-4 h-24 bg-berry-300 rounded-sm shadow-md flex flex-col items-center">
                {/* Stripes */}
                <div className="w-full h-4 bg-white/30 mt-4 transform -rotate-12 translate-x-0.5"></div>
                <div className="w-full h-4 bg-white/30 mt-4 transform -rotate-12 translate-x-0.5"></div>

                {/* Wick */}
                <div className="absolute -top-3 w-1 h-3 bg-gray-800 opacity-80"></div>

                {/* Flame - Only visible if lit */}
                <div className={clsx(
                    "absolute -top-10 w-6 h-10 bg-yellow-400 rounded-full blur-[2px] transition-all duration-700 ease-out origin-bottom",
                    isCandleLit ? "animate-flicker opacity-90 scale-100" : "scale-0 opacity-0"
                )}>
                    <div className="absolute inset-1 bg-orange-500 rounded-full blur-[1px] animate-pulse"></div>
                </div>

                {/* Smoke - Only visible if JUST extinguished */}
                {!isCandleLit && (
                    <div className="absolute -top-20 -left-6 pointer-events-none">
                        <div className="w-2 h-2 bg-gray-400 rounded-full opacity-0 animate-smoke animation-delay-200"></div>
                        <div className="w-3 h-3 bg-gray-400 rounded-full opacity-0 animate-smoke animation-delay-400 absolute top-[-10px] left-[10px]"></div>
                    </div>
                )}
            </div>
        </div>
    );
};
