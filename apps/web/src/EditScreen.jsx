import React, { useState, useMemo, useCallback } from 'react';
import { getFrame } from './frames/frameRegistry';

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
        <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen overflow-hidden cyber-grid flex flex-col">
            {/* Navigation Header */}
            <header className="h-16 border-b-4 border-black bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center pixel-border">
                        <span className="material-icons text-white">grid_view</span>
                    </div>
                    <h1 className="font-retro text-xs tracking-tighter text-primary">BITBOOTH <span className="text-white">v1.0</span></h1>
                </div>
                <div className="font-mono-retro text-2xl text-accent-pink tracking-widest">
                    FRAME: {frame.title.toUpperCase()}
                </div>
            </header>

            <main className="flex-grow flex p-6 gap-6 overflow-hidden">
                {/* Left: Vertical Photo Strip */}
                <aside className="w-48 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-shrink-0">
                    <div className="font-retro text-[10px] text-center mb-2 text-accent-purple uppercase">Film Strip</div>
                    {session.photos.map((blob, index) => (
                        <div
                            key={index}
                            onClick={() => blob && setSelectedImageIndex(index)}
                            className={`relative group cursor-pointer aspect-[3/4] flex-shrink-0 transition-all ${!blob ? 'border-4 border-dashed border-white/20 flex items-center justify-center' :
                                selectedImageIndex === index ? 'active-strip' : 'border-4 border-black hover:border-primary/50'
                                }`}
                        >
                            {blob ? (
                                <>
                                    <img
                                        className={`w-full h-full object-cover ${selectedImageIndex === index ? 'opacity-90' : 'grayscale brightness-75 hover:grayscale-0 hover:brightness-100'}`}
                                        src={photoUrls[index]}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{ filter: selectedImageIndex === index ? frame.filter : undefined }}
                                    />
                                    <div className={`absolute top-2 right-2 font-mono-retro px-1 text-sm text-white ${selectedImageIndex === index ? 'bg-accent-pink' : 'bg-zinc-800'}`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                </>
                            ) : (
                                <span className="font-retro text-[8px] text-white/20">EMPTY</span>
                            )}
                        </div>
                    ))}
                </aside>

                {/* Center: Main Canvas & Editor */}
                <section className="flex-1 flex flex-col gap-6 min-w-0">
                    <div className="flex-1 relative flex items-center justify-center p-4">
                        {/* Cyberpunk Frame Container */}
                        <div className="relative max-w-lg w-full aspect-[3/4] p-6 bg-zinc-900 pixel-border border-4 border-accent-purple/40">
                            {/* Top Frame Accents */}
                            <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-accent-pink"></div>
                            <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-accent-pink"></div>

                            {/* Main Image with Stickers */}
                            <div className="photo-canvas relative w-full h-full overflow-hidden bg-black ring-4 ring-black">
                                {photoUrls[selectedImageIndex] ? (
                                    <img
                                        className="w-full h-full object-cover pointer-events-none"
                                        src={photoUrls[selectedImageIndex]}
                                        alt="Main Preview"
                                        style={{ filter: frame.filter }}
                                        draggable={false}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="font-retro text-sm text-white/20">NO PHOTO</span>
                                    </div>
                                )}

                                {/* Tint overlay */}
                                {frame.tint && (
                                    <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ backgroundColor: frame.tint, mixBlendMode: 'multiply' }}
                                    />
                                )}

                                {/* Stickers layer */}
                                {currentStickers.map((sticker, idx) => (
                                    <div
                                        key={idx}
                                        className="absolute cursor-grab active:cursor-grabbing select-none z-20 group"
                                        style={{
                                            left: `${sticker.x * 100}%`,
                                            top: `${sticker.y * 100}%`,
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                        onMouseDown={(e) => handleDragSticker(e, idx)}
                                        onTouchStart={(e) => handleDragSticker(e, idx)}
                                    >
                                        <span
                                            className="material-icons drop-shadow-lg"
                                            style={{
                                                color: sticker.color,
                                                fontSize: `${(sticker.size || 0.1) * 400}px`,
                                            }}
                                        >
                                            {sticker.icon}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSticker(selectedImageIndex, idx);
                                            }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full text-white text-[10px] hidden group-hover:flex items-center justify-center leading-none"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Frame Accents */}
                            <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-accent-pink"></div>
                            <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-accent-pink"></div>

                            {/* Floating Tech Label */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-accent-pink px-4 py-1 font-retro text-[10px] pixel-border">
                                {frame.key.toUpperCase()}_FRAME
                            </div>
                        </div>
                    </div>

                    {/* Sticker Library */}
                    <div className="h-40 bg-zinc-900/80 border-4 border-black p-4 flex flex-col gap-3 flex-shrink-0">
                        <div className="flex items-center justify-between px-2">
                            <span className="font-retro text-[10px] text-accent-purple uppercase tracking-widest">Sticker Library</span>
                            <button
                                onClick={() => undoLastSticker(selectedImageIndex)}
                                disabled={currentStickers.length === 0}
                                className="font-mono-retro text-lg text-white/60 hover:text-accent-pink disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                <span className="material-icons text-sm">undo</span> UNDO
                            </button>
                        </div>
                        <div className="flex-1 flex gap-4 overflow-x-auto pb-2 items-center px-2">
                            {STICKER_LIST.map((sticker, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAddSticker(sticker)}
                                    className="sticker-card w-16 h-16 bg-zinc-800 flex-shrink-0 flex items-center justify-center pixel-border border-2 border-zinc-700 transition-all hover:bg-zinc-700"
                                    title={sticker.label}
                                >
                                    <span className="material-icons" style={{ color: sticker.color }}>{sticker.icon}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Right: Utility Controls */}
                <aside className="w-16 flex flex-col items-center gap-6 pt-10 flex-shrink-0">
                    <button
                        onClick={() => undoLastSticker(selectedImageIndex)}
                        disabled={currentStickers.length === 0}
                        className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors border-2 border-black disabled:opacity-30"
                        title="Undo sticker"
                    >
                        <span className="material-icons">undo</span>
                    </button>
                    <button className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors border-2 border-black" title="Layers">
                        <span className="material-icons">layers</span>
                    </button>
                    <button
                        onClick={() => {
                            // Clear all stickers for current photo
                            while ((session.stickers[selectedImageIndex] || []).length > 0) {
                                undoLastSticker(selectedImageIndex);
                            }
                        }}
                        className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-accent-pink transition-colors border-2 border-black"
                        title="Clear all stickers"
                    >
                        <span className="material-icons">delete</span>
                    </button>
                </aside>
            </main>

            {/* Footer Action Bar */}
            <footer className="h-12 bg-black flex items-center justify-between px-8 border-t-4 border-accent-purple sticky bottom-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full"></div>
                    <span className="font-mono-retro text-sm text-zinc-400">
                        STICKERS: {currentStickers.length} | PHOTO: {selectedImageIndex + 1}/4
                    </span>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onBack}
                        className="h-8 px-6 font-mono-retro text-xl border-2 border-accent-pink text-accent-pink hover:bg-accent-pink hover:text-white transition-all flex items-center justify-center"
                    >
                        [ RETAKE ]
                    </button>
                    <button
                        onClick={onDone}
                        className="h-8 px-8 font-mono-retro text-xl bg-primary text-white pixel-border hover:bg-primary/80 transition-all flex items-center gap-2"
                    >
                        DONE_ <span className="material-icons text-sm">keyboard_return</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default EditScreen;
