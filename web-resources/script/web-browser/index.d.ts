// *************************  Data Type  ************************* //

interface iMedia {
    path: string
    filename: string
    filetype: string
    filesize: number
    rotate: number
}

// *************************  Use Dom Element  ************************* //


/*
 *
 */
interface iMediaElement {

    element: HTMLElement
    isLoad: boolean
    mediaWidth: number
    mediaHeight: number

    render(rotate: number): this

    onScreen(): this
    offScreen(): this
}

