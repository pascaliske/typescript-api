import 'reflect-metadata'
import { Container } from 'typedi'
import { useContainer as useContainerDatabase, createConnection } from 'typeorm'
import { useContainer as useContainerRouting } from 'routing-controllers'
import { useContainer as useContainerSocket } from 'socket-controllers'
import { useContainer as useContainerValidator } from 'class-validator'
import { Server, Environment } from './server'

// enable di on 3rd party libraries
useContainerDatabase(Container)
useContainerRouting(Container)
useContainerSocket(Container)
useContainerValidator(Container)

// fetch port and server instance
const env: Environment = process.env.NODE_ENV as Environment
const port = parseInt(process.env.PORT, 10) || 3000
const server = Container.get(Server)

// connect to database and start listening
createConnection()
    .then(() => server.prepare(env))
    .then(() => server.listen(port))
    .catch(error => console.error(error))
