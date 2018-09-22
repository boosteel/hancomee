
interface ServerData<T> {

    state: number
    page: number
    size: number
    totalElements: number
    totalPages: number
    values: T[]

    count: number[]
    price: number[]
}

interface iWorkData {
    work: any
    items: any[]
}