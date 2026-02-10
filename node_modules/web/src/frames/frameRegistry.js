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
    },
];

export function getFrame(key) {
    return frames.find((f) => f.key === key) || frames[0];
}

export default frames;
