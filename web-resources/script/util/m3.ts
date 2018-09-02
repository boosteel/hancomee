import {$ready} from "../../lib/core/core";
import {Formats} from "../../lib/core/format";
import number = Formats.number;
import {HTML} from "../../lib/core/html";
import replaceHTML = HTML.replaceHTML;
import {Selector} from "../../lib/core/dom/selector";
import {DOM} from "../../lib/core/dom";
import createHTML = DOM.createHTML;
import select = Selector.select;
import byId = Selector.byId;
import compile = HTML.compile;


$ready(() => {

    select(document.body, function ($result, $unit, result, container, add) {

        let
            r_input_type = /input/i,
            r_num = /^\d+$/,
            r_input = /\d+-\d+/,

            r_group = {
                num: /[^\d]/g,
                size: /[^\d-]/g,
            },

            units = [],

            $$result = compile($result.innerText),

            refresh = () => {
                let count = 0,
                    n = units
                        .filter(v => v.valid())
                        .reduce((r, i) => {
                        count += i.count();
                        return r += i.compute();
                    }, 0);

                result.innerHTML = $$result({
                    count: count,
                    price: number(n)
                })
            },

            create = () => {
                select(createHTML($unit.innerText), function (price: HTMLInputElement,
                                                              size: HTMLInputElement, count: HTMLInputElement, remove) {

                    let ctrl = {
                        index: units.length,
                        count() {
                          return parseInt(count.value || '1');
                        },
                        valid() {
                            console.log(price.value, size.value);
                            return r_num.test(price.value) && r_input.test(size.value);
                        },
                        compute() {
                            let p = parseInt(price.value),
                                [_w, _h] = size.value.split(/-/),
                                w = parseInt(_w), h = parseInt(_h);
                            return (w * h / 1000000) * p * this.count();
                        }
                    }
                    container.appendChild(this);
                    units.push(ctrl);

                    remove.addEventListener('click', () => {
                        units.splice(units.indexOf(ctrl), 1);
                        ctrl = null;
                        container.removeChild(this);
                        refresh();
                    });

                }, '.price', '.size', '.count', '.remove')
            }

        container.addEventListener('keyup', (e) => {
            let target = <HTMLInputElement>e.target;
            if (r_input_type.test(target.tagName)) {
                target.value = target.value.replace(
                    r_group[target.getAttribute('data-regexp')], ''
                );
                refresh();
            }
        });

        add.addEventListener('click', () => create());
        create();

    }, byId('result-template'), byId('unit-template'), '#result', '#values', '#add');

});