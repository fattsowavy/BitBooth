import React from 'react';
import allFrames from './frames/frameRegistry.jsx';

const SelectFrame = ({ onBack, onSelect }) => {
    return (
        <div className="fixed inset-0 bg-arcade-green flex flex-col h-screen w-screen overflow-hidden">

            {/* Animated Background */}
            <div className="absolute inset-0 pixel-grid-bg opacity-30 pointer-events-none"></div>
            <div className="absolute inset-0 pixel-stars opacity-10 pointer-events-none"></div>

            {/* Header */}
            <div className="bg-black/90 p-4 md:p-6 border-b-4 border-black z-10 shrink-0 shadow-2xl relative">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Back Button */}
                        <button
                            onClick={() => onSelect(null)}
                            className="bg-zinc-800 p-2 md:p-3 rounded-xl hover:bg-zinc-700 transition-all group border-2 border-white/5 hover:border-white/20 active:scale-95"
                        >
                            <span className="material-icons text-white group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="font-retro text-2xl md:text-4xl text-arcade-gold tracking-widest text-shadow-retro uppercase">
                                Select Frame
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <p className="font-display text-[10px] md:text-xs text-white/60 tracking-wider">
                                    CHOOSE YOUR STYLE
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Credits / Decorative */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="text-right font-retro">
                            <p className="text-xs text-primary mb-1">CREDITS: ∞</p>
                            <div className="flex items-center gap-1 justify-end opacity-50">
                                <span className="w-1 h-3 bg-red-500"></span>
                                <span className="w-1 h-3 bg-red-500"></span>
                                <span className="w-1 h-3 bg-red-500"></span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-zinc-900 rounded-full border-4 border-zinc-800 relative flex items-center justify-center">
                            <div className="w-8 h-1 bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                            <div className="w-8 h-1 bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Border */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-neon-cyan to-primary opacity-50"></div>
            </div>

            {/* Scrollable Grid Area */}
            <div className="flex-grow overflow-y-auto px-4 py-8 md:py-8 scrollbar-hide perspective-1000">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-start min-h-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 w-full max-w-6xl pb-20">
                        {allFrames.map((frame) => (
                            <div
                                key={frame.key}
                                onClick={() => onSelect(frame.key)}
                                className="group relative rounded-2xl border-4 border-zinc-900/50 hover:border-primary transition-all duration-300 cursor-pointer shadow-xl hover:shadow-primary/30 hover:-translate-y-2 overflow-hidden bg-zinc-900 flex flex-col"
                            >
                                {/* Card Background Tint based on frame color */}
                                <div
                                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                                    style={{ backgroundColor: frame.bgColor }}
                                ></div>

                                {/* Frame Preview Container */}
                                <div className="relative aspect-[4/5] bg-black m-3 rounded-lg overflow-hidden border-2 border-white/5 ring-1 ring-white/5 group-hover:ring-primary/50 transition-all">
                                    {/* The content from registry */}
                                    <div className="absolute inset-0">
                                        {frame.renderContent()}
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] gap-3">
                                        <span className="font-retro text-xl text-white border-2 border-white px-6 py-2 rounded-full animate-bounce button-glow">
                                            START
                                        </span>
                                        <p className="font-display text-[10px] text-white/80 tracking-widest uppercase">
                                            Apply Filter
                                        </p>
                                    </div>

                                    {/* Scanlines overlay everywhere */}
                                    <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
                                </div>

                                {/* Frame Info */}
                                <div className="px-4 pb-4 pt-1 text-center relative z-10">
                                    <h3
                                        className="font-retro text-lg text-white group-hover:text-primary transition-colors text-shadow-sm mb-1"
                                        style={{ color: 'white', textShadow: `0 2px 0 ${frame.borderColor}` }} // subtle 3d effect
                                    >
                                        {frame.title}
                                    </h3>
                                    <p className="font-display text-[10px] uppercase tracking-wider opacity-60 text-white group-hover:opacity-100 transition-opacity">
                                        {frame.subtitle}
                                    </p>
                                </div>

                                {/* Active Selection Border (Animated) */}
                                <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary/50 rounded-2xl pointer-events-none transition-colors"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Instructions */}
            <div className="p-3 md:p-4 bg-black border-t-4 border-black text-center z-10 shrink-0 relative overflow-hidden">
                <div className="flex justify-center items-center gap-2 font-retro text-[8px] md:text-xs text-white/40 animate-pulse">
                    <span className="material-icons text-sm">touch_app</span>
                    <span>TAP FRAME TO CONFIRM SELECTION</span>
                </div>
            </div>
        </div>
    );
};

export default SelectFrame;
