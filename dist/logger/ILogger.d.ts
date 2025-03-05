export interface ILogger {
    initialize(): void;
    writeInfo(message: string): void;
    writeError(message: string): void;
    writeSilly(message: string): void;
    writeDebug(message: string): void;
}
