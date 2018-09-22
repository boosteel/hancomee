import {$extend} from "../../../../lib/core/core";

let
    $$extend = {
        activetime(v) {
            return new Date(v)
        },
        datetime(v) {
            return new Date(v)
        },
        updatetime(v) {
            return new Date(v)
        },

        // list용
        customer(this: Work, v) {
            this.customer = new Customer(v);
        },

        ref(this: Work, v: any[]) {
            this.ref = v.map(a => new WorkFile(a));
        },
        print(this: WorkItem, v: any[]) {
            this.print = v.map(a => new WorkFile(a));
        },


        // work용
        memo(v) {
            if (Array.isArray(v))
                this.memo = v.map(a => new WorkMemo(a));
            else this.memo = v;
        },
        uuid(this: Work, v) {
            // 2018-0600442 ==> /2018/06/00442
            let [y, m] = v.split(/-/);
            this.path = y + '/' + m.substring(0, 2) + '/' + m.substring(2);
            this.uuid = v;
        },
    }

function $get(url: string): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                else error(xhr);
            }
        }
        xhr.open('GET', url, true);
        xhr.send(null);
    });
}


//********************** 작업 그룹 **********************//
export class Work {
    id: number
    uuid: string

    state: number
    title: string
    text: string

    datetime: Date
    updatetime: Date
    activetime: Date

    price: number
    total: number
    vat: number

    file_len: number
    item_len: number
    memo_len: number

    customer: Customer
    ref: WorkFile[] = []
    memo: WorkMemo[]

    img: WorkFile

    path: string

    constructor(data?) {
        data && $extend(this, data, $$extend);
    }

    addRef(v: WorkFile) {
        this.ref.push(v);
        return this;
    }
}

export namespace Work {

    export interface ViewData {
        work: Work
        items: WorkItem[]
    }

    // 리스트 로딩
    export function list(query: string): Promise<ServerData<Work>> {
        return $get('/hancomee/list?' + query).then((e: ServerData<any>) => {
            e.values = e.values.map(a => {
                let work = new Work(a);

                // 이미지가 같이 담겨온다.
                work.img = new WorkFile(a.draft);
                return work;
            });
            return e;
        });
    }

    // 전체 로딩
    export function get(workUUID: string): Promise<ViewData> {
        return $get('/hancomee/view/' + workUUID).then((data: iWorkData) => {
            return {
                work: new Work(data.work),
                items: data.items.map(item => new WorkItem(item))
            }
        })
    }
}

export class WorkMemo {
    id: number
    datetime: Date
    value: string

    constructor(data) {
        data && $extend(this, data, $$extend);
    }
}

//********************** 작업 세부내역 **********************//
export class WorkItem {
    id: number
    count: number
    datetime: Date
    detail: string
    memo: string
    price: number
    subject: string
    total: number
    vat: number
    priority: number

    draft: WorkFile[] = []
    print: WorkFile[] = []

    constructor(data?) {
        data && $extend(this, data, $$extend);
    }

    addDraft(v: WorkFile) {
        this.draft.push(v);
        return this;
    }

    addPrint(v: WorkFile) {
        this.print.push(v);
        return this;
    }

}


//********************** 거래처 **********************//
export class Customer {
    id: number
    address: string
    biz_con: string
    biz_num: string
    biz_type: string
    datetime: Date
    email: string
    fax: string
    memo: string
    mobile: string
    name: string
    owner: string
    tel: string

    constructor(data?) {
        data && $extend(this, data, $$extend);
    }

}


class WorkFile {
    id: number

    datetime: Date

    original_name: string
    save_name: string
    filetype: string
    size: number

    content_type: string

    constructor(data?) {
        data && $extend(this, data, $$extend);
    }
}