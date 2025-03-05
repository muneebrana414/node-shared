import { BaseLogger } from "./BaseLogger";
import { ILogger } from "./ILogger";
import { Logger as WLogger } from "winston";
export declare class Logger extends BaseLogger<WLogger> implements ILogger {
    constructor(logger: WLogger);
    initialize(): void;
    writeInfo(message: string): void;
    writeError(message: string): void;
    writeSilly(message: string): void;
    writeDebug(message: string): void;
}
