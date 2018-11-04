import "../../lib/core/component/toggle";
import {$ready} from "../../lib/core/core";
import {SPA} from "../../lib/core/spa";
import {List} from "./src/list";
import {DOM} from "../../lib/core/dom";
import className = DOM.className;
import {CModule} from "./src/calendar";
import {HTML} from "../../lib/core/html";
import {View} from "./src/view";
import selectAll = HTML.selectAll;
import {Work, WorkMemo} from "./src/domain/Work";

let {forEach, map, reduce} = Array.prototype;

$ready(() => {


    selectAll(document.body,
        ['aside', 'main'],
        (body: HTMLBodyElement, aside, main) => {

        let
            // 페이지
            transfort = (function (ele1, ele2) {

                let current = ele1, wait = ele2, temp,
                    handler = (e) => {
                        if (current === e.target) current.className = 'on';
                        else {
                            wait.className = wait.textContent ='';
                        }
                    }

                main.appendChild(ele1);
                main.appendChild(ele2);

                main.addEventListener('animationend', handler)

                return function (target: HTMLElement) {
                    wait.appendChild(target);
                    current.className = 'page-out';
                    wait.className = 'page-in'

                    // swap
                    temp = wait;
                    wait = current;

                    return current = temp;
                }
            })(document.createElement('div'), document.createElement('div')),


            // 사이드 메뉴 불켜기
            asideMenu = (function (list: NodeListOf<HTMLLIElement>) {
                let names = map.call(list, (li) => li.firstElementChild.getAttribute('href').slice(1)),
                    len = names.length;

                return function (url) {
                    let i = 0;
                    for (; i < len; i++) {
                        if (names[i] === url) list[i].className = 'active';
                        else list[i].className = '';
                    }
                }
            })(aside.querySelectorAll('li')),

            spa = new SPA({
                defaultURL: 'list',
                before({pathname}: iSPA.Info) {
                    asideMenu(pathname);
                    main.className = 'load';
                    window.scrollTo(0, 0);
                },
                onChange(ele, e) {
                    transfort(ele);
                },
                after() {
                    main.className = '';
                }
            })
                .register('list', List)
                .register('main', List)
                .register('view', View)
                .register('calendar', CModule)
                .onHash();


    });

});