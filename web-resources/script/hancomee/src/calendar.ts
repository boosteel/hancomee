import {HTML} from "../../../lib/core/html";
import {GenericModule} from "./genericModule";
import {Calendar, Month} from "../../../lib/core/calendar";
import {$extend} from "../../../lib/core/core";
import {StringBuffer} from "../../../lib/core/support/StringBuffer";
import {Events} from "../../../lib/core/events";
import htmlParser = HTML.htmlParser;
import select = HTML.select;

type NormalizeValues = { [index: string]: DATA[] }

let
    dummyArray = [],
    {format, isodate} = Calendar,
    TYPES = ['알림', '작업', '메모'];


class CalSearch {

    $today = new Calendar()
    date: string
    private _y: number
    private _m: number

    get y() {
        this.check();
        return this._y;
    }

    get m() {
        this.check();
        return this._m;
    }


    private check() {
        if (!this.date) {
            let date = new Date();
            this.date = date.getFullYear() + '-' + (date.getMonth() + 1)
        }
        if (!this._y) {
            let [y, m] = this.date.split('-');
            this._y = parseInt(y);
            this._m = parseInt(m) - 1;
        }
    }
}


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
class CalendarManager {

    private _idMap: { [index: string]: DATA } = {}
    private _dateMap: { [index: string]: DATA[] } = {}

    constructor(private $com: iParseResult) {

    }

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

    // 해당 달력의 칸을 갱신한다. ex) 추가/수정
    refresh(data: Date)
    refresh(isodate: string)
    refresh(v) {
        let iso = typeof v === 'string' ? v : isodate(v);
        document.getElementById('date-' + iso).innerHTML = this.contents(iso);
        return this;
    }


    // 달력을 그린다.
    table(array: Calendar[][], y: number, m: number, today: Calendar) {
        let
            [$table, {td}] = this.$com,
            {month: tM, date: tD} = today,
            buf = new StringBuffer();

        // ① 해당 월에 대한 array을 받아와서
        array.forEach(row => {

            buf.append('<tr>');

            buf.append(
                row.map((day: Calendar, i) => {

                    let
                        {isodate, month, date} = day,
                        isCurrent = month === m,
                        c = isCurrent ? ' current' : '';

                    if (tM === month && tD === date) c += ' today';

                    return td({
                        index: i,
                        className: c,
                        isodate: isodate,
                        num: isCurrent ? date : (month + 1) + '/' + date,
                        contents: this.contents(isodate)
                    })
                }));

            buf.append('</tr>');
        });

        return $table({tr: buf.toString()});
    }

    contents(isodate: string) {
        let [, {contents}] = this.$com, buf = new StringBuffer();
        this.byDate(isodate).forEach(v => buf.append(contents(v)));
        return buf.toString();
    }
}


export class CModule extends GenericModule<CalSearch> {

    handlers: Array<(param: CalSearch) => Promise<any> | void> = []

    constructor() {
        super('calendar', CalSearch);
    }

    $init(container, frag, templates) {

        let {handlers} = this, l = handlers.length;

        // 표그리기
        handlers[l++] = select(frag, (frag, main, screen) => {


            // main 엘리먼트 이벤트
            Events.propertyMap(main, 'click', {
                view() {
                    screen.className = 'on';
                }
            });

            // 스크린 끄기
            screen.addEventListener('click', (e) => {
                if(e.target === screen)
                    screen.className = '';
            })

            let render = new CalendarManager(htmlParser(templates.table));

            return (param: CalSearch) => {
                let {y, m} = param,
                    array = Calendar.toArray(y, m),
                    sd = array[0][0].isodate, ed = array[array.length - 1][6].isodate;

                return new Promise((o, x) => {
                    let xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                let json = <any[]>JSON.parse(xhr.responseText || '[]');
                                main.innerHTML = render
                                    .setValues(json.map(v => new DATA(v)))
                                    .table(array, y, m, param.$today);
                                o();
                            }
                        }
                    }
                    xhr.open('GET', '/calendar/get?sd=' + sd + '&ed=' + ed, true);
                    xhr.send(null);
                });
            };
        }, 'main', frag.getElementById('screen'));

        // nav 업데이트
        handlers[l++] = select(frag.querySelector('nav'), function (nav, r, c) {
            let temp: Month;

            this.addEventListener('click', (e) => {
                let target = <HTMLElement>e.target;
                if (target.hasAttribute('data-move')) {
                    location.hash = 'calendar?date=' + temp.move(
                        parseInt(target.getAttribute('data-move'))
                    ).toString();
                }
            });

            return (param: CalSearch) => {
                r.textContent = param.$today.isodate;
                temp = new Month(param.y, param.m);
                c.textContent = temp.toString();

            };
        }, '#refresh-btn', '#date-current');

    }

    $load(param: CalSearch) {
        return Promise.all(this.handlers.map(h => h(param)));
    }

    close() {

    }
}