import React, { useState, useEffect, useMemo } from 'react';
import { getFrame } from './frames/frameRegistry';
import { generateStrip } from './utils/stripGenerator';

const ResultScreen = ({ session, onRestart }) => {
    const [stripUrl, setStripUrl] = useState(null);
    const [stripBlob, setStripBlob] = useState(null);
    const [isGenerating, setIsGenerating] = useState(true);
    const [genError, setGenError] = useState(null);
    const frame = useMemo(() => getFrame(session.frameType), [session.frameType]);

    // Photo URLs for preview
    const photoUrls = useMemo(() => {
        return session.photos.map((blob) =>
            blob ? URL.createObjectURL(blob) : null
        );
    }, [session.photos]);

    // Generate strip on mount
    useEffect(() => {
        let cancelled = false;
        setIsGenerating(true);
        setGenError(null);

        generateStrip(session.photos, frame, session.stickers)
            .then((blob) => {
                if (!cancelled) {
                    setStripBlob(blob);
                    setStripUrl(URL.createObjectURL(blob));
                    setIsGenerating(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Strip generation failed:', err);
                    setGenError('Failed to generate photo strip. Please try again.');
                    setIsGenerating(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [session.photos, frame, session.stickers]);

    const handleDownload = () => {
        if (!stripBlob) return;
        const url = URL.createObjectURL(stripBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bitbooth-strip-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-retro-navy dark:text-retro-silver min-h-screen flex items-center justify-center p-6 overflow-x-hidden relative">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pixel-pattern opacity-10 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-5xl bg-retro-silver p-1 retro-border chunky-shadow">
                {/* Windows 95 Style Title Bar */}
                <div className="bg-retro-navy flex items-center justify-between px-2 py-1 mb-1">
                    <div className="flex items-center gap-2">
                        <span className="material-icons text-white text-sm">photo_camera</span>
                        <span className="text-white text-sm font-bold tracking-wider uppercase">BITBOOTH v1.0 - EXPORT_MANAGER.EXE</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-5 h-5 bg-retro-silver retro-border flex items-center justify-center text-black text-xs font-bold cursor-pointer hover:bg-white">_</div>
                        <div className="w-5 h-5 bg-retro-silver retro-border flex items-center justify-center text-black text-xs font-bold cursor-pointer hover:bg-white">□</div>
                        <div className="w-5 h-5 bg-retro-silver retro-border flex items-center justify-center text-black text-xs font-bold cursor-pointer hover:bg-red-600 hover:text-white">×</div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-retro-silver dark:bg-zinc-800 p-8 flex flex-col items-center">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-retro-navy dark:text-primary mb-2 italic tracking-tighter">
                            YOUR BITBOOTH PHOTOS
                        </h1>
                        <div className="h-1 w-full bg-primary/30 flex justify-center gap-1">
                            <div className="h-1 w-20 bg-primary"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-4xl">
                        {/* Left: Printer Animation Display */}
                        <div className="lg:col-span-6 flex justify-center">
                            <div className="relative w-80 flex flex-col items-center">
                                {/* Printer Unit Top */}
                                <div className="w-full bg-zinc-800 rounded-t-xl border-4 border-zinc-900 p-4 relative z-20 shadow-xl">
                                    <div className="h-2 w-full bg-zinc-900 rounded-full mb-2"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_lime]"></div>
                                            <div className="w-3 h-3 rounded-full bg-red-500 opacity-20"></div>
                                        </div>
                                        <span className="font-retro text-[8px] text-zinc-500 uppercase tracking-widest">BIT-PRINT 2000</span>
                                    </div>
                                    {/* Paper Slot */}
                                    <div className="mt-3 w-full h-3 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] border-b border-zinc-700"></div>
                                </div>

                                {/* Paper Exit Area (Masked) */}
                                <div className="relative z-10 w-[90%] overflow-hidden pt-1">
                                    {isGenerating ? (
                                        <div className="h-64 bg-transparent flex flex-col items-center justify-center gap-4 border-x-2 border-dashed border-zinc-300/20 mx-4">
                                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <p className="font-retro text-[8px] text-primary animate-pulse text-center">PROCESSING<br />DATA...</p>
                                        </div>
                                    ) : genError ? (
                                        <div className="h-64 flex flex-col items-center justify-center gap-4 text-center p-4">
                                            <span className="material-icons text-red-500 text-4xl">error</span>
                                            <p className="font-retro text-[10px] text-red-600">{genError}</p>
                                        </div>
                                    ) : (
                                        <div className={stripUrl ? "animate-print origin-top" : ""}>
                                            <div className="bg-white p-3 shadow-lg retro-border inline-block">
                                                <img
                                                    src={stripUrl}
                                                    alt="Photo Strip"
                                                    className="w-full object-contain"
                                                />
                                                <div className="mt-2 text-center border-t-2 border-dashed border-gray-300 pt-2">
                                                    <p className="text-[8px] font-mono text-zinc-400">
                                                        BITBOOTH • {new Date().toLocaleDateString()}
                                                    </p>
                                                    <p className="text-[6px] font-mono text-zinc-300 uppercase mt-1">
                                                        {frame.title} FRAME
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Printer Bottom Shadow/Base */}
                                <div className="absolute top-16 w-[85%] h-full bg-transparent z-0 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="lg:col-span-6 space-y-8">
                            <div className="space-y-4">
                                <button
                                    onClick={handleDownload}
                                    disabled={!stripBlob}
                                    className="w-full py-4 bg-primary text-white font-bold text-xl retro-border chunky-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 active:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="material-icons">file_download</span>
                                    {isGenerating ? 'GENERATING...' : 'DOWNLOAD STRIP'}
                                </button>

                                {/* Individual photo downloads */}
                                <div className="grid grid-cols-4 gap-2">
                                    {photoUrls.map((url, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (!session.photos[index]) return;
                                                const blobUrl = URL.createObjectURL(session.photos[index]);
                                                const a = document.createElement('a');
                                                a.href = blobUrl;
                                                a.download = `bitbooth-photo-${index + 1}.png`;
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                URL.revokeObjectURL(blobUrl);
                                            }}
                                            disabled={!session.photos[index]}
                                            className="p-2 bg-retro-silver dark:bg-zinc-700 retro-border text-retro-navy dark:text-white text-[10px] font-retro hover:bg-white dark:hover:bg-zinc-600 transition-colors disabled:opacity-30 flex flex-col items-center gap-1"
                                        >
                                            <span className="material-icons text-sm">photo</span>
                                            #{index + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-retro-gray/30">
                                <button
                                    onClick={onRestart}
                                    className="w-full py-2 bg-retro-silver dark:bg-zinc-700 text-retro-navy dark:text-white font-medium retro-border hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors uppercase tracking-widest text-sm"
                                >
                                    NEW SESSION
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Status Bar */}
                    <div className="w-full mt-12 bg-retro-silver dark:bg-zinc-900 retro-inset p-2 flex justify-between items-center text-[10px] font-mono text-retro-gray">
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> STATUS: COMPLETE</span>
                            <span>PHOTOS: 4/4</span>
                        </div>
                        <div className="italic animate-pulse">BIT_ART_ENGINE_READY...</div>
                    </div>
                </div>
            </div>

            {/* Floating Retro Decorations */}
            <div className="fixed bottom-10 left-10 hidden xl:block opacity-40 animate-bounce duration-[3000ms]">
                <div className="w-16 h-16 bg-primary/20 retro-border flex items-center justify-center">
                    <span className="material-icons text-primary text-3xl">save</span>
                </div>
            </div>
            <div className="fixed top-10 right-10 hidden xl:block opacity-40 animate-bounce duration-[4000ms]">
                <div className="w-16 h-16 bg-primary/20 retro-border flex items-center justify-center">
                    <span className="material-icons text-primary text-3xl">camera</span>
                </div>
            </div>
        </div>
    );
};

export default ResultScreen;
