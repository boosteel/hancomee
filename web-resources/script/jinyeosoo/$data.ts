import {_dateFormat} from "../../lib/core/_func/datetime";
import {$extend} from "../../lib/core/core";


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
    skinType = '건성 주성 지성 복합성 민감성 기타'.split(' '),
    bloodType = 'A B O AB'.split(' '),
    accountType = '카드 현금 기타'.split(' '),
    searchType = '페이스북 인스타그램 블로그 카페 지인소개 광고매체 기타'.split(' '),

    $disassemble = {

        datetime(v) {
            if (v)
                this.datetime = typeof v === 'number' ? new Date(v) : v;
        },
        date(v) {
            this.date = typeof v === 'number' ? new Date(v) : v;
        }
    },
    $assemble = {
        datetime(v) {
            return v ? _dateFormat(v, 'yyyy-MM-dd HH:mm:ss') : void 0;
        },
        date(v) {
            return v ? _dateFormat(v, 'yyyy-MM-dd') : void 0;
        }
    };


class Data {
    id: number
    datetime: Date

    constructor(data?) {
        this.reset(data)
    }

    setId(id: number) {
        this.id = id;
        return this;
    }

    reset(data) {
        data && $extend(this, data, $disassemble);
        return this;
    }

    toJSON() {
        return $extend({}, this, $assemble);
    }
}

export class Customer extends Data {

    get $sex() {
        return this.sex ? '남성' : '여성';
    }

    get $married() {
        return this.married ? '기혼' : '미혼';
    }

    get $skin() {
        return skinType[this.skin];
    }

    get $blood() {
        return bloodType[this.blood];
    }

    get $search() {
        return searchType[this.search];
    }

    name: string
    birth: string

    sex: boolean
    married: boolean

    job: string
    address: string
    mobile: string
    tall: number
    weight: number

    blood: number
    skin: number
    operation: string


    account_total: number
    account_count: number

    search: number


    // 설문조사
    text1: string
    text2: string

    memo: string

}

export namespace Customer {

    type searchResult = { id: number, name: string, mobile: string, birth: string }


    export function list(): Promise<Customer[]> {
        return $get('/jinyeosoo/customers').then(data => {
            return data.map(d => new Customer(d));
        })
    }

    export function search(key: string): Promise<searchResult[]> {
        return $get('/jinyeosoo/customer/' + key);
    }

    export function save(customer: Customer): Promise<number> {
        return $post('/jinyeosoo/customer', customer.toJSON());
    }

    export function get(id): Promise<Customer> {
        return $get('/jinyeosoo/customer/get/' + id).then(r => {
            return new Customer(r);
        });
    }

}


export class Managing extends Data {
    customer_id: number
    date: Date
    manager: string
    memo: string

    setCustomer(customer: Customer) {
        this.customer_id = customer.id;
        return this;
    }
}

export namespace Managing {

    export function list(customer_id) {
        return $get('/jinyeosoo/managing/' + customer_id).then(values => values.map(v => new Managing(v)));
    }

    export function save(value: Managing) {
        return $post('/jinyeosoo/managing', value.toJSON());
    }

    export function remove(id) {
        return $delete('/jinyeosoo/managing/' + id);
    }
}


export class Account extends Data {

    get $type() {
        return accountType[this.account_type];
    }

    customer_id: number
    date: Date
    account_type: number
    money: number
    memo: string

    setCustomer(customer: Customer) {
        this.customer_id = customer.id;
        return this;
    }
}

export namespace Account {
    export function list(customer_id) {
        return $get('/jinyeosoo/account/' + customer_id).then(values => values.map(v => new Account(v)));
    }

    export function save(value: Account) {
        return $post('/jinyeosoo/account', value.toJSON());
    }

    export function remove(customerId, id) {
        return $delete('/jinyeosoo/account/' + customerId + '/' + id);
    }
}