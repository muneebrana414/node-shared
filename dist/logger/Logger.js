var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BaseLogger } from "./BaseLogger.js";
import { inject, injectable } from "inversify";
import { APPLICATION_IDENTIFIERS } from "../ModuleSymbols.js";
import { format as winstonFormat, Logger as WLogger, transports } from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';
import { IS_DEVELOPMENT } from "../variables.js";
let Logger = class Logger extends BaseLogger {
    constructor(logger) {
        super(logger);
    }
    initialize() {
        const loggerConfig = {
            datePattern: "YYYY-MM-DD",
            dirname: "./logs",
            format: winstonFormat.combine(winstonFormat.colorize(), winstonFormat.simple()),
            maxFiles: "14d",
            maxSize: "20m",
            zippedArchive: true,
        };
        this.logger.add(new DailyRotateFile(Object.assign({ filename: 'sera-%DATE%.info.log', level: 'info' }, loggerConfig)));
        this.logger.add(new DailyRotateFile(Object.assign({ filename: 'sera-%DATE%.error.log', level: 'error' }, loggerConfig)));
        this.logger.add(new DailyRotateFile(Object.assign({ filename: 'sera-%DATE%.silly.log', level: 'silly' }, loggerConfig)));
        if (IS_DEVELOPMENT) {
            this.logger.add(new transports.Console({
                format: winstonFormat.colorize(),
                handleExceptions: true,
                level: 'debug',
            }));
        }
    }
    writeInfo(message) {
        this.logger.info(message);
    }
    writeError(message) {
        this.logger.error(message);
    }
    writeSilly(message) {
        this.logger.silly(message);
    }
    writeDebug(message) {
        this.logger.debug(message);
    }
};
Logger = __decorate([
    injectable(),
    __param(0, inject(APPLICATION_IDENTIFIERS.LOGGER)),
    __metadata("design:paramtypes", [WLogger])
], Logger);
export { Logger };
