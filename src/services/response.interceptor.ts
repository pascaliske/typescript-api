import { Interceptor, InterceptorInterface, Action } from 'routing-controllers'

@Interceptor()
export class ResponseInterceptor implements InterceptorInterface {
    /**
     * Standardizes all successful reponses to a pre defined format using status + result.
     *
     * @param {Action} action
     * @param {any} data
     * @returns {any}
     */
    public intercept(action: Action, data: any): any {
        const status: number = action.response.statusCode
        const skipFormat: boolean = data && data.skipFormat

        if (status >= 200 && status < 300 && data && !skipFormat) {
            return { status, data }
        }

        if (skipFormat) {
            delete data.skipFormat
        }

        return data
    }
}
