/**
 * Strip Generator — combines 4 photos into a single vertical photo strip
 * using the Canvas API. Applies frame styling and adds branding footer.
 */

const STRIP_WIDTH = 600;
const PHOTO_HEIGHT = 450; // 4:3 ratio
const PADDING = 16;
const BORDER_WIDTH = 6;
const FOOTER_HEIGHT = 60;

/**
 * Generate a photo strip from 4 photo blobs.
 * @param {Blob[]} photos - Array of 4 photo blobs
 * @param {Object} frame - Frame config from frameRegistry
 * @param {Array[]} stickers - Array of 4 sticker arrays
 * @returns {Promise<Blob>} - The generated strip as a PNG blob
 */
export async function generateStrip(photos, frame, stickers = [[], [], [], []]) {
    const totalHeight =
        PADDING +
        (PHOTO_HEIGHT + BORDER_WIDTH * 2 + PADDING) * 4 +
        FOOTER_HEIGHT +
        PADDING;

    const canvas = document.createElement('canvas');
    canvas.width = STRIP_WIDTH;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = frame.stripBg || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each photo
    for (let i = 0; i < 4; i++) {
        const blob = photos[i];
        if (!blob) continue;

        const img = await loadImage(blob);
        const x = PADDING;
        const y = PADDING + i * (PHOTO_HEIGHT + BORDER_WIDTH * 2 + PADDING);
        const photoWidth = STRIP_WIDTH - PADDING * 2;

        // Draw border
        ctx.fillStyle = frame.stripBorder || '#000000';
        ctx.fillRect(
            x - BORDER_WIDTH,
            y - BORDER_WIDTH,
            photoWidth + BORDER_WIDTH * 2,
            PHOTO_HEIGHT + BORDER_WIDTH * 2
        );

        // Draw photo (cover crop)
        drawCoverImage(ctx, img, x, y, photoWidth, PHOTO_HEIGHT);

        // Apply tint overlay
        if (frame.tint) {
            ctx.fillStyle = frame.tint;
            ctx.fillRect(x, y, photoWidth, PHOTO_HEIGHT);
        }

        // Draw stickers for this photo
        const photoStickers = stickers[i] || [];
        for (const sticker of photoStickers) {
            drawSticker(ctx, sticker, x, y, photoWidth, PHOTO_HEIGHT);
        }

        // Photo number label
        ctx.fillStyle = frame.accentColor || '#8834ef';
        ctx.fillRect(x + photoWidth - 40, y + PHOTO_HEIGHT - 24, 36, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
            String(i + 1).padStart(2, '0'),
            x + photoWidth - 22,
            y + PHOTO_HEIGHT - 9
        );
    }

    // Footer branding
    const footerY = totalHeight - FOOTER_HEIGHT - PADDING;
    ctx.fillStyle = frame.accentColor || '#8834ef';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BITBOOTH', STRIP_WIDTH / 2, footerY + 25);

    ctx.fillStyle = frame.stripBorder || '#000';
    ctx.font = '10px "VT323", monospace';
    ctx.fillText(
        `STRIP #${Math.floor(Math.random() * 10000).toString().padStart(4, '0')} • ${new Date().getFullYear()}`,
        STRIP_WIDTH / 2,
        footerY + 48
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 1);
    });
}

/** Load a Blob or URL as an Image */
function loadImage(source) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            resolve(img);
        };
        img.onerror = reject;
        img.src = source instanceof Blob ? URL.createObjectURL(source) : source;
    });
}

/** Draw image with "cover" behavior (center crop) */
function drawCoverImage(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const targetRatio = w / h;

    let sx, sy, sw, sh;
    if (imgRatio > targetRatio) {
        sh = img.height;
        sw = sh * targetRatio;
        sx = (img.width - sw) / 2;
        sy = 0;
    } else {
        sw = img.width;
        sh = sw / targetRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/** Draw a material icon sticker onto canvas */
function drawSticker(ctx, sticker, photoX, photoY, photoW, photoH) {
    const absX = photoX + sticker.x * photoW;
    const absY = photoY + sticker.y * photoH;
    const size = (sticker.size || 0.08) * photoW;

    ctx.save();
    ctx.font = `${Math.round(size)}px "Material Icons"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = sticker.color || '#ff006e';
    ctx.fillText(sticker.icon, absX, absY);
    ctx.restore();
}
