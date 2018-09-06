export class StringBuffer {

    private array: string[] = [];
    private i = 0;

    constructor(init?: string) {
        if (init) this.append(init);
    }

    reset() {
        this.array = [];
        this.i = 0;
        return this;
    }

    prepend(v) {
        this.array.unshift(v);
        this.i++;
        return this;
    }

    append(v: string[])
    append(v: any)
    append(v) {
        let {array} = this;
        if (!Array.isArray(v))
            array[this.i++] = v;
        else {
            let i = 0, u = this.i, l = v.length;
            while (i < l) array[u++] = v[i++];
            this.i = u;
        }
        return this;
    }

    toString() {
        return this.array.join('');
    }

}

export namespace StringBuffer {

}