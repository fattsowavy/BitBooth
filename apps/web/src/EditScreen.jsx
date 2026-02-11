import React, { useState, useMemo, useCallback } from 'react';
import { getFrame } from './frames/frameRegistry.jsx';

const STICKER_LIST = [
    { icon: 'star', color: '#ff006e', label: 'Star' },
    { icon: 'favorite', color: '#8834ef', label: 'Heart' },
    { icon: 'bolt', color: '#4ade80', label: 'Bolt' },
    { icon: 'videogame_asset', color: '#60a5fa', label: 'Game' },
    { icon: 'workspace_premium', color: '#facc15', label: 'Badge' },
    { icon: 'local_fire_department', color: '#fb923c', label: 'Fire' },
    { icon: 'auto_awesome', color: '#c084fc', label: 'Sparkle' },
    { icon: 'diamond', color: '#ffffff', label: 'Diamond' },
    { icon: 'rocket', color: '#ff006e', label: 'Rocket' },
];

const EditScreen = ({ session, addSticker, updateSticker, removeSticker, undoLastSticker, retakePhoto, onBack, onDone }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const frame = useMemo(() => getFrame(session.frameType), [session.frameType]);

    // Create object URLs for the captured photos
    const photoUrls = useMemo(() => {
        return session.photos.map((blob) =>
            blob ? URL.createObjectURL(blob) : null
        );
    }, [session.photos]);

    const handleAddSticker = useCallback((stickerDef) => {
        // Place sticker at random position (normalized 0-1)
        const sticker = {
            icon: stickerDef.icon,
            color: stickerDef.color,
            x: 0.2 + Math.random() * 0.6,
            y: 0.2 + Math.random() * 0.6,
            size: 0.1,
        };
        addSticker(selectedImageIndex, sticker);
    }, [addSticker, selectedImageIndex]);

    const handleDragSticker = useCallback((e, stickerIndex) => {
        const rect = e.currentTarget.closest('.photo-canvas')?.getBoundingClientRect();
        if (!rect) return;

        const onMove = (moveEvent) => {
            const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
            const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
            updateSticker(selectedImageIndex, stickerIndex, { x, y });
        };

        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('touchend', onUp);
    }, [updateSticker, selectedImageIndex]);

    const currentStickers = session.stickers[selectedImageIndex] || [];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white h-screen w-screen overflow-hidden cyber-grid flex flex-col">
            {/* Retro Overlay Effects */}
            <div className="fixed inset-0 scanlines z-50 pointer-events-none opacity-30"></div>
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background-dark z-0 pointer-events-none"></div>

            {/* Navigation Header - Compact */}
            <header className="h-14 md:h-12 border-b-4 border-black bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-50 shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="text-white hover:text-primary transition-colors">
                        <span className="material-icons">arrow_back</span>
                    </button>
                    <h1 className="font-retro text-[10px] md:text-xs tracking-tighter text-primary">BITBOOTH <span className="text-white">v1.0</span></h1>
                </div>
                <div className="font-mono-retro text-xs md:text-sm text-accent-pink tracking-widest hidden md:block">
                    FRAME: {frame.title.toUpperCase()}
                </div>
            </header>

            {/* Main Workspace - Laptop Optimized */}
            <main className="flex-grow flex flex-col items-center justify-center w-full px-4 overflow-hidden h-full pt-4 pb-4 md:pt-0 md:pb-0">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-7xl scale-[0.85] md:scale-[0.9] lg:scale-100 transition-transform origin-center h-full max-h-[800px]">

                    {/* Left: Film Strip */}
                    <div className="order-2 md:order-1 flex flex-row md:flex-col gap-2 bg-black/40 p-2 rounded-xl border-2 border-white/10 backdrop-blur-sm overflow-x-auto md:overflow-y-auto max-h-[12vh] md:max-h-[60vh] scrollbar-hide w-full md:w-auto shrink-0">
                        {session?.photos.map((photo, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedPhotoIndex(index)}
                                className={`relative w-14 h-14 md:w-16 md:h-16 shrink-0 cursor-pointer transition-all duration-300 rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-primary ring-2 ring-primary/50 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={photoUrls[index]} alt={`Frame ${index + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <span className="absolute bottom-1 right-1 font-retro text-[8px] text-white/80">{index + 1}</span>
                            </div>
                        ))}
                    </div>

                    {/* Center: Canvas Area */}
                    <div className="order-1 md:order-2 relative bg-zinc-900 rounded-sm border-4 md:border-8 border-zinc-800 shadow-2xl overflow-hidden aspect-[4/5] h-[50vh] md:h-[70vh] max-h-[600px] group">
                        {/* Canvas Container */}
                        <div
                            className="relative w-full h-full bg-checkered overflow-hidden cursor-crosshair photo-canvas"
                        >
                            {/* The Photo */}
                            {photoUrls[selectedImageIndex] && (
                                <div className="w-full h-full relative">
                                    <img
                                        src={photoUrls[selectedImageIndex]}
                                        alt="Editing"
                                        className="w-full h-full object-cover pointer-events-none select-none"
                                        draggable="false"
                                        style={{ filter: frame.filter }}
                                    />
                                    {/* Filter Overlay */}
                                    <div className="absolute inset-0 pointer-events-none mix-blend-multiply" style={{ backgroundColor: frame.tint }}></div>
                                </div>
                            )}

                            {/* Stickers Layer */}
                            {currentStickers.map((sticker, idx) => (
                                <div
                                    key={idx}
                                    className="absolute transform hover:cursor-move transition-shadow z-20 group/sticker"
                                    style={{
                                        left: `${sticker.x * 100}%`,
                                        top: `${sticker.y * 100}%`,
                                        transform: `translate(-50%, -50%) scale(${1})`, // Simplified for now
                                    }}
                                    onMouseDown={(e) => handleDragSticker(e, idx)}
                                    onTouchStart={(e) => handleDragSticker(e, idx)}
                                >
                                    <div className="relative">
                                        <span className="material-icons text-4xl md:text-6xl select-none filter drop-shadow-lg" style={{ color: sticker.color }}>{sticker.icon}</span>
                                        {/* Delete Button (Hover) */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSticker(selectedImageIndex, idx);
                                            }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full text-white text-[10px] hidden group-hover/sticker:flex items-center justify-center border border-white"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Grid Overlay */}
                            <div className="absolute inset-0 pixel-grid pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        </div>

                        {/* Canvas Toolbar (Floating) */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                            <button
                                onClick={() => undoLastSticker(selectedImageIndex)}
                                className="text-white hover:text-primary transition-colors disabled:opacity-30"
                                disabled={currentStickers.length === 0}
                                title="Undo"
                            >
                                <span className="material-icons text-lg">undo</span>
                            </button>
                            <div className="w-px h-6 bg-white/20"></div>
                            <button
                                onClick={() => {
                                    while ((session.stickers[selectedImageIndex] || []).length > 0) {
                                        undoLastSticker(selectedImageIndex);
                                    }
                                }}
                                className="text-white hover:text-red-500 transition-colors disabled:opacity-30"
                                disabled={currentStickers.length === 0}
                                title="Clear All"
                            >
                                <span className="material-icons text-lg">delete_sweep</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Tools & Library */}
                    <div className="order-3 md:order-3 flex flex-col gap-4 md:gap-4 w-full md:w-64 h-full md:max-h-[70vh] shrink-0">
                        {/* Tool Selector */}
                        <div className="bg-black/40 p-1 rounded-xl flex border border-white/10 shrink-0">
                            <button className="flex-1 py-1.5 md:py-2 rounded-lg bg-primary text-white font-retro text-[8px] md:text-[10px] shadow-lg">
                                STICKERS
                            </button>
                            <button className="flex-1 py-1.5 md:py-2 rounded-lg text-white/50 hover:text-white font-retro text-[8px] md:text-[10px] transition-colors cursor-not-allowed uppercase">
                                DRAW (LOCKED)
                            </button>
                        </div>

                        {/* Sticker Library */}
                        <div className="flex-grow bg-black/40 rounded-2xl border-2 border-white/10 backdrop-blur-sm overflow-hidden flex flex-col min-h-0">
                            <div className="p-3 border-b border-white/5 shrink-0">
                                <h3 className="font-retro text-[10px] text-zinc-400 uppercase tracking-widest">Collection</h3>
                            </div>
                            <div className="flex-grow overflow-y-auto p-3 grid grid-cols-4 gap-2 content-start scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                {STICKER_LIST.map((sticker, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAddSticker(sticker)}
                                        className="aspect-square flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all hover:scale-105 active:scale-95 border border-white/5 hover:border-white/20"
                                    >
                                        <span className="material-icons text-xl" style={{ color: sticker.color }}>{sticker.icon}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 shrink-0">
                            <button
                                onClick={onDone}
                                className="w-full py-3 bg-arcade-green text-black font-retro text-sm md:text-base rounded-xl hover:bg-green-400 transition-colors shadow-lg active:translate-y-1 flex items-center justify-center gap-2"
                            >
                                <span className="material-icons text-lg">print</span>
                                PRINT PHOTOS
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer Status Bar */}
            <footer className="h-8 md:h-10 bg-black flex items-center justify-between px-4 border-t border-white/10 z-50 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full"></div>
                    <span className="font-mono-retro text-[8px] md:text-[10px] text-zinc-400 uppercase">
                        {currentStickers.length} STICKERS APPLIED
                    </span>
                </div>
                <div className="font-mono-retro text-[8px] md:text-[10px] text-zinc-600">
                    EDIT_MODE_ACTIVE
                </div>
            </footer>
        </div>
    );
};

export default EditScreen;
