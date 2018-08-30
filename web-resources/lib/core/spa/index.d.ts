declare namespace iSPA {

    export interface intercepter {
        before?(html: HTMLElement, param, cIndex, oIndex): Promise<any> | void

        after?(html: HTMLElement, param, cIndex, oIndex): Promise<any> | void
    }

    export interface factory<T> {
        new(): module<T>
    }

    export interface config {
        before?(pathname: string, param, cIndex, oIndex): Promise<any> | void

        onChange(currentElement: HTMLElement, beforeElement: HTMLElement)

        after?(pathname: string, param, cIndex, oIndex): Promise<any> | void
    }

    export interface module<T> {

        defaultParam?: T | (new() => T)

        init(param: T): Promise<HTMLElement>

        load(param: T): Promise<any> | void

        close(): Promise<any> | void
    }
}