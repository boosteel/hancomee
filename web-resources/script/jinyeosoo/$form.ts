import {Forms} from "../../lib/core/form/Forms";
import {_remap} from "../../lib/core/_func/remap";

let div = document.createElement('div');
div.innerHTML = require("./$form.html");

type submitHandler = (e: Event, forms: CustomerForm) => void

export class CustomerForm extends Forms {

    private onsubmit: submitHandler

    constructor(form) {
        super(form);

        form.addEventListener('submit', (e) => {
            this.onsubmit && this.onsubmit(e, this);
            e.stopPropagation();
            e.preventDefault();
        })

        this.setHandlers(_remap({
            mobile: {
                set(inputs, v: string) {
                    if (v) {
                        v.split(/-/)
                            .forEach((val, i) => {
                                inputs[i].value = (val || '')
                            });
                    } else {
                        inputs.forEach(i => i.value = '');
                    }
                },
                get(inputs) {
                    let v = inputs.map(input => input.value).join('-');
                    return v.length === 2 ? '' : v;
                }
            },
            birth: 'mobile'
        }));
    }

    onSubmit(handler: submitHandler) {
        this.onsubmit = handler;
        return this;
    }
}


export let $form = new CustomerForm(<any>div.firstChild);