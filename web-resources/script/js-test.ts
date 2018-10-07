import {HTML} from "../lib/core/html";
import {$ready} from "../lib/core/core";
import {DOM} from "../lib/core/dom";
import {Access} from "../lib/core/access";
import select = HTML.select;
import createTemplate = HTML.createTemplate;
import createFragment = HTML.createFragment;
import htmlParser = HTML.htmlParser;
import {Work} from "./hancomee/src/domain/Work";
import nthChildren = HTML.nthChildren;


$ready(() => {


    type M<T> = {

        select: string[]
        after: (t: T) => void
        before: () => T
    }

    function a(d: M<any>) {
        d.after(d.before());
    }

    a({
        select: [],
        after: (a) => {
        },
        before() {
            return [];
        }
    })
})