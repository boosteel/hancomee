
interface ServerData<T> {

    state: number
    page: number
    size: number
    totalElements: number
    totalPages: number
    contents: T[]

    count: number[]
    price: number[]
}

interface iWorkData {
    work: any
    items: any[]
}