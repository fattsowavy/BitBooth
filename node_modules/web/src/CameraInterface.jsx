import React, { useEffect, useMemo } from 'react';
import useCamera from './hooks/useCamera';
import { getFrame } from './frames/frameRegistry';

const CameraInterface = ({ session, capturePhoto: savePhoto, capturedCount, onBack, onFinish }) => {
    const { videoRef, canvasRef, isReady, error, countdown, isCapturing, startCamera, stopCamera, capturePhoto } = useCamera();
    const frame = useMemo(() => getFrame(session.frameType), [session.frameType]);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    const handleCapture = async (timer = 3) => {
        const blob = await capturePhoto(timer);
        if (blob) {
            savePhoto(blob);
        }
    };

    // Auto-advance to edit screen when all 4 photos are taken
    useEffect(() => {
        if (capturedCount >= 4) {
            const timeout = setTimeout(() => onFinish(), 800);
            return () => clearTimeout(timeout);
        }
    }, [capturedCount, onFinish]);

    // Thumbnail URLs for already-captured photos
    const thumbUrls = session.photos.map((blob) =>
        blob ? URL.createObjectURL(blob) : null
    );

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            thumbUrls.forEach((url) => url && URL.revokeObjectURL(url));
        };
    }, [session.photos]);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Global Header */}
            <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="material-icons text-white text-sm">videogame_asset</span>
                    </div>
                    <h1 className="font-retro text-[10px] tracking-widest text-primary">BITBOOTH V1.0</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className="font-retro text-[10px] text-white/60">{isReady ? 'LIVE_FEED' : 'CONNECTING...'}</span>
                    </div>
                    <button
                        onClick={onBack}
                        className="bg-primary/20 hover:bg-primary/40 border border-primary/50 px-4 py-2 rounded text-[10px] font-retro transition-all"
                    >
                        EXIT SESSION
                    </button>
                </div>
            </header>

            {/* Main Console Container */}
            <main className="relative flex flex-col items-center mt-20">
                {/* Retro Handheld Frame (Game Boy Style) */}
                <div className="relative bg-[#9ca3af] dark:bg-zinc-800 p-8 pt-10 pb-16 rounded-[2rem] border-b-8 border-r-8 border-black/30 shadow-2xl flex flex-col items-center max-w-[500px] w-full mx-auto">
                    {/* Power Indicator */}
                    <div className="absolute left-6 top-1/3 flex flex-col items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500 shadow-[0_0_8px_green]' : 'bg-red-600 shadow-[0_0_8px_red]'}`}></div>
                        <span className="font-retro text-[6px] text-zinc-500 mt-1">{isReady ? 'READY' : 'WAIT'}</span>
                    </div>

                    {/* Screen Area */}
                    <div className="relative bg-gb-darkest p-4 rounded-lg border-4 border-zinc-900 overflow-hidden w-full aspect-square flex items-center justify-center">
                        {/* Camera Feed */}
                        <div className="absolute inset-0 bg-gb-lightest overflow-hidden">
                            {error ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-black p-8 text-center">
                                    <span className="material-icons text-red-500 text-5xl mb-4">videocam_off</span>
                                    <p className="font-retro text-[10px] text-red-400 leading-relaxed">{error}</p>
                                    <button
                                        onClick={startCamera}
                                        className="mt-4 px-6 py-2 bg-primary text-white font-retro text-[10px] pixel-border hover:bg-primary/80 transition-colors"
                                    >
                                        RETRY
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                        style={{
                                            filter: frame.filter,
                                            transform: 'scaleX(-1)',
                                        }}
                                    />
                                    {/* Frame tint overlay */}
                                    <div
                                        className="absolute inset-0 pointer-events-none mix-blend-multiply"
                                        style={{ backgroundColor: frame.tint }}
                                    />
                                </>
                            )}

                            {/* Pixel Overlay Effect */}
                            <div className="absolute inset-0 pixel-grid pointer-events-none"></div>
                            <div className="absolute inset-0 scanlines pointer-events-none"></div>
                            {/* Vignette */}
                            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)] pointer-events-none"></div>

                            {/* Countdown Overlay */}
                            {countdown !== null && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
                                    <span className="font-retro text-8xl text-white drop-shadow-[0_0_20px_rgba(136,52,239,0.8)] animate-pulse">
                                        {countdown}
                                    </span>
                                </div>
                            )}

                            {/* Flash effect on capture */}
                            {isCapturing && (
                                <div className="absolute inset-0 bg-white z-20 animate-[flash_0.3s_ease-out]"></div>
                            )}

                            {/* HUD Elements on Screen */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <div className="bg-gb-darkest text-gb-lightest px-2 py-1 font-retro text-[8px]">REC</div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <div className="bg-gb-darkest text-primary px-2 py-1 font-retro text-[8px]">
                                    {frame.title.toUpperCase()}
                                </div>
                            </div>

                            {/* Captured photo flash preview */}
                            {capturedCount >= 4 && (
                                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60">
                                    <div className="text-center">
                                        <span className="material-icons text-primary text-6xl mb-2">check_circle</span>
                                        <p className="font-retro text-sm text-primary animate-pulse">SESSION COMPLETE</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Screen Glass Glare */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none"></div>
                    </div>

                    {/* Brand Logo on Console */}
                    <div className="mt-6 flex flex-col items-center gap-1">
                        <div className="font-retro text-zinc-600 text-[12px] italic tracking-tighter flex items-center gap-2">
                            <span className="text-primary opacity-80">Bit</span>BOOTH <span className="text-[8px] border border-zinc-600 px-1 rounded">PRO</span>
                        </div>
                    </div>

                    {/* Controls Area */}
                    <div className="mt-10 w-full px-4 flex justify-between items-end">
                        {/* D-Pad Placeholder */}
                        <div className="relative w-24 h-24">
                            <div className="absolute top-1/2 left-0 w-24 h-8 bg-zinc-900 rounded-sm -translate-y-1/2"></div>
                            <div className="absolute left-1/2 top-0 w-8 h-24 bg-zinc-900 rounded-sm -translate-x-1/2"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-900 rounded-full border border-white/5"></div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-4">
                            <div className="flex flex-col items-center gap-2">
                                <span className="font-retro text-[8px] text-zinc-500">B</span>
                                <button className="w-12 h-12 bg-zinc-900 rounded-full border-b-4 border-black active:border-b-0 active:translate-y-1 transition-all"></button>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="font-retro text-[8px] text-zinc-500">A</span>
                                <button
                                    onClick={() => handleCapture(3)}
                                    disabled={!isReady || countdown !== null || capturedCount >= 4}
                                    className="w-12 h-12 bg-red-700 rounded-full border-b-4 border-red-900 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center shadow-lg shadow-red-900/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <div className="w-10 h-10 rounded-full border-2 border-red-600/30"></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Start/Select Buttons */}
                    <div className="mt-4 flex gap-6 rotate-[-25deg] self-center ml-12">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-3 bg-zinc-700 rounded-full border-b-2 border-black"></div>
                            <span className="font-retro text-[6px] text-zinc-500">SELECT</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-3 bg-zinc-700 rounded-full border-b-2 border-black"></div>
                            <span className="font-retro text-[6px] text-zinc-500">START</span>
                        </div>
                    </div>

                    {/* Speaker Slits */}
                    <div className="absolute bottom-6 right-8 flex gap-2 rotate-[-25deg]">
                        <div className="w-2 h-12 bg-black/20 rounded-full"></div>
                        <div className="w-2 h-12 bg-black/20 rounded-full"></div>
                        <div className="w-2 h-12 bg-black/20 rounded-full"></div>
                        <div className="w-2 h-12 bg-black/20 rounded-full"></div>
                        <div className="w-2 h-12 bg-black/20 rounded-full"></div>
                    </div>
                </div>

                {/* External UI Controls (The 'Modern' Layer) */}
                <div className="mt-12 flex flex-col items-center gap-8 w-full">
                    <div className="flex items-center gap-8">
                        {/* Status/Progress */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="font-retro text-[10px] text-white/40 uppercase tracking-widest">Session Progress</span>
                            <div className="flex gap-1">
                                {[0, 1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className={`w-8 h-2 transition-colors ${i < capturedCount ? 'bg-primary' : 'bg-white/10'}`}
                                    ></div>
                                ))}
                            </div>
                            <span className="font-retro text-[12px] text-primary mt-1">SHOT {Math.min(capturedCount + 1, 4)}/4</span>
                        </div>

                        {/* Main CTA */}
                        <button
                            onClick={() => handleCapture(3)}
                            disabled={!isReady || countdown !== null || capturedCount >= 4}
                            className="group relative disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <div className="absolute -inset-1 bg-primary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-primary px-12 py-5 rounded-xl flex items-center gap-4 border border-white/20 active:scale-95 transition-transform">
                                <span className="material-icons text-white">photo_camera</span>
                                <span className="font-retro text-lg text-white">
                                    {countdown !== null ? `${countdown}...` : capturedCount >= 4 ? 'DONE!' : 'CAPTURE'}
                                </span>
                            </div>
                        </button>

                        {/* Timer Indicator */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="font-retro text-[10px] text-white/40 uppercase tracking-widest">Self Timer</span>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleCapture(0)}
                                    disabled={!isReady || countdown !== null || capturedCount >= 4}
                                    className="p-2 bg-white/5 rounded border border-white/10 font-retro text-[10px] text-white/60 hover:bg-white/10 disabled:opacity-40"
                                >
                                    OFF
                                </button>
                                <div className="p-2 bg-primary/20 rounded border border-primary/50 font-retro text-[10px] text-primary">3S</div>
                                <button
                                    onClick={() => handleCapture(10)}
                                    disabled={!isReady || countdown !== null || capturedCount >= 4}
                                    className="p-2 bg-white/5 rounded border border-white/10 font-retro text-[10px] text-white/60 hover:bg-white/10 disabled:opacity-40"
                                >
                                    10S
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Photo Thumbnails */}
                    <div className="flex gap-3">
                        {thumbUrls.map((url, i) => (
                            <div
                                key={i}
                                className={`w-16 h-16 border-2 overflow-hidden ${url ? 'border-primary' : 'border-white/10'
                                    } ${session.currentPhotoIndex === i ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-dark' : ''}`}
                            >
                                {url ? (
                                    <img src={url} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" style={{ filter: frame.filter }} />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                        <span className="font-retro text-[8px] text-white/20">{i + 1}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Flash animation keyframe */}
            <style>{`
                @keyframes flash {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 z-[-1] pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] mix-blend-screen"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/40 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            {/* Footer Help */}
            <footer className="fixed bottom-6 w-full px-12 flex justify-between items-end">
                <div className="text-[10px] font-retro text-white/20">
                    SYSTEM_STATUS: {isReady ? 'READY' : 'INIT'}<br />
                    BUFFER: 1024KB
                </div>
                <div className="flex gap-8">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-display font-medium text-white/40">Need help?</span>
                        <a className="text-primary hover:underline text-[12px] font-retro" href="#">TUTORIAL</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CameraInterface;
