import {GenericModule} from "./genericModule";
import {Work} from "./domain/Work";
import {Search} from "../../../lib/core/location";
import {HTML} from "../../../lib/core/html";
import htmlParser = HTML.htmlParser;
import {Calendar} from "../../../lib/core/calendar";
import format = Calendar.format;
import {Formats} from "../../../lib/core/format";
import number = Formats.number;
import {Events} from "../../../lib/core/events";
import selectAll = HTML.selectAll;


let
    STATE = '작업대기 시안검토 시안완료 제작중 입고 납품 완료'.split(' '),
    expFilter = {

        num: number,
        date: format,
        state(n: number) {
            return STATE[n];
        },
        thumb(work: Work) {
            let {img} = work;
            if (img && img.save_name)
                return 'background-image: url(http://hancomee.com/workdata/' +
                    work.path + '/' + img.save_name + '.' + img.filetype + ')';
            return '';
        }
    };

class Q extends Search {

    page = 1
    size = 10
    state = 0

    customerName = ''
    title = ''
    order = '>datetime'

}

export class List extends GenericModule<Q> {

    view: Array<(a: ServerData<Work>) => any> = [];

    constructor() {
        super('list', Q);
    }

    $init(container, frag, templates) {


        let {view, view: {length: l}} = this;

        // 현황판 만들기
        view[l++] = htmlParser(templates.state, (c, {li}) => {

            return selectAll(frag,
                ['.work-state', '.navi'],
                (frag, workState) => {

                Events.propertyMap(workState, 'click', {
                    move: (v: { state: number }) => {
                        location.hash = 'list?' +
                            this.q.extend({state: v.state, page: 1}).toString();
                    }
                })
                return (a: ServerData<Work>) => {

                    let {count, price, state} = a;

                    workState.innerHTML = c({
                        li: count.map((v, i) => {
                            return li({
                                className: state === i ? 'active' : '',
                                state: i,
                                price: price[i],
                                count: v
                            })
                        }).join('')
                    })
                }
            })


        }, expFilter);

        // 네비 만들기
        view[l++] = htmlParser(templates.navi, (c, {}) => {

            let navi = frag.querySelector('.navi');

            Events.propertyMap(navi, 'click', {
                move: (v: { move: number }) => {
                    if (v.move !== -1)
                        location.hash = 'list?' + this.q.extend({page: v.move}).toString()
                }
            });

            return (a: ServerData<Work>) => {
                let {page, totalPages} = a;
                navi.innerHTML = c({
                    page: page, totalPages: totalPages,
                    state: a.state,
                    prev: page > 1 ? page - 1 : -1,
                    next: page < totalPages ? page + 1 : -1
                });
            }
        }, expFilter);


        // 리스트 만들기
        view[l++] = htmlParser(templates.work, (c, {li}) => {

            let list = frag.querySelector('#list');

            return (a: ServerData<Work>) => {
                let {contents: values} = a;
                list.innerHTML = values.map(a => c({
                    work: a,
                    li: STATE.map((v, i) => li({
                        state: i,
                        className: a.state === i ? 'active' : ''
                    })).join('')
                })).join('');
            }
        }, expFilter);
    }

    $load(param: Q) {
        return Work.list(param.toString()).then((a: ServerData<Work>) => {
            console.log(a);
            this.view.forEach(v => v(a));
        })
    }

    close() {

    }
}