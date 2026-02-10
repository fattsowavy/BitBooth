import React from 'react';
import allFrames from './frames/frameRegistry';

const SelectFrame = ({ onBack, onSelect }) => {
    const frames = [
        {
            key: allFrames[0].key,
            title: "Classic Game Boy",
            subtitle: "Monochrome Green",
            className: "bg-slate-900 border-[#306230]",
            renderContent: () => (
                <>
                    <div className="absolute inset-0 bg-[#9bbc0f] flex items-center justify-center p-8">
                        <div className="w-full h-full border-4 border-[#306230] relative flex items-center justify-center">
                            <span className="text-[#306230] font-mono-retro text-6xl opacity-20">BIT</span>
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                            <div className="w-4 h-4 rounded-full bg-red-600 shadow-inner"></div>
                            <span className="text-[8px] font-retro text-[#306230]">BATTERY</span>
                        </div>
                        <span className="font-retro text-[10px] text-[#306230]">DOT MATRIX</span>
                    </div>
                </>
            )
        },
        {
            key: allFrames[1].key,
            title: "Arcade Cabinet",
            subtitle: "Neon Borders",
            className: "bg-slate-900",
            renderContent: () => (
                <>
                    <div className="absolute inset-0 border-[16px] border-primary/40 flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-neon-cyan animate-pulse"></div>
                        <div className="w-full h-full bg-black flex items-center justify-center">
                            <span className="material-icons text-8xl text-primary/30">videogame_asset</span>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 p-2 bg-primary text-[8px] font-retro">INSERT COIN</div>
                </>
            )
        },
        {
            key: allFrames[2].key,
            title: "Tamagotchi",
            subtitle: "Cute Icons",
            className: "bg-pink-100",
            renderContent: () => (
                <>
                    <div className="absolute inset-0 border-[24px] border-pink-400 rounded-full scale-125"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3/4 h-3/4 bg-[#c8d4a4] border-4 border-gray-600 p-2 flex flex-wrap content-between justify-around">
                            <span className="material-icons text-gray-800/20">favorite</span>
                            <span className="material-icons text-gray-800/20">pets</span>
                            <span className="material-icons text-gray-800/20">egg</span>
                            <span className="material-icons text-gray-800/20">cake</span>
                        </div>
                    </div>
                </>
            )
        },
        {
            key: allFrames[3].key,
            title: "Windows 95",
            subtitle: "Grey Title Bars",
            className: "bg-[#c0c0c0] flex flex-col",
            renderContent: () => (
                <>
                    <div className="bg-[#000080] p-2 flex justify-between items-center mx-1 mt-1">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white/20"></div>
                            <span className="font-display font-bold text-xs text-white">BitBooth_v1.0.exe</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-4 h-4 bg-[#c0c0c0] border border-white shadow-sm flex items-center justify-center text-black font-bold text-[8px]">_</div>
                            <div className="w-4 h-4 bg-[#c0c0c0] border border-white shadow-sm flex items-center justify-center text-black font-bold text-[8px]">X</div>
                        </div>
                    </div>
                    <div className="flex-grow m-4 border-2 border-gray-600 bg-teal-800 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]">
                        <span className="material-icons text-white/10 text-9xl">desktop_windows</span>
                    </div>
                </>
            )
        },
        {
            key: allFrames[4].key,
            title: "Cyberpunk",
            subtitle: "High Contrast Glitch",
            className: "bg-background-dark",
            renderContent: () => (
                <>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-neon-cyan/30"></div>
                    <div className="absolute inset-4 border-2 border-primary border-dashed opacity-50"></div>
                    <div className="absolute top-8 left-8 right-8 h-px bg-neon-cyan animate-pulse"></div>
                    <div className="absolute bottom-8 left-8 right-8 h-px bg-neon-cyan animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-retro text-2xl text-neon-cyan skew-x-[-15deg] brightness-125">GLITCH</span>
                    </div>
                </>
            )
        },
        {
            key: allFrames[5].key,
            title: "CRT Monitor",
            subtitle: "Scanline Overlays",
            className: "bg-gray-800 p-6",
            renderContent: () => (
                <div className="w-full h-full bg-black rounded-[40px] shadow-[inset_0_0_50px_rgba(255,255,255,0.1)] border-8 border-gray-700 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "4px 4px" }}></div>
                    <span className="material-icons text-white/5 text-8xl scale-[2]">tv</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent h-1/4 animate-[scan_4s_linear_infinite]"></div>
                    <style>{`
                    @keyframes scan {
                        from { transform: translateY(-100%); }
                        to { transform: translateY(400%); }
                    }
                `}</style>
                </div>
            )
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen relative overflow-x-hidden selection:bg-primary/40">
            {/* Retro Overlay Effects */}
            <div className="fixed inset-0 scanlines z-50 pointer-events-none opacity-30"></div>
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background-dark z-0 pointer-events-none"></div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                {/* Navigation Header */}
                <header className="flex items-center mb-16">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-4 text-primary hover:text-neon-cyan transition-colors"
                    >
                        <span className="material-icons text-4xl">arrow_back</span>
                        <span className="font-mono-retro text-2xl uppercase tracking-widest hidden md:block">Main Menu</span>
                    </button>

                    <div className="flex-grow text-center">
                        <h1 className="font-retro text-2xl md:text-4xl text-white tracking-tighter uppercase leading-tight">
                            Select Your <br className="md:hidden" />
                            <span className="text-primary">Frame</span>
                        </h1>
                        <div className="mt-4 flex justify-center gap-2">
                            <div className="h-1 w-12 bg-primary"></div>
                            <div className="h-1 w-4 bg-neon-cyan"></div>
                            <div className="h-1 w-12 bg-primary"></div>
                        </div>
                    </div>

                    <div className="w-24 hidden md:block"></div> {/* Spacer */}
                </header>

                {/* Selection Grid */}
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {frames.map((frame, index) => (
                        <div key={index} className="group cursor-pointer" onClick={() => onSelect(frame.key)}>
                            <div className={`pixel-border pixel-border-hover aspect-square relative mb-6 overflow-hidden transition-all duration-300 ${frame.className}`}>
                                {frame.renderContent()}
                            </div>
                            <div className="text-center">
                                <h3 className="font-retro text-sm text-white mb-2 group-hover:text-neon-cyan transition-colors">{frame.title}</h3>
                                <p className="font-mono-retro text-xl text-primary uppercase">{frame.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </main>

                {/* Footer Hint */}
                <footer className="mt-20 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 animate-bounce">
                        <span className="material-icons text-neon-cyan">mouse</span>
                        <p className="font-mono-retro text-2xl text-neon-cyan tracking-[0.2em] uppercase">Click to Select Frame</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary"></div>
                        <div className="w-2 h-2 bg-primary/60"></div>
                        <div className="w-2 h-2 bg-primary/30"></div>
                    </div>
                </footer>
            </div>

            {/* Background Elements */}
            <div className="fixed top-20 right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
            <div className="fixed bottom-20 left-[-10%] w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px] -z-10"></div>
        </div>
    );
};

export default SelectFrame;
