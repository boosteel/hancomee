// typesciprt 에서 import dd from '.html' 을 가능하게 해준다.
declare module '*.html' {
    const value: string;
    export = value
}

declare function require(source: string);

interface iCompile {
    (obj: any): string
}

type iParseResult = [iCompile, iCompileMap];

type iCompileMap = { [index: string]: iCompile }

interface iCompileHandler<T> {
    (data: T): string
}


interface iResponseResult<T> {
    totalPages: number
    count: number
    values: T[]
    page: number
}

type iEleArray = ArrayLike<HTMLElement>

interface iEleMapEach {
    [key: string]: (e: HTMLElement, obj) => void
}

interface iEleMap extends ArrayLike<HTMLElement> {

    keys: string[]

    length: number

    setText(obj?, map?): this

    each<T>(h: (e: HTMLElement, name: string, obj: T) => void, value?: T, each?: iEleMapEach): this

}

declare namespace iLocation {

    export interface iSearch {
        reset(search?: string): this

        extend(obj: {})

        hash(): this

        queryString(extend?: {}): string
    }
}

declare namespace iSPA {

    export interface config {
        before?(pathname: string, param, cIndex, oIndex): Promise<any> | void

        onChange(currentElement: HTMLElement, beforeElement: HTMLElement)

        after?(pathname: string, param, cIndex, oIndex): Promise<any> | void
    }

    export interface factory<T> {
        new(): module<T>
    }


    export interface module<T> {

        getParam(): T

        init(): Promise<HTMLElement>

        load(param: T, search: string): Promise<any> | void

        close(): Promise<any> | void
    }
}