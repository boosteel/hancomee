import {__makeArray} from "../../lib/core/core";
import {DOM} from "../../lib/core/dom";
import createHTML = DOM.createHTML;
import {Calcurator, ImageCal} from "../../lib/core/calcurator";

interface video {
    mp4: string
    thumb: string
    url: string
    title: string
}


function render(col: number, values) {

    let W = window.innerWidth,
        w = Math.floor(W / col),
        h = [];

    // 첫 시작 height는 모두 0으로
    for (let i = 0; i < col; i++) h[i] = 0;

    values.forEach((v, i) => {
        i = i % col;

        // 설정해야 할 :: (width, left, top)
        // return :: 자신의 height
        h[i] += v(w, w * i, h[i]);
    });

}

declare var values: video[];

let

    SIZE = 1,

    // nav
    length = values.length,
    totalPages = Math.ceil(length / SIZE),
    page: number,

    // elements
    main = <HTMLElement>document.querySelector('main'),
    prev = <HTMLElement>document.querySelector('.prev'),
    num = <HTMLElement>document.querySelector('.current'),
    next = <HTMLElement>document.querySelector('.next'),
    count = <HTMLElement>document.querySelector('.count'),

    complete = () => {

    },

    createVideo = (main: HTMLElement, data) => {
        return new Promise((o, x) => {
            let {thumb, title, mp4, url} = data,

                container = createHTML('<div class="video">' +
                    '<span class="title">' + title + '.mp4<br /><a href="' + url + '" target="_blank">move</a> ' + '</span>' +
                    '</div>'),

                video = document.createElement('video'),
                source = document.createElement('source');

            // video 로딩
            video.controls = true;

            video.onloadedmetadata = (e) => {
                video.setAttribute('data-loaded', 'true');
                o((width, left, top) => {

                    let {style: s} = container, {style, videoWidth, videoHeight} = video,
                        h = Calcurator.ratio(videoWidth, width, videoHeight);

                    s.left = left + 'px';
                    s.top = top + 'px';
                    style.width = width + 'px'
                    style.height = h + 'px';

                    return h;
                });
            }

            source.onerror = (e) => {
                o((width, left, top) => {

                    let {style: s} = container, {style} = video;

                    s.left = left + 'px';
                    s.top = top + 'px';
                    style.width = width + 'px'
                    style.height = width + 'px';

                    return width;
                });
            }


            video.appendChild(source);
            container.insertBefore(video, container.firstChild);
            source.src = mp4;

            // <main>에 붙인다
            main.appendChild(container);

        })
    },


    current: HTMLVideoElement,

    run = (p: number) => {

        if (page !== p && !(totalPages < p)) {

            window.scrollTo(0, 0);

            let list = values.slice((p - 1) * SIZE, p * SIZE);

            num.textContent = p.toString();

            if (p === totalPages) next.removeAttribute('data-nav');
            else next.setAttribute('data-nav', 'next');

            if (p === 1) prev.removeAttribute('data-nav');
            else prev.setAttribute('data-nav', 'prev')

            count.textContent = p + ' / ' + totalPages;

            main.innerHTML = '';

            Promise.all(list.map(v => createVideo(main, v)))
                .then((fns) => page === p && render(5, fns))
            page = p;

        }
    };


main.addEventListener('mouseover', (e) => {
    let target = <HTMLVideoElement>e.target;
    if (/video/i.test(target.tagName) && target.hasAttribute('data-loaded')) {
        if (current) current.pause();
        (current = target).play();
    }
});


document.querySelector('.navi').addEventListener('click', (e) => {
    let target = <HTMLVideoElement>e.target;

    switch (target.getAttribute('data-nav')) {
        case 'prev':
            return location.search = (page - 1).toString();
        case 'next':
            return location.search = (page + 1).toString();
    }
});


let d = location.search.replace(/[^\d]+/g, '') || '1';
run(parseInt(d));

