/**
 * Frame Registry — defines visual styling for each retro frame theme.
 * Each frame has CSS filters, border colors, and overlay styling
 * used by the CameraInterface, EditScreen, and stripGenerator.
 */

const frames = [
    {
        key: 'gameboy',
        title: 'Classic Game Boy',
        subtitle: 'Monochrome Green',
        filter: 'grayscale(1) contrast(1.2) sepia(0.3) brightness(0.9)',
        tint: 'rgba(155, 188, 15, 0.25)',
        borderColor: '#306230',
        bgColor: '#9bbc0f',
        accentColor: '#0f380f',
        stripBorder: '#306230',
        stripBg: '#9bbc0f',
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
        key: 'arcade',
        title: 'Arcade Cabinet',
        subtitle: 'Neon Borders',
        filter: 'contrast(1.3) saturate(1.4) brightness(1.05)',
        tint: 'rgba(136, 52, 239, 0.15)',
        borderColor: '#8834ef',
        bgColor: '#0a0a0a',
        accentColor: '#00f5ff',
        stripBorder: '#8834ef',
        stripBg: '#0f0f1a',
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
        key: 'tamagotchi',
        title: 'Tamagotchi',
        subtitle: 'Cute Icons',
        filter: 'saturate(0.8) brightness(1.1) contrast(0.95)',
        tint: 'rgba(244, 114, 182, 0.15)',
        borderColor: '#f472b6',
        bgColor: '#fce7f3',
        accentColor: '#ec4899',
        stripBorder: '#f472b6',
        stripBg: '#fdf2f8',
        renderContent: () => (
            <>
                {/* Fixed Tamagotchi: Tighter fit */}
                <div className="absolute inset-1 border-[10px] border-pink-400 shadow-lg bg-pink-100"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[85%] h-[85%] bg-[#c8d4a4] border-4 border-gray-600 p-2 flex flex-wrap content-center justify-center gap-2 shadow-inner opacity-80 rounded-xl">
                        <span className="material-icons text-gray-800/40 text-4xl">pets</span>
                    </div>
                </div>
            </>
        )
    },
    {
        key: 'win95',
        title: 'Windows 95',
        subtitle: 'Grey Title Bars',
        filter: 'saturate(0.7) contrast(1.1) brightness(0.95)',
        tint: 'rgba(0, 0, 128, 0.08)',
        borderColor: '#808080',
        bgColor: '#c0c0c0',
        accentColor: '#000080',
        stripBorder: '#808080',
        stripBg: '#c0c0c0',
        renderContent: () => (
            <>
                {/* Fixed Win95: Absolute positioning enforcement */}
                <div className="absolute inset-0 bg-[#c0c0c0] flex flex-col p-1">
                    <div className="bg-[#000080] p-1 flex justify-between items-center mb-1 shrink-0">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-white/20"></div>
                            <span className="font-display font-bold text-[8px] text-white truncate max-w-[80px]">BitBooth_v1.0.exe</span>
                        </div>
                        <div className="flex gap-0.5">
                            <div className="w-3 h-3 bg-[#c0c0c0] border border-white flex items-center justify-center text-black text-[6px]">_</div>
                            <div className="w-3 h-3 bg-[#c0c0c0] border border-white flex items-center justify-center text-black text-[6px]">X</div>
                        </div>
                    </div>
                    <div className="flex-grow border-2 border-gray-600 bg-teal-800 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] overflow-hidden relative">
                        <span className="material-icons text-white/10 text-6xl">desktop_windows</span>
                    </div>
                </div>
            </>
        )
    },
    {
        key: 'cyberpunk',
        title: 'Cyberpunk',
        subtitle: 'High Contrast Glitch',
        filter: 'contrast(1.4) saturate(1.6) brightness(1.1) hue-rotate(10deg)',
        tint: 'rgba(0, 245, 255, 0.12)',
        borderColor: '#00f5ff',
        bgColor: '#0d0221',
        accentColor: '#ff006e',
        stripBorder: '#00f5ff',
        stripBg: '#0d0221',
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
        key: 'crt',
        title: 'CRT Monitor',
        subtitle: 'Scanline Overlays',
        filter: 'contrast(1.2) brightness(0.9) saturate(0.9)',
        tint: 'rgba(255, 255, 255, 0.05)',
        borderColor: '#555555',
        bgColor: '#1a1a1a',
        accentColor: '#33ff33',
        stripBorder: '#444444',
        stripBg: '#111111',
        renderContent: () => (
            <div className="w-full h-full bg-black shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] border-[6px] border-gray-700 relative overflow-hidden flex items-center justify-center">
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
    },
];

export function getFrame(key) {
    return frames.find((f) => f.key === key) || frames[0];
}

export default frames;
