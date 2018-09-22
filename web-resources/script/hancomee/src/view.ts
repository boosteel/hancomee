import {GenericModule} from "./genericModule";
import {Customer, Work, WorkItem, WorkMemo} from "./domain/Work";
import {Search} from "../../../lib/core/location";
import {HTML} from "../../../lib/core/html";
import htmlParser = HTML.htmlParser;
import {Calendar} from "../../../lib/core/calendar";
import format = Calendar.format;
import {Formats} from "../../../lib/core/format";
import number = Formats.number;
import {Events} from "../../../lib/core/events";
import select = HTML.select;
import {FormValue} from "../../../lib/core/form/FormValue";
import byId = HTML.byId;
import createFragment = HTML.createFragment;
import {DOM} from "../../../lib/core/dom";
import className = DOM.className;
import ViewData = Work.ViewData;
import createElement = HTML.createElement;
import propertyMap = Events.propertyMap;
import pick = HTML.pick;
import setText = HTML.setText;
import hasClass = DOM.hasClass;
import {Watcher} from "../../../lib/core/support/Watcher";


class Q extends Search {

    uuid: string

}

export class View extends GenericModule<Q> {

    watcher = new Watcher();

    constructor() {
        super('view', Q);
    }


    $init(container, frag, templates) {

        let {watcher} = this;

        select(frag, (f, title: HTMLElement, customer: HTMLElement) => {

            customer.addEventListener('click', () => {
                className(title, 'form', !hasClass(title, 'form'));
            })

        }, '.title', '.title .customer')

        // 거래처 정보
        watcher.map = select(createFragment(templates.customerTable),
            (self: DocumentFragment, panel: HTMLElement, table: HTMLTableElement,
             a: iEleArray, spans: iEleMap, inputs: iEleMap) => {
                let
                    $customer,
                    ctrl = {
                        data(obj) {
                            $customer = obj;
                            spans.setText(obj);
                            className(table, ['form'], false);
                        },
                        form(obj) {
                            $customer = obj;
                            inputs.each((e: HTMLInputElement, v) => {
                                e.value = obj[v] || ''
                            })
                            className(table, ['form'], true);
                        }
                    };

                frag.getElementById('customer').appendChild(self);

                Events.propertyMap(panel, 'click', {
                    cancel() {
                        ctrl.data($customer);
                    },
                    modify() {
                        FormValue.reset(a, $customer);
                        ctrl.form($customer);
                    },
                    save() {
                        ctrl.data($customer);
                    }
                })

                return {
                    'work.customer'(c: Customer) {
                        ctrl.data(c)
                    }
                }
            }, '.panel', 'table', '[name][]', '{data-name}', '{name}')


        // 아이템 목록
        watcher.map = select(createFragment(templates.itemTable),

            (container: DocumentFragment, tbody: HTMLElement) => {

                let
                    itemTemplate = document.createDocumentFragment(),

                    // 현재 아이템 목록
                    modifyItem: { item: WorkItem, map: iEleMap, ele: HTMLElement },
                    $$values: { [key: number]: typeof modifyItem },

                    // 수정에 쓰일 <tr>
                    modify = select(pick(container, '.work-item-form'),

                        (e: HTMLElement, inputs: iEleArray) => {
                            let ctrl = {
                                attach(tr: HTMLElement, item: WorkItem) {
                                    FormValue.reset(inputs, item);
                                    tbody.insertBefore(e, tr);
                                },
                            };
                            return ctrl;
                        }, '[name][]'),

                    // EleMap each()용 함수
                    $each = (e: HTMLElement, key: string, item: WorkItem) => setText(e, item[key]),
                    $map = {
                        draft(e: HTMLElement, item: WorkItem) {
                            e.textContent = item.draft.length.toString();
                        },
                        print(e: HTMLElement, item: WorkItem) {
                            e.textContent = item.print.length.toString();
                        },
                    },

                    /*
                     *   작업 아이템을 추가, 삭제 렌더링하는 컨트롤러
                     */
                    ctrl = {

                        reset(items: WorkItem[]) {

                            tbody.innerHTML = '';

                            $$values = {};
                            items.forEach(v => this.add(v));

                            return ctrl;
                        },

                        modify(id) {
                            modifyItem = $$values[id];
                            modify.attach(modifyItem.ele, modifyItem.item);
                        },

                        /*
                         *  item 리스트에 추가
                        */
                        add(item: WorkItem) {
                            tbody.appendChild(select(<DocumentFragment>itemTemplate.cloneNode(true),
                                (frag: DocumentFragment, ele: HTMLElement, names: iEleMap) => {

                                    // data-event에 쓰일 값 저장
                                    ele.setAttribute('data-value', 'id:' + item.id);

                                    // 전역 변수에 item과 EleMap
                                    $$values[item.id] = {
                                        ele: ele,
                                        item: item,
                                        map: names.each($each, item, $map)
                                    };

                                    return frag;
                                }, '.work-item', '{data-name}'))
                            return ctrl;
                        },
                        remove(item: WorkItem) {
                            tbody.removeChild(document.getElementById('item-' + item));
                            return ctrl;
                        }

                    };


                type I = { id: number };
                propertyMap(tbody, 'click', {
                    modify(d: I) {
                        ctrl.modify(d.id);
                    }
                });


                // clone 생산할 템플릿을 fragment에 담아놓는다.
                itemTemplate.appendChild(container.querySelector('.work-item'));

                // <tr>등을 뽑아내기 위해 통채로 잡아놓은 <table>엘리먼트를 document에 붙인다.
                frag.getElementById('work-item').appendChild(container);

                return {
                    'items'(items: WorkItem[]) {
                        ctrl.reset(items);
                    }
                }

            }, 'tbody');

        // 메모
        watcher.map = select(frag.getElementById('work-memo'),

            (workMemo: HTMLElement, list: HTMLElement, form: HTMLElement,
             t: HTMLTextAreaElement, b: HTMLSpanElement) => {

                let

                    // 현재 메모 목록
                    $values: { [keys: number]: WorkMemo },

                    // 메모 엘리먼트
                    [$memo] = htmlParser(templates.workMemo),

                    /*
                     *  메모 수정폼 엘리먼트
                     */
                    $memoForm = select(createElement(templates.workMemoForm),
                        (form: HTMLElement, textarea: HTMLTextAreaElement) => {
                            let
                                activeMemo: WorkMemo,
                                activeElement: HTMLElement,
                                ctrl = {
                                    modify(target: HTMLElement, memo: WorkMemo) {
                                        activeElement = target;
                                        activeMemo = memo;
                                        textarea.value = memo.value;
                                        target.parentElement.insertBefore(form, target);
                                    }
                                };

                            propertyMap(form, 'click', {
                                confirm() {
                                    activeElement.querySelector('pre').textContent = activeMemo.value = textarea.value;
                                    this.cancel();
                                },
                                cancel() {
                                    form.parentElement.removeChild(form);
                                }
                            });

                            return ctrl;
                        }, 'textarea');

                type I = { id: string, ele: HTMLElement }

                Events.propertyMap(list, 'click', {
                    modify(v: I) {
                        $memoForm.modify(v.ele, $values[v.id]);
                    },
                    delete(v: I) {

                    }
                });

                // 신규등록폼
                (function (active) {
                    // 글씨가 있을 경우에만 등록버튼
                    t.addEventListener('keyup', () => {
                        let a = active;
                        active = !!t.value.trim();
                        a !== active && className(form, 'active', active);
                    });

                    b.addEventListener('click', () => {
                        if (active) {
                            console.log(t.value);
                        }
                    });
                })()

                return {
                    'work.memo'(memo: WorkMemo[]) {
                        let $d = $values = {};

                        // 초기화
                        className(form, 'active', false);
                        t.value = '';

                        list.innerHTML = memo.map(v => {
                            $d[v.id] = v;
                            return $memo(v);
                        }).join('');
                    }
                }
            }, '.list', '.form', '.form textarea', '.form span');
    }

    $load(param: Q) {
        if (!param.uuid) return
        return Work.get(param.uuid).then((a: ViewData) => {
            this.watcher.apply(a);
        })
    }

    close() {

    }
}