import { Service } from 'typedi'
import { createLogger, Logger as LoggerInstance, transports, format } from 'winston'
import { Format } from 'logform'
import { red, yellow, grey, cyan } from 'chalk'

export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    VERBOSE = 'verbose',
    DEBUG = 'debug',
    SILLY = 'silly',
}

export interface LogMetadata {
    [key: string]: any
}

export function formatTime(date: Date) {
    const zerofy = (value: number): string => `0${value}`.slice(-2)
    const hours = zerofy(date.getHours())
    const minutes = zerofy(date.getMinutes())
    const seconds = zerofy(date.getSeconds())

    return `${hours}:${minutes}:${seconds}`
}

@Service({
    global: true,
})
export class Logger {
    private winston: LoggerInstance

    public constructor() {
        const { Console } = transports

        this.winston = createLogger({
            level: this.fetchVerbosity(LogLevel.INFO),
            format: this.formatMessage(),
            transports: [new Console()],
        })
    }

    public error(message: string, metadata?: LogMetadata): void {
        this.winston.error(red(message), metadata)
    }

    public warn(message: string, metadata?: LogMetadata): void {
        this.winston.warn(yellow(message), metadata)
    }

    public info(message: string, metadata?: LogMetadata): void {
        this.winston.info(message, metadata)
    }

    public verbose(message: string, metadata?: LogMetadata): void {
        this.winston.verbose(grey(message), metadata)
    }

    public debug(message: string, metadata?: LogMetadata): void {
        this.winston.debug(grey(message), metadata)
    }

    public silly(message: string, metadata?: LogMetadata): void {
        this.winston.silly(grey(message), metadata)
    }

    private fetchVerbosity(defaultValue: LogLevel = LogLevel.INFO): string {
        const envValue: string = process.env.LOGLEVEL || ''
        const allowed: string[] = ['verbose', 'debug', 'silly']

        return allowed.includes(envValue) ? envValue : defaultValue
    }

    private formatMessage(): Format {
        return format.printf(info => {
            const level = info.level
            const date = formatTime(new Date())
            const message = this.highlight(info.message)

            if (Object.entries(info).length === 2) {
                return `[${level}/${date}]: ${message}`
            }

            try {
                delete info.level
                delete info.message

                return `[${level}/${date}]: ${message}\n${JSON.stringify(info, null, 2)}`
            } catch (error) {
                return `[${level}/${date}]: ${message}`
            }
        })
    }

    private highlight(message: string): string {
        return message.replace(/\{.*?\}/g, matches => {
            return cyan(matches.replace('{', '').replace('}', ''))
        })
    }
}
