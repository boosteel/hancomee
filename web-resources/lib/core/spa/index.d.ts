declare namespace iSPA {

    export interface intercepter {
        before?(html: HTMLElement, param, cIndex, oIndex): Promise<any> | void

        after?(html: HTMLElement, param, cIndex, oIndex): Promise<any> | void
    }

    export type param = {[index: string]: any}

    export type factory = new() => module


    export interface module {
        init(param: param): Promise<HTMLElement>

        load(param: param): Promise<any> | void

        close(): Promise<any> | void
    }
}