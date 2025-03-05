import { BaseLogger } from "./BaseLogger.js";
import { ILogger } from "./ILogger.js";
import { inject, injectable } from "inversify";
import { APPLICATION_IDENTIFIERS } from "../ModuleSymbols.js";
import { format as winstonFormat, Logger as WLogger, transports } from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';
import { IS_DEVELOPMENT } from "../variables.js";

@injectable()
export class Logger extends BaseLogger<WLogger> implements ILogger {
    
    constructor(
        @inject(APPLICATION_IDENTIFIERS.LOGGER) logger: WLogger
    ) {
        super(logger);
    }

    public initialize(): void {
        const loggerConfig = {
            datePattern: "YYYY-MM-DD",
            dirname: "./logs",
            format: winstonFormat.combine(
                winstonFormat.colorize(),
                winstonFormat.simple()
              ),
            maxFiles: "14d",
            maxSize: "20m",
            zippedArchive: true,
        }

        this.logger.add(
            new DailyRotateFile({
                filename: 'sera-%DATE%.info.log',
                level: 'info',
                ...loggerConfig,
            })
        );

        this.logger.add(
            new DailyRotateFile({
            filename: 'sera-%DATE%.error.log',
            level: 'error',
            ...loggerConfig,
            })
        );

        this.logger.add(
            new DailyRotateFile({
              filename: 'sera-%DATE%.silly.log',
              level: 'silly',
              ...loggerConfig,
            })
          );

        if (IS_DEVELOPMENT) {
            this.logger.add(
              new transports.Console({
                format: winstonFormat.colorize(),
                handleExceptions: true,
                level: 'debug',
              })
            );
        }
    }

    writeInfo(message: string): void {
        this.logger.info(message);
    }

    writeError(message: string): void {
        this.logger.error(message);
    }

    writeSilly(message: string): void {
        this.logger.silly(message);
    }

    writeDebug(message: string): void {
        this.logger.debug(message);
    }
}