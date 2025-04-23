import gradientString from 'gradient-string';

// check if terminal supports color
export function terminalSupportsColor() {
    return process.stdout.isTTY && process.stdout.getColorDepth() > 8;
}

// check if terminal supports color and return gradient string or normal string
export function gradientText(string: string, colors: { color: string; pos: number; }[]) {
    if (terminalSupportsColor()) return gradientString(colors)(string);
    return string;
}
