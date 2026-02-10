import { useState, useCallback } from 'react';

const INITIAL_STATE = {
    frameType: null,
    photos: [null, null, null, null],
    stickers: [[], [], [], []],
    currentPhotoIndex: 0,
};

export default function usePhotoSession() {
    const [session, setSession] = useState(INITIAL_STATE);

    const selectFrame = useCallback((frameType) => {
        setSession((prev) => ({ ...prev, frameType }));
    }, []);

    const capturePhoto = useCallback((blob) => {
        setSession((prev) => {
            const photos = [...prev.photos];
            photos[prev.currentPhotoIndex] = blob;
            return {
                ...prev,
                photos,
                currentPhotoIndex: Math.min(prev.currentPhotoIndex + 1, 3),
            };
        });
    }, []);

    const retakePhoto = useCallback((index) => {
        setSession((prev) => {
            const photos = [...prev.photos];
            photos[index] = null;
            return { ...prev, photos, currentPhotoIndex: index };
        });
    }, []);

    const addSticker = useCallback((photoIndex, sticker) => {
        setSession((prev) => {
            const stickers = prev.stickers.map((s, i) =>
                i === photoIndex ? [...s, sticker] : s
            );
            return { ...prev, stickers };
        });
    }, []);

    const updateSticker = useCallback((photoIndex, stickerIndex, updates) => {
        setSession((prev) => {
            const stickers = prev.stickers.map((s, i) =>
                i === photoIndex
                    ? s.map((st, j) => (j === stickerIndex ? { ...st, ...updates } : st))
                    : s
            );
            return { ...prev, stickers };
        });
    }, []);

    const removeSticker = useCallback((photoIndex, stickerIndex) => {
        setSession((prev) => {
            const stickers = prev.stickers.map((s, i) =>
                i === photoIndex ? s.filter((_, j) => j !== stickerIndex) : s
            );
            return { ...prev, stickers };
        });
    }, []);

    const undoLastSticker = useCallback((photoIndex) => {
        setSession((prev) => {
            const stickers = prev.stickers.map((s, i) =>
                i === photoIndex ? s.slice(0, -1) : s
            );
            return { ...prev, stickers };
        });
    }, []);

    const resetSession = useCallback(() => {
        setSession(INITIAL_STATE);
    }, []);

    const capturedCount = session.photos.filter(Boolean).length;
    const isSessionComplete = capturedCount === 4;

    return {
        session,
        selectFrame,
        capturePhoto,
        retakePhoto,
        addSticker,
        updateSticker,
        removeSticker,
        undoLastSticker,
        resetSession,
        capturedCount,
        isSessionComplete,
    };
}
