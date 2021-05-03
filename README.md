# TypeScript API Skeleton

[![GitHub Tag](https://img.shields.io/github/tag/pascaliske/typescript-api.svg?style=flat-square)](https://github.com/pascaliske/typescript-api) [![Build Status](https://img.shields.io/github/workflow/status/pascaliske/typescript-api/Test%20package/master?label=test&style=flat-square)](https://github.com/pascaliske/typescript-api/actions) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=pascaliske/typescript-api)](https://dependabot.com) [![Awesome Badges](https://img.shields.io/badge/badges-awesome-green.svg?style=flat-square)](https://github.com/Naereen/badges)

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
import { JsonController, Get, Param } from 'routing-controllers'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { ApiResponse } from 'typings'
import { User } from './models/user'

/**
 * Creates the controller as an dependency injected service
 */
@Service()
@JsonController('/user')
export class UserController {
    /**
     * Model repositories
     */
    @InjectRepository(User) private userRepo: Repository<User>

    /**
     * Defines an endpoint for "GET /api/user"
     */
    @Get('/')
    public async readAll(): Promise<ApiResponse<User[]>> {
        return this.userRepo.find()
    }

    /**
     * Defines an endpoint for "GET /api/user/:id"
     */
    @Get('/:id')
    public async readOne(@Param('id') id: number): Promise<ApiResponse<User>> {
        return this.userRepo.findOne(id)
    }
}
```

### Models

The corresponding model for the demo controller above:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
    /***** columns *****/

    @PrimaryGeneratedColumn() public id: number

    @Column({
        unique: true,
        nullable: false,
    })
    public email: string

    @Column() public password: string

    /***** relations *****/
}
```

### Tests

You can test you controllers the following way:

```typescript
import test from 'ava'
import { factory } from '../../testing/setup'

test('GET /user', async t => {
    // required for supertest, count of asserts inside this test
    t.plan(2)

    // creates a server instance for access with supertest lib
    const server = await factory()
    const response = await server.get('/api/user')

    t.is(response.status, 200)
    t.is(response.body.status, 200)
})
```

### Services

You can create custom services the following way:

```typescript
import { Service } from 'typedi'

@Service({
    global: true,
})
export class CustomService {
    public foo(bar: string): string {
        return bar
    }
}
```

The service is then globally available as a singleton and can be injected into a controller:

```typescript
import { Service, Inject } from 'typedi'
import { JsonController, Get } from 'routing-controllers'
import { ApiResponse } from 'typings'
import { CustomService } from '../../services/my-custom.service.ts'

@Service()
@JsonController('/user')
export class UserController {
    @Inject() private customService: CustomService

    @Get('/demo')
    public async demo(): Promise<ApiResponse<string>> {
        return this.customService.foo('DEMO!')
    }
}
```

## License

MIT © [Pascal Iske](https://pascaliske.dev)
