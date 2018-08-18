/**
 * Created by hellofunc on 2017-01-23.
 */

type AlikePager = { page: number, totalPages: number }

function $computeStart(n: number, size: number) {
    return (Math.floor((n - 1) / size) * size) + 1
}

// page는 1부터 시작한다.
export class Pager {

    page: number
    totalPages: number

    before = -1
    after = -1

    constructor(page: number, totalPages: number) {
        this.reset(page, totalPages);
    }

    reset(page: number, totalPages = this.totalPages) {

        this.page = page;
        this.totalPages = totalPages;

        // before
        if (page > 1) this.before = page - 1;
        // after
        if (page < totalPages) this.after = page + 1;

        return this;
    }
}

export class PagerTable {


    private _handler
    private _pager: Pager

    constructor(public container: HTMLElement, public col: number, public row: number) {
        container.addEventListener('click', (e) => {

            let target = <HTMLElement>e.target,
                num;
            if (num = target.getAttribute('data-page')) {
                this._handler.call(this, parseInt(num), num);
            }
            if (num = target.getAttribute('data-nav')) {
                this.render(this._pager, parseInt(num));
            }
            e.preventDefault();
            e.stopPropagation();
        });
    }

    render(page: Pager, viewPage?: number) {
        this._pager = page;
        this.container.innerHTML = Pager.createTable(page, this.col, this.row, viewPage).join('');
        return this;
    }

    setHandler(handler: (this: PagerTable, page: number, table: PagerTable) => void) {
        this._handler = handler;
        return this;
    }

}

export namespace Pager {


    export function createTable({page, totalPages}: Pager, col: number, row: number,
                                _p?: number): [string, string] {


        let
            size = col * row,


            tableTotalPage = Math.ceil(totalPages / size),
            tablePage = _p != null ? _p - 1 : Math.floor((page - 1) / size),

            start = tablePage * size + 1,

            pos = 0,
            i = 0,
            array = [];

        for (let r = 0; r < row; r++) {

            array[i++] = '<tr>';

            for (let c = 0; c < col; c++, start++, pos++) {

                if (start === page)
                    array[i++] = '<td class="current"><span>' + start + '</span></td>';
                else if (start > totalPages)
                    array[i++] = '<td class="disabled"><span>' + start + '</span></td>';
                else
                    array[i++] = '<td class="link"><span data-page="' + start + '">' + start + '</span></td>';

            }

            array[i++] = '</tr>';
        }


        return [

            '<div>' +
            '<span class="prev' + (tablePage === 0 ? ' disabled' : '" data-nav="' + tablePage) + '">◀</span>' +
            '<span class="number">' + (tablePage + 1) + '</span>' +
            '<span class="next' + (tablePage > (tableTotalPage - 2) ? ' disabled' : '" data-nav="' + (tablePage + 2)) + '">▶</span>' +
            '</div>',

            '<table>' + array.join('') + '</table>'
        ];
    }

}