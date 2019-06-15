
export interface TokenEncoder<T> {
    encode(data: T): Promise<string>;
}
