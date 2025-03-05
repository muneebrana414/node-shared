import { Logger } from '../src/logger/Logger';
import { Logger as WLogger, createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { IS_DEVELOPMENT } from '../src/variables';

// Mock winston and winston-daily-rotate-file
jest.mock('winston', () => ({
  createLogger: jest.fn(),
  format: {
    combine: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
  },
}));

jest.mock('winston-daily-rotate-file');

describe('Logger', () => {
  let mockWinstonLogger: jest.Mocked<WLogger>;
  let logger: Logger;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock Winston logger
    mockWinstonLogger = {
      add: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      silly: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<WLogger>;

    // Initialize Logger instance
    logger = new Logger(mockWinstonLogger);
  });

  describe('initialize', () => {
    it('should add three DailyRotateFile transports for info, error, and silly levels', () => {
      logger.initialize();

      expect(DailyRotateFile).toHaveBeenCalledTimes(3);
      expect(mockWinstonLogger.add).toHaveBeenCalledTimes(IS_DEVELOPMENT ? 4 : 3);

      // Verify info transport
      expect(DailyRotateFile).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: 'sera-%DATE%.info.log',
          level: 'info',
          datePattern: 'YYYY-MM-DD',
          dirname: './logs',
          maxFiles: '14d',
          maxSize: '20m',
          zippedArchive: true,
        })
      );

      // Verify error transport
      expect(DailyRotateFile).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: 'sera-%DATE%.error.log',
          level: 'error',
        })
      );

      // Verify silly transport
      expect(DailyRotateFile).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: 'sera-%DATE%.silly.log',
          level: 'silly',
        })
      );
    });

    it('should not add Console transport in production environment', () => {
      const originalIsDevelopment = IS_DEVELOPMENT;
      (IS_DEVELOPMENT as any) = false;

      logger.initialize();

      expect(transports.Console).not.toHaveBeenCalled();
      expect(mockWinstonLogger.add).toHaveBeenCalledTimes(3);

      // Restore original value
      (IS_DEVELOPMENT as any) = originalIsDevelopment;
    });
  });

  describe('logging methods', () => {
    const testMessage = 'Test message';

    it('should call info method with correct message', () => {
      logger.writeInfo(testMessage);
      expect(mockWinstonLogger.info).toHaveBeenCalledWith(testMessage);
      expect(mockWinstonLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call error method with correct message', () => {
      logger.writeError(testMessage);
      expect(mockWinstonLogger.error).toHaveBeenCalledWith(testMessage);
      expect(mockWinstonLogger.error).toHaveBeenCalledTimes(1);
    });

    it('should call silly method with correct message', () => {
      logger.writeSilly(testMessage);
      expect(mockWinstonLogger.silly).toHaveBeenCalledWith(testMessage);
      expect(mockWinstonLogger.silly).toHaveBeenCalledTimes(1);
    });

    it('should call debug method with correct message', () => {
      logger.writeDebug(testMessage);
      expect(mockWinstonLogger.debug).toHaveBeenCalledWith(testMessage);
      expect(mockWinstonLogger.debug).toHaveBeenCalledTimes(1);
    });
  });
});