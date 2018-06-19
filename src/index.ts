import 'reflect-metadata'
import { Container } from 'typedi'
import { useContainer as useContainerDatabase, createConnection } from 'typeorm'
import { useContainer as useContainerRouting } from 'routing-controllers'
import { useContainer as useContainerSocket } from 'socket-controllers'
import { Server } from './server'

// enable di on 3rd party libraries
useContainerDatabase(Container)
useContainerRouting(Container)
useContainerSocket(Container)

// fetch port and server instance
const env = process.env.NODE_ENV || 'development'
const port = parseInt(process.env.PORT, 10) || 3000
const server = Container.get(Server)

// connect to database and start listening
createConnection()
    .then(() => server.prepare(env))
    .then(() => server.listen(port))
    .catch(error => console.error(error))
