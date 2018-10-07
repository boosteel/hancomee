import {GenericModule} from "./genericModule";
import {Customer, Work, WorkFile, WorkItem, WorkMemo} from "./domain/Work";
import {Search} from "../../../lib/core/location";
import {HTML} from "../../../lib/core/html";
import {Events, EventsGroup} from "../../../lib/core/events";
import {FormValue} from "../../../lib/core/form/FormValue";
import {DOM} from "../../../lib/core/dom";
import {Watcher} from "../../../lib/core/support/Watcher";
import {_colReduce, _everyTrue, _forEach, _inTrue} from "../../../lib/core/_func/array";
import {FormValid} from "../../../lib/core/form/FormValid";
import {ImageCal} from "../../../lib/core/calcurator";
import className = DOM.className;
import ViewData = Work.ViewData;
import createElement = HTML.createElement;
import propertyMap = Events.propertyMap;
import pick = HTML.pick;
import selectAll = HTML.selectAll;
import createTemplate = HTML.createTemplate;
import reduceFragment = HTML.reduceFragment;
import createFragment = HTML.createFragment;
import {$extend} from "../../../lib/core/core";

type H = HTMLElement;
type HI = HTMLInputElement
type HT = HTMLTextAreaElement;

class Q extends Search {

    uuid: string

}

export class View extends GenericModule<Q> {

    watcher = new Watcher<ViewData>();

    constructor() {
        super('view', Q);
    }


    // **************************** Post Contructor **************************** //
    $init(container, frag, templates) {

        let
            $self = this,
            {watcher} = this,


            // ---------------------------- ▼ 파일 업로드 창 ▼ ---------------------------- //
            fileUpload = selectAll(templates.fileUpload,
                ['.file-upload', '.list', '{data-name}',
                    '.upload-file .slide-bar', '.upload-file .info',
                    '.upload-files .slide-bar', '.upload-files .info'],
                (frag, element, list: H, names: iEleMap,
                 fb: H, fi: H, fsb: H, fsi: H) => {

                    class Item {

                        static create = createTemplate<Item, File, number>(templates.fileUploadItem, Item)
                        static $select = [':first-child', '{data-name}'];

                        constructor(public file: File, public $index: number, public element: H, names: iEleMap) {
                            names.setText(file, this);
                        }

                        active(flag: boolean) {
                            className(this.element, 'active', flag);
                        }

                        icon(e: H) {
                            let {name} = this.file, i = name.lastIndexOf('.');
                            e.className = 'icon-file ' + name.substring(i + 1, name.length);
                        }

                        index(e: H) {
                            e.textContent = (this.$index + 1).toString();
                        }
                    }

                    let
                        items: Item[], total: number,
                        ctrl = {
                            run(files: FileList) {

                                items = [];

                                list.textContent = '';

                                list.appendChild(reduceFragment(files, (f, i) => {
                                    return (items[i] = Item.create(f, i)).element;
                                }));

                                total = items.length;

                                fb.style.width = fi.textContent = fsb.style.width = '0%';
                                fsi.textContent = '0 / ' + total;

                                $self.pop(element);

                                return this;
                            },

                            start(file: File, index: number) {
                                names.setText(file, this);
                                fb.style.width = fi.textContent = '0%';
                                items.forEach((t, i) => t.active(i === index));
                            },
                            loading(progress: number) {
                                fb.style.width = fi.textContent = progress + '%';
                            },
                            sending(progress: number) {
                                fb.style.width = fi.textContent = progress + '%';
                            },
                            complete(file: File, index: number) {
                                index++;
                                fsi.textContent = index + ' / ' + total;
                                fsb.style.width = Math.ceil(index / total * 100) + '%';
                            },
                            done() {

                            },
                            abort() {

                            },

                            on() {
                                WorkFile.uploadRef(items.map(v => v.file), this);
                            },
                            off() {
                                $self.pop();
                            },

                        };

                    propertyMap(element, 'click', <any>ctrl);

                    return ctrl;

                })

        // ****************************** ▼ 제목 부분 ▼ ****************************** //
        watcher.map = selectAll(frag.querySelector('#title'),
            ['{data-name}', '.dropdown-menu li[]', '.state .value'],
            (title, texts: iEleMap, dropdowns: iEleArray, sVal: H) => {

                // 제목부분 state 표기
                let setState = (state: number) => {
                    _forEach(dropdowns, (v, i) => className(v, 'active', i === state));
                    sVal.textContent = Work.stateStr(state);
                };

                type I = { state: number }
                propertyMap(title, 'click', {
                    state(d: I) {
                        let {state} = d;
                        if (state != null && watcher.target.work.state !== state) {
                            setState(state);
                        }
                    }
                })

                return {
                    'work'(work: Work) {
                        texts.setText(work);
                        setState(work.state);
                    }
                }

            })


        // ****************************** ▼ 합계 및 견적 ▼ ****************************** //
        watcher.map = selectAll(frag.querySelector('#sum'),
            ['{data-name}', '.work-text', '.work-text textarea'],
            (f, texts: iEleMap, text: H, textarea: HT) => {

                let
                    $work: Work,
                    $text = {
                        modify() {
                            className(text, 'form', true);
                            textarea.removeAttribute('disabled');
                        },
                        reset() {
                            textarea.setAttribute('disabled', 'true');
                            textarea.value = $work.text;
                            className(text, 'form', false);
                        },
                        confirm() {
                            $work.text = textarea.value;
                            this.reset()
                        }
                    };
                propertyMap(text, 'click', $text);

                return {
                    'work'(work: Work) {
                        texts.setText($work = work);
                        $text.reset()
                    }
                }
            })


        // ****************************** ▼ 거래처 정보 ▼ ****************************** //
        watcher.map = selectAll(templates.customerTable,
            ['.panel', 'table', '[name][]', '{data-name}', '{name}'],
            (self: DocumentFragment, panel: H, table: HTMLTableElement,
             a: iEleArray, spans: iEleMap, inputs: iEleMap) => {

                let
                    $customer,
                    ctrl = {
                        data(obj) {
                            $customer = obj;
                            spans.setText(obj);
                            className(panel, ['form'], false);
                        },
                        form(obj) {
                            $customer = obj;
                            inputs.each((e: HI, v) => {
                                e.value = obj[v] || ''
                            })
                            className(panel, ['form'], true);
                        },
                        cancel() {
                            ctrl.data($customer);
                        },
                        modify() {
                            FormValue.reset(a, $customer);
                            ctrl.form($customer);
                        },
                        save() {
                            let newData = new Customer(FormValue.serialize(a)).setId($customer.id);
                            Customer.save(newData).then(() => {
                                ctrl.data($customer = newData);
                            });
                        }
                    };

                frag.querySelector('#customer').appendChild(self);

                Events.propertyMap(panel, 'click', ctrl)

                return {
                    'work.customer'(c: Customer) {
                        ctrl.data(c)
                    }
                }
            })


        // ****************************** ▼ 작업 아이템 ▼ ****************************** //
        watcher.map = selectAll(templates.itemTable,
            ['tbody'],
            (container: DocumentFragment, tbody: H,
             itemTemplate = createFragment(container.querySelector('.work-item')),
             $con = frag.querySelector('#work-item')
            ) => {

                type I = { id: number };

                class Item {

                    static $select = ['.work-item', '{data-name}', '.print-file',
                        '.print-file [data-toggle="dropdown"]'];
                    static create = createTemplate<Item, WorkItem>(itemTemplate, Item)

                    constructor(public item: WorkItem,
                                public ele: H, private names: iEleMap, p: H, toggle: H) {

                        let {print, print: {length}} = item;

                        toggle.textContent = length.toString();

                        // data-event에 쓰일 값 저장
                        ele.setAttribute('data-value', 'id:' + item.id);
                        names.setText(item, this);
                    }

                    update(values) {
                        $extend(this.item, values);
                        this.names.setText(this.item);
                    }
                    remove() {
                        tbody.removeChild(this.ele);
                    }

                    draft(e: H, item: WorkItem) {
                        e.textContent = item.draft.length.toString();
                    }
                }

                let

                    work: Work,
                    $$values: { [key: number]: Item },

                    // ---------------------- ▼ Image Screen ▼ ---------------------- //
                    $imgScreen = selectAll(templates.imgScreen,
                        [':first-child', '.screen', '.title', '.count', '.before', '.after'],
                        (frag, ele: H, screen: H, title: H, count: H, before: H, after: H) => {

                            let
                                $item: WorkItem,
                                index: number,
                                $images: { img: HTMLImageElement, v: WorkFile }[],

                                $events = new EventsGroup()
                                    .register(document, 'mousewheel', (e: MouseWheelEvent) => {
                                        let next = index + (e['wheelDelta'] < 0 ? 1 : -1);
                                        ctrl.select(next);
                                        e.preventDefault();
                                    }).off(),


                                ctrl = {
                                    select(i: number) {
                                        if (!$images[i]) return;

                                        let {length} = $images;
                                        index = i;
                                        screen.textContent = '';
                                        screen.appendChild($images[i++].img);
                                        this.reset(i, i === 1, !(i < length))
                                    },
                                    open(item: WorkItem) {
                                        let path = ($item = item).work.path;

                                        // 이미지 생성
                                        $images = item.draft.map((v, i) => {
                                            let img = new Image;
                                            img.src = 'http://hancomee.com/workdata/' + path + '/' +
                                                v.save_name + '.' + v.filetype;
                                            return {img: img, v: v};
                                        });

                                        // 초기화
                                        screen.textContent = '';
                                        title.textContent = item.subject +
                                            (item.detail ? ' (' + item.detail + ')' : '')

                                        this.reset(0, true, true).select(0);

                                        $self.pop(ele)
                                        $events.on();
                                    },

                                    reset(index: number, b, a) {
                                        count.textContent = index + ' / ' + length;
                                        className(before, 'disabled', b);
                                        className(after, 'disabled', a);
                                        return this;
                                    },
                                    move(d: { v: number }) {
                                        ctrl.select(index + d.v);
                                    },
                                    close() {
                                        $events.off();
                                        $self.pop();
                                    }
                                };

                            propertyMap(ele, 'click', ctrl);

                            return ctrl;
                        }),

                    // 현재 수정중인 아이템 :: null일 경우 새로운 아이템
                    modifyItem: Item,

                    // ---------------------- ▼ Modify Item Template ▼ ---------------------- //
                    $modify = selectAll(pick(container, '.work-item-form'),
                        ['[name][]'],
                        (container: H, inputs: iEleArray) => {

                            let
                                $mV: WorkItem,

                                // 수정폼 검증을 위한 핸들러들
                                isValid = (v: HI) => FormValid.input(v).isValid,
                                isChange = (v: HI) => $mV[v.name] !== v.value.trim(),
                                $change = () => className(container, 'change', _everyTrue(inputs, isValid) && _inTrue(inputs, isChange)),

                                ctrl = {
                                    // 아이템 추가할시
                                    add(item: WorkItem) {
                                        $mV = item;
                                        className(container, 'change', false);
                                        FormValue.reset(inputs);
                                        tbody.appendChild(container);
                                    },
                                    // 아이템 수정할시
                                    attach(item: Item) {
                                        className(container, 'change', false);
                                        FormValue.reset(inputs, $mV = item.item);
                                        tbody.insertBefore(container, item.ele);
                                    },
                                    close() {
                                        tbody.removeChild(container);
                                    },

                                    values() {
                                        return FormValue.serialize(inputs);
                                    }
                                };


                            container.addEventListener('keyup', $change);
                            container.addEventListener('change', $change);


                            return ctrl;
                        }),


                    /*
                     *   작업 아이템을 추가, 삭제 렌더링하는 컨트롤러
                     */
                    ctrl = {

                        // 아이템 목록 그리기
                        reset(items: WorkItem[]) {
                            tbody.textContent = '';
                            $$values = {};
                            items.forEach(v => this.add(v));
                            return ctrl;
                        },

                        add(item: WorkItem) {
                            tbody.appendChild(($$values[item.id] = Item.create(item)).ele);
                            return ctrl;
                        },


                        // 아이템 추가버튼 클릭시
                        $create() {
                            $modify.add(new WorkItem().setWork(work));
                            modifyItem = null;  // important sign!!
                        },

                        // 추가일지, 수정일지는 modifyItem 변수에 따라 다르다.
                        $confirm() {
                            let values = $modify.values(),
                                item = modifyItem ? modifyItem.item : new WorkItem(values).setWork(work);

                            WorkItem.save(item).then(() => {
                                // update
                                if(modifyItem) modifyItem.update(values);
                                // save
                                else ctrl.add(item);
                                $modify.close();
                            })
                        },

                        $remove(d: I) {
                            let item = $$values[d.id];
                            WorkItem.remove(item.item).then(() => item.remove());
                            return ctrl;
                        },

                        // 수정모드
                        $modify(d: I) {
                            modifyItem = $$values[d.id];
                            console.log($modify)
                            $modify.attach(modifyItem);
                        },
                        // 수정모드 취소
                        $cancel() {
                            $modify.close();
                        },

                        $img(d: I) {
                            $imgScreen.open($$values[d.id].item);
                        },

                    }; // ************** ▲ Modify Item Template ▲ ************** //


                propertyMap($con, 'click', ctrl);


                // <tr>등을 뽑아내기 위해 통채로 잡아놓은 <table>엘리먼트를 document에 붙인다.
                $con.querySelector('.body').appendChild(container);

                return {
                    'items'(this: ViewData, items: WorkItem[]) {
                        work = this.work;
                        ctrl.reset(items);
                    }
                }

            });

        // ****************************** ▼ 작업 메모 ▼ ****************************** //
        watcher.map = selectAll(frag.querySelector('#work-memo'),
            ['.list', '.form', '.form textarea', '.form span'],
            (container: H, list: H, createForm: H, createText: HT, createBtn: H) => {

                class Memo {
                    static create = createTemplate<Memo, WorkMemo>(templates.workMemo, Memo)
                    static $select = [':1', '{data-name}']

                    constructor(public data: WorkMemo, public element: H, private names: iEleMap) {
                        element.setAttribute('data-value', 'id:' + data.id);
                        this.reset();
                    }

                    setValue(value: string) {
                        this.data.value = value;
                        this.reset();
                    }

                    reset() {
                        this.names.setText(this.data);
                    }

                    remove() {
                        list.removeChild(this.element);
                    }
                }

                type I = { id: number }

                let

                    work: Work,
                    [modifyForm, modifyText] = selectAll<[H, HT]>
                    (createElement(templates.workMemoForm), ['textarea']),
                    textareaValue: boolean,

                    $values: { [index: number]: Memo },
                    activeMemo: Memo,

                    ctrl = {
                        create() {
                            if (!textareaValue) return;
                            WorkMemo.save(new WorkMemo({
                                datetime: new Date().getTime(),
                                value: createText.value,
                                work: work
                            })).then(m => {
                                createText.value = '';
                                ctrl.add(m)
                            });
                        },
                        add(v: WorkMemo) {
                            list.appendChild(($values[v.id] = Memo.create(v)).element);
                            return ctrl;
                        },
                        reset(v: WorkMemo[]) {
                            list.textContent = '';
                            $values = {};
                            v && list.appendChild(reduceFragment(v, (m, i) => {
                                return ($values[m.id] = Memo.create(m)).element;
                            }))
                            return ctrl;
                        },
                        remove(v: I) {
                            let value = $values[v.id];
                            return WorkMemo.remove(value.data).then(() => value.remove());
                        },
                        update() {
                            let {data, data: {value}} = activeMemo,
                                newVal = data.value = modifyText.value;
                            WorkMemo.save(data).then(() => {
                                activeMemo.setValue(newVal);
                                ctrl.cancel();
                            })
                        },
                        modify(v: I) {
                            activeMemo = $values[v.id];
                            modifyText.value = activeMemo.data.value;
                            list.insertBefore(modifyForm, activeMemo.element);
                        },

                        cancel() {
                            list.removeChild(modifyForm);
                        }
                    };

                propertyMap(list, 'click', ctrl);
                propertyMap(createForm, 'click', ctrl);


                // 글씨가 있을 경우에만 등록버튼
                createText.addEventListener('keyup', () => {
                    let a = textareaValue;
                    textareaValue = !!createText.value.trim();
                    a !== textareaValue && className(createForm, 'active', textareaValue);
                });

                return {
                    'work.memo'(memo: WorkMemo[]) {
                        // 초기화
                        work = this.work;
                        className(createForm, 'active', false);
                        createText.value = '';
                        ctrl.reset(memo);
                    }
                }
            });

        // ****************************** ▼ 작업 파일 ▼ ****************************** //
        watcher.map = selectAll(frag.querySelector('#work-ref'),
            ['.body', '.add-input'],
            (con: H, body: H, fileInput: HI) => {

                class Wf {
                    static create = createTemplate<Wf, WorkFile>(templates.workRef, Wf)
                    static $select = [':first-child', '{data-name}', 'a'];

                    constructor(public item: WorkFile, public element: H,
                                texts: iEleMap, thumb: HTMLAnchorElement) {
                        texts.setText(item);
                        thumb.className = 'icon-file ' + item.filetype
                    }
                }

                let
                    $values: Wf[],

                    $render = () => {
                        body.textContent = '';
                        body.appendChild(_colReduce($values, 4, (frag, wf: Wf[]) => {
                            let div = document.createElement('div');
                            wf.forEach(v => div.appendChild(v.element));
                            frag.appendChild(div);
                            return frag;
                        }, document.createDocumentFragment()));
                    };

                fileInput.addEventListener('change', (e) => {
                    let {files} = fileInput;

                    /*
                     *  ie에서는 value = ''를 해도 change가 불린다.
                     *  때문에 files 갯수를 확인해서 작동하도록 한다.
                     */
                    if (files.length) {
                        fileUpload.run(files);
                        fileInput.value = '';
                    }
                })

                propertyMap(con, 'click', {
                    add() {
                        fileInput.click();
                    }
                });

                return {
                    'work.refs'(list: WorkFile[]) {
                        $values = list.map(w => Wf.create(w));
                        $render();
                    }
                }

            });

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