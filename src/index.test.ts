import 'reflect-metadata'
import test from 'ava'
import * as supertest from 'supertest'
import { Container } from 'typedi'
import { useContainer as useContainerDatabase, createConnection, ConnectionOptions } from 'typeorm'
import { useContainer as useContainerRouting } from 'routing-controllers'
import { useContainer as useContainerSocket } from 'socket-controllers'
import { Server } from './server'

/**
 * Mock database connection and prepare server.
 */
export async function factory(): Promise<supertest.SuperTest<supertest.Test>> {
    useContainerDatabase(Container)
    useContainerRouting(Container)
    useContainerSocket(Container)

    const env = process.env.NODE_ENV || 'development'
    const server: Server = Container.get(Server)
    const options: ConnectionOptions = {
        type: 'sqljs',
        database: new Uint8Array(),
        location: 'database',
        logging: true,
    }

    await createConnection(options)
    await server.prepare(env)

    return supertest(server.App)
}

/**
 * Inject server instance in each test context.
 */
test.beforeEach(async () => {
    // setup test context
})
