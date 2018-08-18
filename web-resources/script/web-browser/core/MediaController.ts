import {Events, EventsGroup} from "../../../lib/core/events";
import {MediaElement} from "./MediaElement";

export class MediaController {

    public target: MediaElement<HTMLElement>

    constructor(private eGroup: EventsGroup, private _test: RegExp) {
    }

    on(ele: MediaElement<HTMLElement>) {
        this.target = ele;
        this.eGroup.on();
        return this;
    }

    off() {
        this.target = null;
        this.eGroup.off();
        return this;
    }

    test(media: iMedia) {
        return this._test.test(media.filetype);
    }
}

export namespace MediaController {

    let ctrl = [
        {
            test: /mp4/i,
            factory(container: HTMLElement, group: EventsGroup, context: MediaController) {
                group
                    .register(Events.keyDown(container, [32], () => {
                        let video = <HTMLVideoElement>context.target.element;
                        video.paused ? video.play() : video.pause();
                    }))
                    .register(Events.keyDown(container, [37], () => {
                        let video = <HTMLVideoElement>context.target.element;
                        video.currentTime = video.currentTime - 10;

                    }))
                    .register(Events.keyDown(container, [39], () => {
                        let video = <HTMLVideoElement>context.target.element;
                        video.currentTime = video.currentTime + 3;
                    }))
            }
        },
        {
            test: /jpeg|jpg|gif|png|bmp|mp4/i,
            factory(container: HTMLElement, group: EventsGroup, context: MediaController) {

            }
        }
    ];

    export function create(container: HTMLElement): MediaController[] {
        return ctrl.map(c => {
            let group = new EventsGroup(),
                context = new MediaController(group, c.test);
            c.factory(container, group, context);
            return context;
        })
    }

}