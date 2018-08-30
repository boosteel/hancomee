import {$extend, $ready, __makeArray} from "../lib/core/core";
import {Calendar, Month} from "../lib/core/calendar";
import {Search} from "../lib/core/location";
import {DOM} from "../lib/core/dom";
import className = DOM.className;
import {Events} from "../lib/core/events";
import {Branch} from "../lib/core/support/Branch";
import {HTML} from "../lib/core/html";
import replaceHTML = HTML.replaceHTML;

type NormalizeValues = { [index: string]: DATA[] }

let
    dummyArray = [],
    {format, isodate} = Calendar,
    TYPES = ['알림', '작업', '메모'],
    html = {
        data: '<div class="content">' +
        '<div class="type type-{{type}}">{{typeName}}</div>' +
        '<div class="title">' +
        '<span data-handler="view" data-handler-value="{{id}}">{{title}}</span>' +
        '</div>' +
        '</div>',
        cell: '<div class="calendar-cell{{class}}" data-col="{{index}}">' +
        '<span class="number" data-handler="add" data-handler-value="{{isodate}}">{{num}}</span>' +
        '<div id="date-{{isodate}}" class="contents">{{html}}</div>' +
        '</div>',
        type: '<input type="radio" name="type" class="form-check-input" id="type-{{i}}">' +
        '<label class="form-check-label" for="type-{{i}}">{{name}}</label>'
    };

interface DATA {
    id: number
    type: number
    date: Date
    writeTime: Date
    title: string
    body: string
}

/*
 *  데이터 빈이자 CURD를 담당한다.
 */
class DATA {


    title = ''
    body = ''

    get typeName() {
        return TYPES[this.type];
    }

    constructor(data) {
        if (data instanceof Date) this.date = data;
        else this.setData(data);
    }

    setData(data) {
        $extend(this, data, DATA.extend);
        return this;
    }

    save(): Promise<this> {
        return new Promise<this>((o, x) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    o(this);
                }
            }
            xhr.open('PUT', '/calendar/save');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(this));
        });
    }

    remove(): Promise<this> {
        return new Promise<this>((o, x) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    o(this);
                }
            }
            xhr.open('DELETE', '/calendar/delete/' + this.id);
            xhr.send(null);
        });
    }

    // 각 DATA의 타이틀 html
    html() {
        return replaceHTML(html.data, this);
    }

    json() {
        return $extend({}, this, DATA.json);
    }
}

namespace DATA {

    // 웹에서 사용할 데이터로 변환
    export let extend = {
        date(v, t: DATA) {
            t.date = typeof v === 'number' ? new Date(v) : v;
        },
        writeTime(v, t: DATA) {
            t.writeTime = typeof v === 'number' ? new Date(v) : v;
        },
    }

    // DB에 저장할 데이터로 변환
    export let json = {
        date(v, t) {
            t.date = Calendar.isodate(v);
        },
        writeTime(v, t) {
            t.writeTime = Calendar.format(v, 'yyyy-MM-dd HH:mm:ss');
        },
        typeName: false
    }
}



/*
 *  데이터를 관리하는 DataMap
 */
class CalendarData {


    private _idMap: { [index: string]: DATA }
    private _dateMap: { [index: string]: DATA[] }

    // 목록을 받아서 ①id ②date 로 각각 구분해 자료구조화 한다.
    setValues(values: DATA[]) {
        let dateMap: NormalizeValues = this._dateMap = {},
            idMap = this._idMap = {},
            v: DATA,
            l = values.length, key: string, array;

        while (l-- > 0) {
            v = values[l];
            if (!(array = dateMap[key = Calendar.isodate(v.date)]))
                dateMap[key] = array = []
            array.push(v);
            idMap[v.id] = v;
        }
        return this;
    }

    add(data: DATA) {
        if (!this._idMap[data.id]) {
            let iso = isodate(data.date),
                array = this._dateMap[iso] || (this._dateMap[iso] = []);
            array.push(data);
            this._idMap[data.id] = data;
        }
        return this;
    }

    remove(data: DATA) {
        let iso = isodate(data.date),
            array = this._dateMap[iso];
        array.splice(array.indexOf(data), 1);
        delete this._idMap[data.id];
        return this;
    }


    byId(id) {
        return this._idMap[id];
    }

    byDate(isodate): DATA[] {
        return this._dateMap[isodate] || dummyArray;
    }

    createLines(isodate): string {
        let a = this._dateMap[isodate];
        return a ? a.map(v => v.html()).join('') : '';
    }

    // 해당 달력의 칸을 갱신한다. ex) 추가/수정
    refresh(data: Date)
    refresh(isodate: string)
    refresh(v) {
        let iso = typeof v === 'string' ? v : isodate(v);
        document.getElementById('date-' + iso).innerHTML = this.createLines(iso);
        return this;
    }

    // 시작일과 마지막일을 기준로 여기서 ajax가 진행된다.
    // 달력을 그린다.
    render(array: Calendar[][], y: number, m: number, today: Date) {

        let tM = today.getMonth(), tD = today.getDate();

        // ① 해당 월에 대한 array을 받아와서
        return array.map(month => {

            // ② 일주일마다 한 줄씩 정렬해서
            return '<div class="calendar-row">' +

                // ③ 각 일마다 데이터를 겅리한다.
                month.map((day: Calendar, i) => {

                    let
                        {isodate, month, date} = day,
                        isCurrnet = month === m,
                        c = isCurrnet ? ' current' : '';

                    if(tM === month && tD === date) c += ' today';

                    return replaceHTML(html.cell, {
                        index: i,
                        class: c,
                        isodate: isodate,
                        num: isCurrnet ? date : (month + 1) + '/' + date,
                        html: this.createLines(isodate)
                    })

                }).join('') + '</div>';

        }).join('')
    }
}

class CalendarForm extends CalendarData {

    date: string
    data: DATA

    _submit: boolean

    types: HTMLElement
    typesEle: HTMLInputElement[]

    content: HTMLElement
    ctrl: HTMLElement
    title: HTMLInputElement
    body: HTMLTextAreaElement
    datetime: HTMLElement
    writeTime: HTMLElement

    constructor(public screen: HTMLElement) {

        super();

        // ① 엘리먼트의 id를 key로 잡아서 property로 등록
        Branch.$tour(screen, this);

        let
            {ctrl, title, body, types, writeTime, content} = this,
            handlers = {
                modify: () => {
                    this.form(true);
                },
                cancel: () => {
                    // 등록하는 상황이면, 취소버튼을 누르면 그냥 screen을 닫는다.
                    if (this.data.id == null) this.off();
                    else this.form(false);
                },
                remove: () => {

                    let {data, data: {date}} = this;

                    if (confirm(data.title + '\n\n정말 삭제하시겠습니까?')) {
                        let xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                this.remove(data);
                                this.refresh(date);
                                this.off();
                            }
                        };
                        xhr.open('DELETE', 'calendar/' + data.id, true);
                        xhr.send(null);
                    }

                },
                submit: () => {

                    if(!this._submit) return;

                    let {data} = this;

                    data.type = this.getType();
                    data.title = title.value;
                    data.body = body.value;
                    data.writeTime = new Date();

                    let xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            data.id = parseInt(xhr.responseText);
                            this.add(data).refresh(data.date).off();
                        }
                    };
                    xhr.open('PUT', 'calendar', true);
                    xhr.setRequestHeader('Content-Type', 'application/json')
                    xhr.send(JSON.stringify(data.json()));
                }
            },

            /*
             *   ① 데이터가 빠짐 없이 기입
             *   ② 데이터가 변경되었을때
             *
             *   위 조건이 성립할때만 isSubmit 클래스를 붙여준다.
             */
            valid = () => {
                let {data} = this,
                    type = this.getType(),
                    tVal = title.value.trim(), bVal = body.value.trim();

                if (!tVal || type === -1)
                    return this.isSubmit(false)

                if (data) {
                    this.isSubmit(data.title !== tVal || data.body !== bVal || data.type !== type)
                }
            };

        // 끄기
        screen.addEventListener('click', (e) => {
            if (e.target === screen) this.off();
        })

        ctrl.addEventListener('click', (e) => {
            let val = handlers[(<HTMLElement>e.target).getAttribute('data-ctrl')];
            val && val();
        });

        // <input type="radio"> types 설정
        types.innerHTML = TYPES.map((t, i) => replaceHTML(html.type, {i: i, name: t}))
            .join('');
        this.typesEle = __makeArray(types.querySelectorAll('input'));

        types.addEventListener('change', valid)
        title.addEventListener('keyup', valid);
        body.addEventListener('keyup', valid);
    }

    form(flag: boolean) {
        let {content, title, body} = this;

        this.isModify(flag);

        if (flag) {
            title.removeAttribute('disabled');
            body.removeAttribute('disabled');
        } else {
            title.setAttribute('disabled', '');
            body.setAttribute('disabled', '');
        }
    }

    on(data: DATA) {
        let {title, body} = this;

        this.data = data;
        this.date = isodate(data.date);
        this.datetime.textContent = format(data.date, 'yyyy-MM-dd (E)');
        this.writeTime.textContent = data.writeTime ? format(data.writeTime, 'yyyy-MM-dd(E) HH:mm:ss') : '';

        title.value = data.title;
        body.value = data.body;

        this.setType(data.type);
        this.isNew(data.id == null);
        this.form(data.id == null);
        this.isSubmit(false);
        className(this.screen, 'on', true);
    }

    off() {
        className(this.screen, 'on', false);
    }

    setType(v: number) {
        this.typesEle.forEach((t, i) => t.checked = v === i);
        return this;
    }

    getType() {
        let {typesEle, typesEle: {length}} = this;
        while (length-- > 0)
            if (typesEle[length].checked) return length;
        return -1;
    }

    isModify(flag = true) {
        className(this.screen, 'form', flag);
    }

    isNew(flag = true) {
        className(this.screen, 'isNew', flag);
    }

    isSubmit(flag = true) {
        className(this.screen, 'isSubmit', this._submit = flag);
    }

}


class CalSearch extends Search {
}

$ready(() => {

    let
        main = <HTMLElement>document.querySelector('main'),
        screen = new CalendarForm(document.getElementById('screen')),

        refreshBtn = <HTMLAnchorElement>document.getElementById('refresh-btn'),

        prev = <HTMLAnchorElement>document.getElementById('date-prev'),
        current = <HTMLButtonElement>document.getElementById('date-current'),
        next = <HTMLAnchorElement>document.getElementById('date-next'),

        // click event handler
        handler = {
            view(v) {
                screen.on(screen.byId(v));
            },
            add(v) {
                screen.on(new DATA(new Date(v)));
            }
        },

        // 해시값에 따라 달력 갱신
        run = () => {

            // #yyyy-M
            let
                today = new Date(),
                key = location.hash.slice(1) || Calendar.format(new Date(), 'yyyy-M'),

                [_y, _m] = key.split(/[^\d]/),
                month = new Month(parseInt(_y), parseInt(_m) - 1),
                array = month.toArray(), l = array.length - 1,
                query = 'sd=' + array[0][0].isodate + '&ed=' + array[l][6].isodate,
                xhr = new XMLHttpRequest();


            // today버튼 갱신
            refreshBtn.innerText = format(today, 'yyyy-MM-dd (E)');
            refreshBtn.href = '#' + format(today, 'yyyy-M');

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {

                    // 버튼 갱신
                    prev.href = '#' + month.move(-1).toString();
                    current.textContent = month.toString();
                    next.href = '#' + month.move(1).toString();

                    // 서버에서 받아온 데이터 변환
                    screen.setValues(
                        JSON.parse(xhr.responseText || '[]')
                            .map(v => new DATA(v))
                    );

                    // 새로운 달력 html 주입
                    main.innerHTML = screen.render(array, month.year, month.month, today);

                }
            }
            xhr.open('GET', '/calendar/get?' + query, true);
            xhr.send(null);
        }

    Events.eventWorks(main, 'click', handler);

    window.addEventListener('hashchange', run);
    run();



});