import test from 'ava'
import { factory } from '../../test'

test('GET /', async t => {
    t.plan(2)

    const server = await factory()
    const response = await server.get('/api/status')

    t.is(response.status, 200)
    t.deepEqual(response.body, {
        data: 'success',
        status: 200,
    })
})
