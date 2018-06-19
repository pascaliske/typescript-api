import 'reflect-metadata'
import test from 'ava'
import * as supertest from 'supertest'
import { Container } from 'typedi'
import { useContainer as useContainerDatabase, createConnection } from 'typeorm'
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

    const server = Container.get(Server)

    await createConnection()
    await server.prepare(process.env.NODE_ENV || 'development')

    return supertest(server.App)
}

/**
 * Inject server instance in each test context.
 */
test.beforeEach(async () => {
    // setup test context
})

test('init', async t => {
    t.pass()
})
