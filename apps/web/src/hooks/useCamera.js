import { useRef, useState, useCallback, useEffect } from 'react';

export default function useCamera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const startCamera = useCallback(async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 960 },
                },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    setIsReady(true);
                };
            }
        } catch (err) {
            console.error('Camera access error:', err);
            setError(
                err.name === 'NotAllowedError'
                    ? 'Camera access denied. Please allow camera permissions.'
                    : 'Could not access camera. Make sure a camera is connected.'
            );
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setIsReady(false);
    }, []);

    const capturePhoto = useCallback(
        (timerSeconds = 0) => {
            return new Promise((resolve) => {
                if (!videoRef.current || !isReady) {
                    resolve(null);
                    return;
                }

                const doCapture = () => {
                    setIsCapturing(true);
                    const video = videoRef.current;
                    const canvas = canvasRef.current || document.createElement('canvas');

                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');

                    // Mirror the image (selfie mode)
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform

                    canvas.toBlob(
                        (blob) => {
                            setIsCapturing(false);
                            setCountdown(null);
                            resolve(blob);
                        },
                        'image/png',
                        0.95
                    );
                };

                if (timerSeconds <= 0) {
                    doCapture();
                } else {
                    let remaining = timerSeconds;
                    setCountdown(remaining);
                    const interval = setInterval(() => {
                        remaining--;
                        if (remaining <= 0) {
                            clearInterval(interval);
                            setCountdown(null);
                            doCapture();
                        } else {
                            setCountdown(remaining);
                        }
                    }, 1000);
                }
            });
        },
        [isReady]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return {
        videoRef,
        canvasRef,
        isReady,
        error,
        countdown,
        isCapturing,
        startCamera,
        stopCamera,
        capturePhoto,
    };
}
