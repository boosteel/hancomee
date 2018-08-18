import {ImageCal} from "../../../lib/core/calcurator";


export abstract class MediaElement<T extends HTMLElement> implements iMediaElement {

    element: T
    isLoad = false
    mediaWidth = 0
    mediaHeight = 0

    render(rotate = 0) {
        if (this.element.parentElement) {
            let {mediaWidth, mediaHeight, element: {style, parentElement: parent}} = this,
                [left, top, width, height] = ImageCal.alignment(mediaWidth, mediaHeight, rotate, parent.offsetWidth, parent.offsetHeight);

            style.transform = 'rotate(' + rotate + 'deg)';
            style.top = top + 'px';
            style.left = left + 'px';
            style.width = width + 'px';
            style.height = height + 'px';
        }
        return this;
    }

    offScreen() {
        return this;
    }

    onScreen() {
        return this;
    }
}

export namespace MediaElement {

    let

        r_erase = /\/+$/,
        types = [

            {
                check: /jpeg|jpg|gif|png|bmp|svg/i,
                factory: class A extends MediaElement<HTMLImageElement> {
                    constructor(media: iMedia) {
                        super();
                        let img = this.element = new Image();

                        img.style.visibility = 'hidden';
                        img.onload = () => {
                            this.mediaWidth = img.naturalWidth;
                            this.mediaHeight = img.naturalHeight;
                            this.render(media.rotate);
                            this.isLoad = true;
                            img.style.visibility = '';
                        };
                        img.src = src(media);
                    }
                },
            },
            {
                check: /mp4/i,
                factory: class A extends MediaElement<HTMLVideoElement> {
                    constructor(media: iMedia) {
                        super();
                        let video = this.element = <HTMLVideoElement>document.createElement('video'),
                            source = <HTMLSourceElement>document.createElement('source');

                        video.style.visibility = 'hidden';
                        video.setAttribute('controls', 'true');
                        video.onloadeddata = () => {
                            this.mediaHeight = video.videoHeight;
                            this.mediaWidth = video.videoWidth;
                            video.pause();
                            this.render(media.rotate);
                            this.isLoad = true;
                            video.style.visibility = '';
                        }

                        video.setAttribute('loop', '');
                        video.appendChild(source);
                        source.src = src(media);
                    }

                    onScreen() {
                        let {element} = this;
                        element.play();
                        return this;
                    }

                    offScreen() {
                        this.element.pause();
                        return this;
                    }
                },
            }

        ];

    export function src(media: iMedia) {
        return media.path.replace(r_erase, '') + '/' +
            encodeURIComponent(media.filename || '') +
            (media.filetype ? '.' + media.filetype : '');
    }

    export function create(media: iMedia): MediaElement<HTMLElement> {
        let i = 0, l = types.length;
        for (; i < l; i++)
            if (types[i].check.test(media.filetype))
                return new types[i].factory(media);
        return null;
    }

}
