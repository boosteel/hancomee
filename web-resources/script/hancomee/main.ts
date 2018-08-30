import {$ready} from "../../lib/core/core";
import {Selector} from "../../lib/core/dom/selector";
import {SPA} from "../../lib/core/spa";
import {List} from "./src/list";
import {DOM} from "../../lib/core/dom";
import className = DOM.className;
import {CModule} from "./src/calendar";


$ready(() => {


    Selector.select(document.body, (aside, main) => {

        let
            swap = (function (ele1, ele2) {

                let current = ele1, wait = ele2, temp;

                main.appendChild(ele1);
                main.appendChild(ele2);

                main.addEventListener('animationend', (e) => {
                    if(current === e.target) current.className = 'on';
                    else wait.className = '';
                })

                return function (target: HTMLElement) {
                    wait.innerHTML = '';
                    wait.appendChild(target);
                    current.className = 'page-out';
                    wait.className = 'page-in'

                    // swap
                    temp = wait;
                    wait = current;
                    return current = temp;
                }
            })(document.createElement('div'), document.createElement('div')),

            spa = new SPA({
                before() {
                    console.log('before');
                    main.className = 'load';
                },
                onChange(ele, e) {
                    swap(ele);
                },
                after() {
                    main.className = '';
                }
            })
                .register('list', List)
                .register('main', List)
                .register('calendar', CModule)
                .onHash();


    }, 'aside', 'main');


});