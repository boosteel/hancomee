import {Template} from "../template";
import {DOM} from "../dom";
import {EventsGroup} from "../events";

let r_anchor = /a/i,
    c_active = ['active'],
    c_open = ['open'];

export class Tree {
    public element: HTMLUListElement
    public root: Menu

    private eventGroup = new EventsGroup();
    private interceptor

    constructor(className = 'tree') {
        let ul = this.element = document.createElement('ul');
        ul.className = className;

        this.eventGroup.register(ul, 'click', (e) => {
            let target = <HTMLElement>e.target;

            if (target.hasAttribute('data-tree-toggle')) {
                let parent = target.parentElement,
                    doOpen = parent.className.indexOf('open') === -1;
                DOM.className(parent, ['open'], doOpen);
            }

            if (r_anchor.test(target.tagName)) {
                if (this.interceptor) {
                    this.interceptor(target.getAttribute('href'), this, e);
                }
            }
        })
    }

    setIntercepter(handler: (url: string, ctrl: this, e: MouseEvent) => void) {
        this.interceptor = handler;
        return this;
    }

    appendTo(ele: HTMLElement) {
        ele.appendChild(this.element);
        return this;
    }

    active(url: string) {
        if (this.root) {
            this.root.active(url);
        }
        return this;
    }

    open(url: string) {
        if (this.root) {
            this.root.open(url);
        }
        return this;
    }

    reset(names: string[]) {
        Tree.create(names, 'root', this);
        this.element.innerHTML = '';
        this.element.appendChild(this.root.$template);
        return this;
    }

}

@Template(
    '<li>' +
    '<i class="material-icons" data-tree-toggle>keyboard_arrow_right</i>' +
    '<a href></a>' +
    '<ul class="tree"></ul>' +
    '</li>',

    {
        href(ele: HTMLAnchorElement, attrs, tree: Menu) {
            ele.href = tree.path;
            ele.textContent = tree.name;
        },
        ul(ele: HTMLUListElement, attrs, tree: Menu) {
            if (tree.childs.length) {
                let f = document.createDocumentFragment();
                tree.childs.forEach(c => f.appendChild(c.$template));
                ele.appendChild(f);
            } else DOM.className(tree.$template, 'empty');

        }
    }
)
class Menu {

    $template: HTMLElement

    private childs: Menu[] = []

    constructor(public name: string, public path: string, public parent: Menu) {
    }

    // apply전에 미리 등록
    register(v: Menu) {
        this.childs.push(v);
        return this;
    }

    active(url: string) {
        DOM.className(this.$template, c_active, url.indexOf(this.path) !== -1);
        this.childs.forEach(c => c.active(url));
        return this;
    }

    open(url: string) {
        let {childs} = this;
        if (childs.length) {
            url.indexOf(this.path) !== -1 && DOM.className(this.$template, c_open, true);
            childs.forEach(c => c.open(url));
        }
        return this;
    }


    apply() {
        return this;
    }
}

export namespace Tree {

    let r_ease = /^\/+|\/+$/,
        r_split = /\//;


    function a(str: string, obj = {}) {
        let s = str.replace(r_ease, '').split(r_split),
            i = 0, l = s.length, v;
        for (; i < l; i++) {
            obj = (obj[(v = s[i])] || (obj[v] = {}))
        }
    }

    export function toObject(list: string, obj?)
    export function toObject(list: string[], obj?)
    export function toObject(list, obj = {}) {
        if (typeof list === 'string') a(list, obj);
        else {
            let l = list.length;
            while (l-- > 0) a(list[l], obj);
        }
        return obj;
    }


    function toTemplate(obj, root = new Menu('root', '', null), prefix = ''): Menu {
        if (obj) {
            let p;
            for (p in obj) {
                let _prefix = prefix + '/' + p;
                root.register(toTemplate(obj[p], new Menu(p, _prefix, root), _prefix));
            }
        }
        return root;
    }

    export function create(names: string[], rootName = 'root', tree = new Tree()) {
        let root = toTemplate(toObject(names));
        tree.root = root;
        return tree;
    }
}