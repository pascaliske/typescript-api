import { Service } from 'typedi'
import { JsonController, Get } from 'routing-controllers'

@Service()
@JsonController('/status')
export class UserController {
    @Get('/')
    public async createUser() {
        return 'success'
    }
}
