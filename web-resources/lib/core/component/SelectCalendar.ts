import {HTML} from "../html";
import {Calendar, Month} from "../calendar";
import {StringBuffer} from "../support/StringBuffer";

import htmlParser = HTML.htmlParser;

let [$temp, {td, year, month}] = htmlParser(require("./SelectCalendar.html"));


export class SelectCalendar {

    element = document.createElement('div');
    private year: number
    private month: number
    private date: number

    onSelect

    constructor(date: Date)
    constructor(year: number, month: number, date?: number)
    constructor(year, month?, date?) {

        if(year instanceof Date) {
            date = this.date = year.getDate();
            month = this.month = year.getMonth();
            year = year.getFullYear();
        }

        this.element.addEventListener('click', (e) => {
            let target = <HTMLElement>e.target;
            if (target.hasAttribute('data-move')) {
                let [y, m] = target.getAttribute('data-move').split('-');
                this.create(parseInt(y), parseInt(m) - 1);
                e.stopPropagation();
            }
            else if (target.hasAttribute('data-value')) {
                this.onSelect && this.onSelect(target.getAttribute('data-value'));
            }
        });
        this.create(year, month, date);
    }


    create(date: Date)
    create(calendar: Calendar)
    create(year: number, month: number, date?: number)
    create(y, m?, d?) {
        this.element.innerHTML = SelectCalendar.create(y, m, d);
    }
}

export namespace SelectCalendar {


    // month는 0부터
    // date까지 들어오면 그 날짜를 선택한다.
    export function create(date: Date)
    export function create(calendar: Calendar)
    export function create(year: number, month: number, date?: number)
    export function create(y, m?, d?) {

        if (typeof y !== 'number') {
            m = y.getMonth();
            d = y.getDate();
            y = y.getFullYear();
        }

        let buf = new StringBuffer(),
            M = new Month(y, m),
            $result = {};

        $result['year'] = year({
            val: y,
            prev: (y - 1) + '-' + (m + 1),
            next: (y + 1) + '-' + (m + 1)
        });

        $result['month'] = month({
            val: m,
            prev: M.move(-1).toString(),
            next: M.move(1).toString()
        });

        Calendar.toArray(y, m).forEach(row => {

            buf.append('<tr>');
            row.forEach(col => {
                let {date: current, month: mm} = col,
                    className = mm === m ? 'current' : '';

                if (current === d) className = 'today';

                buf.append(td({
                    className: className,
                    val: col.isodate,
                    date: current
                }))
            });
            buf.append('</tr>');
        });

        $result['tr'] = buf.toString();


        return $temp($result);
    }


}