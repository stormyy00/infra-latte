export interface Image {
    url: string;
    width: number;
    height: number;
    mimeType: string;
    provider: 'gemini-imagen' | 'svg-fallback';
}

export type GenParams = { prompt: string; width?: number; height?: number };

export interface RequestBody {
    prompt: string;
    width?: number;
    height?: number;
}