import {$ready} from "../../lib/core/core";
import {HTML} from "../../lib/core/html";
import selectAll = HTML.selectAll;
import "../../lib/core/component/toggle";
import {Calendar} from "../../lib/core/calendar";
import {SelectCalendar} from "../../lib/core/component/SelectCalendar";

$ready(() => {


    selectAll('.form', ['.date', '.date-table'],
        (form: HTMLElement, date: HTMLInputElement, dateTable: HTMLElement) => {

            let datetime = new Date(),
                calendar = new SelectCalendar(datetime);
            date.value = Calendar.isodate(datetime);
            dateTable.appendChild(calendar.element);
            calendar.onSelect = (v) => {
                console.log(v);
                date.value = v;
                date.click();
            };
        });


});