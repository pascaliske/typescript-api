import { Service, Inject } from 'typedi'
import { useExpressServer, Action } from 'routing-controllers'
import { useSocketServer } from 'socket-controllers'
import { createServer, Server as HttpServer } from 'http'
import * as express from 'express'
import * as io from 'socket.io'
import * as compression from 'compression'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as cors from 'cors'
import { Logger, formatTime } from './services/logger'

@Service()
export class Server {
    /**
     * Logger service.
     *
     * @param {Logger} logger
     */
    @Inject() private logger: Logger

    /**
     * Application environment
     *
     * @param {string}
     */
    private env: string

    /**
     * Express server instance.
     *
     * @param {express.Application} app
     */
    private app: express.Application

    /**
     * Server instance.
     *
     * @param {HttpServer} server
     */
    private server: HttpServer

    /**
     * Socket server instance.
     *
     * @param {io.Server} io
     */
    private io: io.Server

    /**
     * Cors options for security.
     *
     * @param {cors.CorsOptions} corsOptions
     */
    private corsOptions: cors.CorsOptions = {
        origin: ['http://localhost:4200', 'https://travelfeed.blog'],
    }

    /**
     * Configures the express server instance.
     *
     * @returns {Promise<void>}
     */
    public async prepare(env: string): Promise<void> {
        this.env = env
        this.app = express()
        this.app.options('*', cors(this.corsOptions))
        this.app.use(cors(this.corsOptions))
        this.app.use(compression())
        this.app.use(helmet())
        this.app.use(
            morgan((tokens, req, res) => {
                const sections = [
                    `[http/${formatTime(new Date())}]:`,
                    tokens.method(req, res),
                    tokens.url(req, res),
                    tokens.status(req, res),
                    '-',
                    tokens['response-time'](req, res),
                    'ms',
                ]

                return sections.join(' ')
            }),
        )

        // wrap express with http server
        this.server = createServer(this.app)

        // init socket server
        this.io = io(this.server, {
            origins: 'localhost:*',
        })
        this.io.on('connect', (socket: io.Socket) => {
            this.logger.debug(`user connected (#${socket.id})`)

            socket.on('message', event => {
                this.logger.silly('message', event)
            })

            socket.on('custom', event => {
                this.logger.silly('custom', event)
            })

            socket.on('disconnect', () => {
                this.logger.debug(`user disconnected (#${socket.id})`)
            })
        })

        // init socket controllers
        useSocketServer(this.io, {
            controllers: [`${__dirname}/modules/*/*.controller.js`],
        })

        // init routing controllers
        useExpressServer(this.app, {
            controllers: [`${__dirname}/modules/*/*.controller.js`],
            middlewares: [`${__dirname}/**/*.middleware.js`],
            interceptors: [`${__dirname}/**/*.interceptor.js`],
            routePrefix: '/api',
            cors: this.corsOptions,
            defaults: {
                nullResultCode: 201,
                undefinedResultCode: 204,
                paramOptions: {
                    required: true,
                },
            },
            currentUserChecker: (action: Action) => action.request.user,
        })
    }

    /**
     * Starts listening on the given port.
     *
     * @param {number} port
     * @returns {Promise<void>}
     */
    public async listen(port: number): Promise<void> {
        this.server.listen(port)
        this.server.on('close', () => this.logger.info('closed successfully. bye!'))
        this.server.on('error', error => {
            throw new Error(error.message)
        })

        this.logger.info(`server is listening in ${this.env} mode on port {${port}}`)
    }

    /**
     * Returns the express app. (Needed for testing!)
     *
     * @returns {express.Application}
     */
    public get App(): express.Application {
        return this.app
    }
}
