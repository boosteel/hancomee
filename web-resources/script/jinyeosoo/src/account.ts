import "../../../lib/core/component/toggle";
import {Src} from "./_src";
import {Account, Customer, Managing} from "../$data";
import {SelectCalendar} from "../../../lib/core/component/SelectCalendar";
import {HTML} from "../../../lib/core/html";
import selectAll = HTML.selectAll;
import {Forms} from "../../../lib/core/form/Forms";
import {Events} from "../../../lib/core/events";
import propertyMap = Events.propertyMap;
import {Calendar} from "../../../lib/core/calendar";

export default function (init: InitData) {

    return class C extends Src {

        private customer: Customer

        constructor() {
            super('account', init);
        }

        $init(ele: HTMLElement) {

            selectAll(ele, ['tbody', '!.modify', '.list', '.add'],
                (e, tbody: HTMLTableRowElement, modify: HTMLTableRowElement,
                 list: HTMLTableRowElement, addBtn: HTMLElement) => {

                    let
                        $customer: Customer,
                        $values: { [key: number]: ReturnType<typeof $create> },
                        $modify = -1,

                        $form = selectAll(modify,
                            ['.date-table', '[name="date"]'],
                            (e, table: HTMLElement, input: HTMLInputElement) => {

                                // 달력 만들기
                                let cal = new SelectCalendar(new Date())
                                    .appendTo(table);
                                cal.onSelect = (v) => input.value = v;
                                return new Forms(modify);
                            }),

                        $create = (account: Account) => {
                            return selectAll(list.cloneNode(true), ['{data-name}'], (l, map: iEleMap) => {
                                let id = account.id,
                                    ctrl = {
                                        // 수정화면
                                        modify() {
                                            $form.reset(account);
                                            $form.element.setAttribute('data-form', 'modify')
                                            tbody.insertBefore($form.element, l);
                                        },
                                        reset(data) {
                                            map.setText(account.reset(data));
                                        },
                                        // account 삭제
                                        remove() {
                                            Account.remove(account.customer_id, account.id).then(() => {
                                                tbody.removeChild(l)
                                            });
                                        }
                                    };

                                $values[id] = ctrl;

                                l.setAttribute('data-value', 'id:' + id);
                                map.setText(account);
                                tbody.appendChild(l);

                                return ctrl;
                            });
                        },

                        ctrl = {
                            modify({id}: { id: number }) {
                                $values[$modify = id].modify();
                            },
                            cancel() {
                                tbody.removeChild($form.element);
                                $modify = -1;
                            },
                            // ★★★ 데이터 삭제
                            remove({id}: { id: number }) {
                                $values[id].remove();
                            },
                            // ★★★ 데이터 추가, 수정
                            confirm() {
                                let values = $form.values(),
                                    v = new Account(values).setCustomer($customer);
                                if ($modify !== -1) v.id = $modify;
                                Account.save(v).then((id) => {
                                    v.id = id;
                                    if ($modify === -1) $create(v);
                                    else $values[$modify].reset(v);
                                    ctrl.cancel();
                                })
                            }
                        };

                    // 추가 등록
                    addBtn.addEventListener('click', () => {
                        $modify = -1;
                        $form.element.setAttribute('data-form', 'create')
                        tbody.insertBefore(
                            $form.reset({date: Calendar.isodate(new Date())}
                            ).element, tbody.firstChild);
                    });

                    propertyMap(tbody, 'click', ctrl);

                    // $load 초기화
                    this.$load = (customer: Customer, element: HTMLElement) => {
                        $values = {};
                        $modify = -1;
                        $customer = customer;
                        return Account.list(customer.id).then(values => {
                            tbody.textContent = '';
                            values.forEach($create);
                        });
                    }

                });


        }

        $load(customer: Customer, element: HTMLElement) {
        }

        close() {

        }
    }

}
