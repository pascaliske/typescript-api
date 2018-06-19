import { Service } from 'typedi'
import { createLogger, Logger as LoggerInstance, transports, format } from 'winston'
import { Format } from 'logform'
import chalk from 'chalk'

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
            level: this.fetchVerbosity('info'),
            format: this.formatMessage(),
            transports: [new Console()],
        })
    }

    public error(message: string, metadata?: LogMetadata): void {
        this.winston.error(chalk.red(message), metadata)
    }

    public warn(message: string, metadata?: LogMetadata): void {
        this.winston.warn(chalk.yellow(message), metadata)
    }

    public info(message: string, metadata?: LogMetadata): void {
        this.winston.info(message, metadata)
    }

    public verbose(message: string, metadata?: LogMetadata): void {
        this.winston.verbose(chalk.grey(message), metadata)
    }

    public debug(message: string, metadata?: LogMetadata): void {
        this.winston.debug(chalk.grey(message), metadata)
    }

    public silly(message: string, metadata?: LogMetadata): void {
        this.winston.silly(chalk.grey(message), metadata)
    }

    private fetchVerbosity(defaultValue: string = 'info'): string {
        const envValue: string = process.env.LOGLEVEL || ''

        switch (envValue.toLowerCase()) {
            case 'verbose':
                return 'verbose'

            case 'debug':
                return 'debug'

            case 'silly':
                return 'silly'

            default:
                return defaultValue
        }
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
            return chalk.cyan(matches.replace('{', '').replace('}', ''))
        })
    }
}
