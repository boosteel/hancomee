export class CountLoop {

    private _isActive = false
    private _index: number
    private _count = 0
    private _handler

    constructor(
        private time: number,
        private handler: (count: number, context: CountLoop) => void,
    ) {
        this._handler = () => this.run();
    }

    start() {
        if (!this._isActive) {
            this._index = setTimeout(this._handler, this.time);
            this._isActive = true;
        }
        return this;
    }

    stop() {
        if (this._isActive) {
            clearTimeout(this._index);
            this._isActive = false;
        }
        this._count = 0;
        return this;
    }

    private run() {

        this.handler(++this._count, this);

        // handler중에 stop()이 호출됐을수도 있다.
        if (this._isActive)
            this._index = setTimeout(this._handler, this.time);

    }

}


/*
 *  setTimeout()
 */
export namespace Loop {

    function _timeloop(handler: (count: number) => boolean | void, time: number) {
        let
            count = 1,
            index = -1,
            dispatcher = () => {
                if (handler(count++) === false) clearTimeout(index);
                else loop();
            },
            loop = () => index = setTimeout(dispatcher, time);
        loop();
    }


    export function countLoop(handler: (count: number) => boolean | void, time: number, count: number) {

    }
}

