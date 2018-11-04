import {$ready} from "../lib/core/core";
import {Forms} from "../lib/core/form/Forms";
import {HTML} from "../lib/core/html";
import selectAll = HTML.selectAll;
import {_forEach, _map} from "../lib/core/_func/array";
import register from "./jinyeosoo/root/register";
import {DOM} from "../lib/core/dom";
import className = DOM.className;
import {carousel} from "../lib/core/component/carousel";


$ready(() => {

    let ctrl = carousel(document.querySelector('.carousel-inner'));

    ctrl.loop();

    document.getElementById('next').addEventListener('click', () => {
        ctrl.right();
    })

    document.getElementById('prev').addEventListener('click', () => {
        ctrl.left();
    })
});