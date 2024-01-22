import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import momentTimezone from 'moment-timezone';
import dotEnvConfig from '../../config/dot-env-config';
import utils from './utils';
dotEnvConfig();

const logDir = 'logs'; // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, printf } = winston.format;

// Define log format
const logFormat = printf(({ level, message, metadata }) => {
  const date = momentTimezone().tz('Asia/Seoul');
  level = level.toUpperCase();
  metadata = utils.jsonStringify(metadata);
  if (metadata === '{}') metadata = '';
  return `${date.format('YYYY-MM-DD HH:mm:ss')} [${level}]: ${message} ${metadata}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const loggerTransport: WinstonDaily[] = [];
if (logDir) {
  // info 레벨 로그를 저장할 파일 설정
  loggerTransport.push(
    new WinstonDaily({
      level: 'info',
      json: true,
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: 'info_%DATE%.log',
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true,
    }),
  );
  // error 레벨 로그를 저장할 파일 설정
  loggerTransport.push(
    new WinstonDaily({
      level: 'error',
      handleExceptions: true,
      json: true,
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`, // error.log 파일은 /logs/error 하위에 저장
      filename: 'error_%DATE%.error.log',
      maxFiles: 30,
      zippedArchive: true,
    }),
  );
}
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    logFormat,
  ),
  transports: loggerTransport,
});

// Production 환경이 아닌 경우(dev 등)
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(), // 색깔 넣어서 출력
        winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
      ),
    }),
  );
}

export { logger };
