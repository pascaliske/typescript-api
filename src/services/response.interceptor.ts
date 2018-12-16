import { Interceptor, InterceptorInterface, Action } from 'routing-controllers'
import { ApiResponse } from 'typings'

@Interceptor()
export class ResponseInterceptor implements InterceptorInterface {
    /**
     * Standardizes all successful responses to a pre defined format with status + data.
     *
     * @param {Action} action
     * @param {ApiResponse} data
     * @returns {any}
     */
    public intercept(action: Action, data: ApiResponse): any {
        const status: number = action.response.statusCode

        if (status >= 200 && status < 300 && data) {
            return { status, data }
        }

        return data
    }
}
