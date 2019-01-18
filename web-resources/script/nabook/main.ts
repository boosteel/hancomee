import {$ready} from "../../lib/core/core";
import {Formats} from "../../lib/core/format";
import number = Formats.number;
import {HTML} from "../../lib/core/html";
import {DOM} from "../../lib/core/dom";
import createHTML = DOM.createHTML;
import compile = HTML.compile;
import byId = HTML.byId;
import selectAll = HTML.selectAll;
import {Data} from "./_data";
import {Events} from "../../lib/core/events";
import propertyMap = Events.propertyMap;
import {Forms} from "../../lib/core/form/Forms";
import {_date} from "../../lib/core/_func/datetime";
import {Calendar} from "../../lib/core/calendar";
import isodate = Calendar.isodate;
import {FormValid} from "../../lib/core/form/FormValid";
import {_reduceN} from "../../lib/core/_func/array";


type H = HTMLElement;

$ready(() => {

    let $section = '정치 경제 사회 건강 국제 교육 기타'.split(' ');

    // 먼저 모든 데이터를 불러온다.
    Data.list().then(dataMap => {

        selectAll(document.body,
            ['.news-list', '.subject', '.form', '.sections',
                '#search', '#select-check', '#save', '#id', '.section'],
            (body: HTMLBodyElement, news: H, subject: H, _form: H, sections: H,
             search: HTMLInputElement, selectCheck: H, saveBtn: H, idInput: HTMLInputElement, section: H) => {

                // 섹션 선택 라디오버튼 만들기
                section.innerHTML = $section.map((p, i) => {
                    let c = 'section' + i;
                    return '<input type="radio" id="' + c + '" name="section" value="' + p + '">' +
                        '<label for="' + c + '">' + p + '</label>';

                }).join('');


                let

                    {classList} = _form,
                    form = Forms.createForms(_form),

                    formValid = (e) => {
                        if (e === false) {
                            classList.remove('on');
                        } else {
                            if (FormValid.$valid(form)) classList.add('on');
                            else classList.remove('on');
                        }
                    },

                    active: number,

                    list = (values: Data[] = []) => {
                        subject.innerHTML = values.sort((a,b) => {
                            return a.datetime > b.datetime ? 1 : -1
                        }).map(v => {
                            return '<dl class="' + (v.id === active ? 'active' : '') + '" >' +
                                '<dt>' +
                                '<a class="news" target="_blank" href="' + v.url + '">' + v.news + '</a>' +
                                '<span class="datetime">' + isodate(v.datetime) + '</span>' +
                                '</dt>' +
                                '<dd>' +
                                '<span class="menu" data-event="subject" data-value="id:' + v.id + '">' + v.subject + '</span>' +
                                '</dd>' +
                                '</dl>'
                        }).join('');
                    },


                    // 새로고침시 사용
                    subjectRender = () => list(),

                    // 신문사 종류
                    $refresh = () => {
                        news.innerHTML = dataMap.names.map(v => {
                            return '<span class="menu" data-event="news" data-value="name:' + v + '">' + v + "</span>";
                        }).join('');
                        subjectRender();

                        // 섹션계산
                        let obj = _reduceN($section, (r, v) => r[v] = 0, <{ name: string, count: number }>{});
                        dataMap.each(v => obj[v.section]++)
                        sections.innerHTML = $section.map(s => {
                            return '<span data-event="section" data-value="section:' + s + '">' +
                                s + ' : ' + (obj[s] || 0) + '</span>';
                        }).join('');

                    }

                // 기사 선택
                propertyMap(body, 'click', {
                    news({name}: { name: string }) {
                        subjectRender = () => list(dataMap.newsMap[name]);
                        subjectRender();
                    },
                    subject({id}: { id: number }) {
                        let data = dataMap.idMap[id];
                        formValid(false);
                        form.reset(data);
                    },
                    create() {
                        form.reset();
                    },
                    section({section}: { section: string }) {
                        subjectRender = () => list(dataMap.filter((v) => v.section === section));
                        subjectRender();
                    }
                })

                // 검색
                search.addEventListener('keyup', () => {
                    let {value} = search;
                    if (value) {
                        let reg = new RegExp(value.trim(), 'g');
                        list(dataMap.filter((v, p) => reg.test(v.subject)));
                    } else list();
                });


                // 선택된 것만 고르기
                selectCheck.addEventListener('click', () => {
                    subjectRender = () => list(dataMap.filter((v, p) => !!v.chk));
                    subjectRender();
                })


                // 저장
                saveBtn.addEventListener('click', () => {
                    let d = <any>form.values(),
                        {id, datetime} = d;

                    d.datetime = isodate(datetime);

                    if (id) {
                        Data.update(d).then(() => {
                            d.datetime = datetime;
                            dataMap.idMap[id].reset(d);
                            $refresh();
                            alert('저장');
                        });
                    } else {
                        Data.save(d).then(id => {
                            d.id = id;
                            d.datetime = datetime;
                            dataMap.add(new Data(d));
                            $refresh();
                            alert('저장')
                        })
                    }
                });

                _form.addEventListener('change', formValid);


                section.addEventListener('change', (e) => {
                    e.stopPropagation();
                    let i = idInput.value, v = e.target['value'];
                    Data.section(i, v).then(() => {
                        dataMap.update(i, u => u.section = v);
                        $refresh();
                    });
                });
                $refresh();
            });
    })
});
