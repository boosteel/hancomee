import {HTML} from "../lib/core/html";
import {$ready} from "../lib/core/core";
import {FormValue} from "../lib/core/form/FormValue";
import {DOM} from "../lib/core/dom";
import {Events} from "../lib/core/events";
import {WorkItem} from "./hancomee/src/domain/Work";
import createFragment = HTML.createFragment;
import className = DOM.className;
import select = HTML.select;
import byId = HTML.byId;
import {Access} from "../lib/core/access";
import primitive = Access.primitive;
import {Watcher} from "../lib/core/support/Watcher";


$ready(() => {

    let
        a = [1, 2, 3],
        d = {
            magic: 1,
            m: {
                name: 1
            },
            a: a,
            u: {
                a: {
                    d: 1
                }
            }
        }, c = {
            magic: 2,
            m: {
                name: 2
            },
            u: {
                a: {
                    d: {
                        f : {
                            c: 1
                        }
                    }
                }
            }
        }


    let w = new Watcher();
    w.register('u.a.d.f.c', (a, b) => {
        console.log(a, b);
    })

    w.apply(d);

    a[1] = 1
    c['a'] = a

    w.apply(c);


})