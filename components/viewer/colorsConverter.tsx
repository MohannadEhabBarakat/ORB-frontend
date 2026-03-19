import colors from 'tailwindcss/colors';

export const oklchToRgb = (oklchString: string): [number, number, number] | null => {
    // Extract L, C, and H from formats like "oklch(62.3% 0.214 259.815)"
    const regex = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)/;
    const match = oklchString.match(regex);

    if (!match) return null;

    // L is usually a percentage in Tailwind
    const lStr = match[1];
    const L = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
    const C = parseFloat(match[2]);
    const H = parseFloat(match[3]);

    // 1. Convert OKLCH to OKLAB
    const hRad = H * Math.PI / 180;
    const a = C * Math.cos(hRad);
    const b = C * Math.sin(hRad);

    // 2. Convert OKLAB to LMS
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const lCube = l_ * l_ * l_;
    const mCube = m_ * m_ * m_;
    const sCube = s_ * s_ * s_;

    // 3. Convert LMS to Linear sRGB
    const rLin = 4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube;
    const gLin = -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube;
    const bLin = -0.0041960863 * lCube - 0.7034186147 * mCube + 1.7076147010 * sCube;

    // 4. Convert Linear sRGB to standard sRGB (Apply Gamma correction)
    const gamma = (c: number) => c >= 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;

    // Clamp the values between 0 and 255
    const r = Math.max(0, Math.min(255, Math.round(gamma(rLin) * 255)));
    const g = Math.max(0, Math.min(255, Math.round(gamma(gLin) * 255)));
    const bVal = Math.max(0, Math.min(255, Math.round(gamma(bLin) * 255)));

    return [r, g, bVal];
}

export const tailwindClassToRgb = (className: string): [number, number, number] | null => {
    // Regex to extract the color name and shade (e.g., from "bg-violet-500" gets "violet" and "500")
    // This handles prefixes like bg-, text-, border-, ring-, etc.
    const match = className.match(/(?:bg|text|border|ring|fill|stroke)-([a-z]+)-(\d+)/);

    if (!match) return null;

    const colorName = match[1];
    const shade = match[2];

    // Access the color from Tailwind's default palette
    // Type assertion used here because the colors object has a complex signature
    const colorFamily = (colors as any)[colorName];

    if (!colorFamily || !colorFamily[shade]) {
        return null; // Color or shade doesn't exist in standard palette
    }

    const oklchValue = colorFamily[shade];
    return oklchToRgb(oklchValue);
}