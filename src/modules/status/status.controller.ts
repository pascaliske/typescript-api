import { Service } from 'typedi'
import { JsonController, Get } from 'routing-controllers'
import { ApiResponse } from 'typings'

@Service()
@JsonController('/status')
export class UserController {
    @Get('/')
    public async status(): Promise<ApiResponse> {
        return 'success'
    }
}
