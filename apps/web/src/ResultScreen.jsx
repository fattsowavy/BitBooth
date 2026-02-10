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
                        {/* Left: Photo Strip Display */}
                        <div className="lg:col-span-6 flex justify-center">
                            <div className="relative bg-white p-4 retro-inset shadow-2xl rotate-1 group hover:rotate-0 transition-transform duration-500">
                                {isGenerating ? (
                                    <div className="w-64 h-96 flex flex-col items-center justify-center gap-4">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <p className="font-retro text-[10px] text-retro-navy animate-pulse">GENERATING STRIP...</p>
                                    </div>
                                ) : genError ? (
                                    <div className="w-64 h-96 flex flex-col items-center justify-center gap-4 text-center p-4">
                                        <span className="material-icons text-red-500 text-4xl">error</span>
                                        <p className="font-retro text-[10px] text-red-600">{genError}</p>
                                    </div>
                                ) : stripUrl ? (
                                    <>
                                        <img
                                            src={stripUrl}
                                            alt="Photo Strip"
                                            className="w-64 object-contain"
                                        />
                                        <div className="mt-4 text-center">
                                            <p className="text-[10px] font-mono text-zinc-400">
                                                BITBOOTH {new Date().getFullYear()} • {frame.title.toUpperCase()}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-64 h-96 flex flex-col gap-3">
                                        {photoUrls.map((url, index) => (
                                            <div key={index} className="w-full aspect-[4/3] bg-zinc-200 overflow-hidden relative">
                                                {url ? (
                                                    <img
                                                        alt={`Photo ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        src={url}
                                                        style={{ filter: frame.filter }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-zinc-300 flex items-center justify-center">
                                                        <span className="font-retro text-[8px] text-zinc-400">EMPTY</span>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-1 right-1 bg-primary text-[10px] px-1 text-white">
                                                    {String(index + 1).padStart(3, '0')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
