export class StringBuffer {

    private array: string[] = [];
    private i = 0;

    constructor(init?: string) {
        if(init) this.append(init);
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

    append(v) {
        this.array[this.i++] = v;
        return this;
    }

    toString() {
        return this.array.join('');
    }

}

export namespace StringBuffer {

}