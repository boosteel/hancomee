import {HTML} from "../html";
import {Calendar} from "../calendar";
import {StringBuffer} from "../support/StringBuffer";

import htmlParser = HTML.htmlParser;

let [$temp, {td, year, month}] = htmlParser(require("./SelectCalendar.html"));


export class SelectCalendar {


}

export namespace SelectCalendar {


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
            $result = {};

        $result['year'] = year({val: y});
        $result['month'] = month({val: m});

        Calendar.toArray(y, m).forEach(row => {

            buf.append('<tr>');
            row.forEach(col => {
                let {date: current} = col;
                buf.append(td({
                    className: d === current ? 'current' : '',
                    val: current
                }))
            });
            buf.append('</tr>');
        });

        $result['tr'] = buf.toString();


        return $temp($result);
    }


}