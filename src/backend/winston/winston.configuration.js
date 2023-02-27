import {resolve} from 'node:path'
import winston from 'winston'
import 'winston-daily-rotate-file'

const log = winston.createLogger(
    {
        level: process.env.LOG_LEVEL || 'debug',
        format: winston.format.combine(
            winston.format.timestamp(
                {
                    format: 'DD/MM/YYYY HH:mm:ss',
                }
            ),
            winston.format.json()
        ),
        transports:
        [
            new winston.transports.Console(),
            // Write all logs with importance level of `error` or less to `error.log`
            new winston.transports.DailyRotateFile(
                {
                    filename: resolve('logs', `error_%DATE%.log`),
                    datePattern: 'YYYY-MM-DD-HH',
                    level: 'error',
                    maxFiles: '2d'
                }
            ),
            // Write all logs with importance level of `debug` or less to `debug.log`
            new winston.transports.DailyRotateFile(
                {
                    filename: resolve('logs', `debug_%DATE%.log`),
                    datePattern: 'YYYY-MM-DD-HH',
                    maxFiles: '2d'
                }
            ),
        ],
        exceptionHandlers:
        [
            new winston.transports.DailyRotateFile(
                {
                    filename: resolve('logs', `exceptions_%DATE%.log`),
                    datePattern: 'YYYY-MM-DD-HH',
                    maxFiles: '2d'
                }
            )
        ],
    }
)

// By default, winston will exit after logging an uncaughtException.
log.exitOnError = false

export default log