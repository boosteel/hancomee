

// typesciprt 에서 import dd from '.html' 을 가능하게 해준다.
declare module '*.html' {
    const value: string;
    export = value
}

declare function require(source: string);