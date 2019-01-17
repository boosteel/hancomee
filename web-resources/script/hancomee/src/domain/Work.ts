import {$extend} from "../../../../lib/core/core";
import {_reduce} from "../../../../lib/core/_func/array";
import {_datetime} from "../../../../lib/core/_func/datetime";


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

function $post(url: string, data): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                else error(xhr);
            }
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    });
}

function $delete(url: string): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve();
                else error(xhr);
            }
        }
        xhr.open('DELETE', url, true);
        xhr.send(null);
    });
}


let
    $$extend = {
        activetime(v) {
            if (!v) return null;
            return v instanceof Date ? v : new Date(v)
        },
        datetime(v) {
            if (!v) return null;
            return v instanceof Date ? v : new Date(v)
        },
        updatetime(v) {
            if (!v) return null;
            return v instanceof Date ? v : new Date(v)
        },

        // list용
        customer(this: Work, v) {
            this.customer = new Customer(v);
        },

        refs(this: Work, v: any[]) {
            this.refs = v.map(a => new WorkFile(a));
        },
        print(this: WorkItem, v: any[]) {
            this.print = v.map(a => new WorkFile(a));
        },


        // work용
        memo(v) {
            if (Array.isArray(v))
                this.memo = v.map(a => new WorkMemo(a).setWork(this));
            else this.memo = v;
        },
        uuid(this: Work, v) {
            // 2018-0600442 ==> /2018/06/00442
            let [y, m] = v.split(/-/);
            this.path = y + '/' + m.substring(0, 2) + '/' + m.substring(2);
            this.uuid = v;
        },
    },

    // 객체를 json data로 변경할때
    $$json = (function () {
        let $$ = {
            activetime(v) {
                return _datetime(v);
            },
            datetime(v) {
                return _datetime(v)
            },
            updatetime(v) {
                return _datetime(v)
            },
            // work객체는 work_id로 바꾼다.
            work(v: Work) {
                v && (this['work_id'] = v.id);
            },
            // draft, print는 json 변환에는 제외시킨다.
            print: false,
            draft: false
        }

        return (data) => $extend({}, data, $$);
    })();


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
    refs: WorkFile[] = []
    memo: WorkMemo[]

    img: WorkFile

    path: string

    constructor(data?) {
        data && $extend(this, data, $$extend);
    }

    addRef(v: WorkFile) {
        this.refs.push(v);
        return this;
    }
}

export namespace Work {

    export let $state = '작업대기 시안검토 시안완료 제작중 입고 납품 완료'.split(' ');

    export interface ViewData {
        work: Work
        items: WorkItem[]
    }

    export function stateStr(num: number | Work) {
        return $state[typeof num === 'number' ? num : num.state];
    }

    // 리스트 로딩
    export function list(query: string): Promise<ServerData<Work>> {
        return $get('/hancomee/list?' + query).then((e: ServerData<any>) => {
            e.contents = e.contents.map(a => {
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
            let work = new Work(data.work);
            return {
                work: work,
                items: data.items.map(item => new WorkItem(item).setWork(work))
            }
        })
    }
}

export class WorkMemo {
    id?: number
    datetime: Date
    value: string

    work: Work

    constructor(data?) {
        data && $extend(this, data, $$extend);
    }

    setWork(work: Work) {
        this.work = work;
        return this;
    }
}

/*
 * 메모 입출력은 그냥 간단하게 하자
 */
export namespace WorkMemo {

    export function save(workId: number, memo: WorkMemo): Promise<WorkMemo> {
        return $post('/hancomee/db/memo/' + workId, $$json(memo))
            .then((id) => {
                memo.id = id;
                return memo;
            });
    }

    export function remove(memo: WorkMemo): Promise<any> {
        return $delete('/hancomee/db/memo/' + memo.id);
    }
}

//********************** 작업 세부내역 **********************//
export class WorkItem {
    id: number

    work: Work
    // requried
    subject: string

    count = 0
    datetime: Date
    detail = ''
    memo = ''
    price = 0
    total = 0
    vat = 0
    priority = 0

    draft: WorkFile[] = []
    print: WorkFile[] = []

    constructor(data?) {
        data && $extend(this, data, $$extend);
    }

    setWork(work: Work) {
        this.work = work;
        return this;
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

export namespace WorkItem {
    export function save(v, workId): Promise<number> {
        return $post('/hancomee/db/item/' + workId, $$json(v));
    }

    export function remove(v: WorkItem): Promise<any> {
        return $delete('/hancomee/db/item/' + v.id);
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

    setId(id: number) {
        this.id = id;
        return this;
    }

}

export namespace Customer {
    export function save(customer: Customer) {
        return $post('/hancomee/db/customer', $$json(customer))
            .then((id) => customer.setId(id))
    }

}


export class WorkFile {
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

export namespace WorkFile {




    // 서버 송출하는 upload 진행도가 전체에서 차지할 비율
    let up = .4,
        send = 1 - up,
        rr = 100 * up;

    // uuid값 받아옴과 동시에 서버에 progressMap 생성
    function $get(progressId: string)
    function $get()
    function $get(id?) {
        return new Promise((o, x) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/upload/progress' + (id ? '/' + id : ''));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log('돼써!!!')
                        o(id ? parseInt(xhr.responseText) : xhr.responseText);
                    }
                }
            }
            xhr.send(null)
        });
    }

    // File Upload Logic
    function $upload(data: FormData, handler) {


        // ① 고유 키를 받아온다.
        return $get().then((id) => {

            let
                total = 0,
                time = 10,
                xhr = new XMLHttpRequest(),

                // 서버측 다운로드 경과
                tHandler = () => {
                    $get(id).then((d) => {
                        if (total !== -1 && total !== d) {
                            handler.loading(rr + Math.floor(d / total * 100 * send));
                            setTimeout(tHandler, time);
                        } else {
                            handler.loading(100);
                        }
                    })
                };


            // 서버 send progress
            xhr.upload.onprogress = (e: ProgressEvent) => {
                handler.loading(Math.floor(e.loaded / e.total * 100 * up));
            }

            xhr.upload.onloadend = (e: ProgressEvent) => {
                handler.loading(Math.floor(e.loaded / e.total * 100 * up));
                total = e.total;
                setTimeout(tHandler, time);
            }

            return new Promise((o, x) => {
                xhr.open('POST', '/upload/file/' + id);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            total = -1;
                            o(id);
                        }
                    }
                }
                xhr.send(data);
            });
        })
    }

    export function uploadFile(path: string, files: ArrayLike<File>, handler) {

        return _reduce(files, (promise, file, i) => {
            return promise.then(() => {
                let formData = new FormData();
                formData.append('path', 'D:/work/' + path);
                formData.append('file', file);

                handler.start(file, i);

                return $upload(formData, handler).then((id) => handler.done(file, id, i));
            })
        }, Promise.resolve()).then(() => handler.complete());
    }


    export function saveFile(type: string, ownId: number, workFile: WorkFile): Promise<number> {
        return $post('/hancomee/db/' + type + '/' + ownId, $$json(workFile));
    }
    
    export function removeFile(type: string, id: number): Promise<any> {
        return $delete('/hancomee/db/' + type + '/' + id);
    }
}