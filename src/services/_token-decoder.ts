export interface TokenDecoder<T> {
    decode(token: string): Promise<T | null>
}