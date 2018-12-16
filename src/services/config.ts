import { Service } from 'typedi'
import { get } from 'config'

@Service({
    global: true,
})
export class Config {
    public constructor() {}

    public get(path: string): any {
        return get(path)
    }
}
