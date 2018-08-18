/* ********************  dataTable ***************** */

// javascript Event override
declare interface Event {
    selectTarget?: HTMLElement
}

// SPA
declare interface IPageModule {


    // 화면에 표시할 단일 엘리먼트를 반환한다.
    getElement(): Promise<HTMLElement>

    // [before render] 메인 엘리먼트에 붙여진 상태 :: 아직 화면에 표시 전
    pre(element: HTMLElement)

    // [after render] 눈에 보이는 작업을 진행한다.
    init()


    disable(): Promise<any>
}


// 각종 함수타입
declare namespace ko {

    namespace types {
        // Events
        namespace event {
            
            type KeyboardEvent = (e: KeyboardEvent) => any

            interface Switch {
                on(): this

                off(): this

                trigger(...args: any[]): this

                isActive: boolean
            }

            interface SwitchGroup {
                register(element: EventTarget, eventType: string, handler: (e) => any): this
                register(element: EventTarget, eventType: string, selector: string, handler: (e) => any): this

                on(): this

                off(): this

                isActive: boolean
            }
        }

        namespace promise {
            type PromiseCallback = <T>(resolve: (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void;
        }
    }

}

interface DOM {
    element: HTMLElement
}


declare namespace template {

// Template
    interface Class {
        $template: DOM

        apply(): this
    }

    interface Cons<T extends Class> {
        new (...args: any[]): T
    }

    interface DirectiveHandler<T> {
        (element: HTMLElement, obj: T, attrValues: { [index: string]: string }): any
    }

    interface DirectiveMap<T> {
        [index: string]: DirectiveHandler<T>;
    }


    interface TEMPLATE {

        <T>(template: string, directive: DirectiveMap<T>): <T extends Class>(cons: Cons<T>) => any

        <T>(directive: DirectiveMap<T>): <T extends Class>(cons: Cons<T>) => any

        (template?: string): <T extends Class>(cons: Cons<T>) => any

        setTemplate<T extends Class>(cons: Cons<T>, select: string): TEMPLATE;

        directive<T extends Class>(cons: Cons<T>, map: DirectiveMap<T>): TEMPLATE;

        filter(name: string): (...args: any[]) => any;

        filter(name: string, fn): TEMPLATE;
    }
}

declare namespace ko {
    namespace types {
        interface ImageLike {
            top?: number
            left?: number
            width: number
            height: number
            rotate: number
        }

        type PromiseResolve<T> = (value?: T | Thenable<T>) => void
        type PromiseReject = (error?: any) => void
    }
}

interface IDateManager {

    year: number
    month: number
    date: number
    day: number
    longtime: number

    $date(num: number): IDateManager

    $month(num: number): IDateManager

    $year(num: number): IDateManager


    format(format: string): string

    format(): string

    toString(format: string): string

    toString(): string
}


interface Core {
    before(handler: () => JQueryPromise<any> | any): Core;

    run(handler: (...any) => void): void
}


// Form
interface UNITS {
    [index: string]: JQuery
}

interface ValidChangeFactory {
    (ele: JQuery, ctrl: ValidController): ValidChangeHandler
}

interface ValidChangeHandler {
    (valid: boolean, units: UNITS, ctrl: ValidController): void
}

interface ValidateChecker {
    (value): boolean
}

interface ValidateMap {
    [index: string]: (units: { [index: string]: JQuery }, ctrl: ValidController) => void | ValidateChecker
}

interface ValidController {
    $element: JQuery
    units: UNITS

    reset(data?): ValidController

    values(): { [index: string]: any }

    valid(): boolean

    set(name: string, val: string, force?: boolean)

    onChange(handler: ValidChangeFactory): ValidController

    ready(handler?: (ele: JQuery, ctrl: ValidController) => void): ValidController
}

interface FormOption {
    target: string | Element
    validate?: ValidateMap
}


interface IImageWrapper {

    element: JQuery

    zIndex: number
    top: number
    left: number
    right: number
    bottom: number

    width: number
    height: number
    rotate: number

    getBoundingClientRect(): ClientRect

    adJust(W: number, H: number): this
}

interface IImageViewer {
    element: JQuery
    img: IImageWrapper

    enable(img: HTMLImageElement): this

    disable(): this
}

interface SpringPage<T> {
    content: T[]
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    size: number
    sort: {}
    totalElements: number
    totalPages: number
}


interface IPager {

    range: number[]

    before: number
    number: number
    after: number

    prev: number
    next: number

    totalPages: number
    links: number

    hasNext(): boolean

    hasPrev(): boolean

    move(current: number)

    pageInfo(exp?: string): string
}


interface IQueryString {
    reset(): this

    query(map: {}): string

    toString(): string
}




