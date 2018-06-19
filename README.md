# TypeScript API Skeleton

[![Build Status](https://travis-ci.com/pascaliske/typescript-api.svg?branch=master)](https://travis-ci.com/pascaliske/typescript-api) [![Greenkeeper badge](https://badges.greenkeeper.io/pascaliske/typescript-api.svg)](https://greenkeeper.io/)

## Setup

To install the skeleton use the following commands:

```bash
$ mkdir -p my-api
$ cd my-api
$ git clone https://github.com/pascaliske/typescript-api.git .
$ yarn install
```

## Development

Start the server using this command:

```bash
$ yarn run start
```

For using the built in file watch you can also start the server using this command:

```bash
$ yarn run watch
```

To execute the tests run this command:

```bash
$ yarn run test
```

### Controllers

You can write controllers the following way:

```typescript
import { Service } from 'typedi'
import { JsonController, Get } from 'routing-controllers'

/**
 * Creates the controller as an dependency injected service
 */
@Service()
@JsonController('/status')
export class UserController {
    /**
     * Defines an endpoint for "GET /api/status"
     */
    @Get('/')
    public async createUser() {
        return 'success'
    }
}
```

### Tests

You can write controllers the following way:

```typescript
import test from 'ava'
import { factory } from '../../index.test'

test('GET /', async t => {
    // this one is important for usage with supertest
    t.plan(2)

    // creates a server instance for access with supertest lib
    const server = await factory()
    const response = await server.get('/api/status')

    t.is(response.status, 200)
    t.deepEqual(response.body, {
        data: 'success',
        status: 200,
    })
})
```

## License

MIT © [Pascal Iske](https://pascal-iske.de)
