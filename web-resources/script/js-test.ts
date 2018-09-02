import {HTML} from "../lib/core/html";
import createFragment = HTML.createFragment;
import htmlParser = HTML.htmlParser;
import {SelectCalendar} from "../lib/core/component/SelectCalendar";
import {$ready} from "../lib/core/core";

$ready(() => {
    document.body.innerHTML = SelectCalendar.create(2018, 8);
})