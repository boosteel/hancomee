import "../../../lib/core/component/toggle";
import {Customer} from "../$data";
import {$form} from "../$form";
import {Src} from "./_src";

export default function (init: InitData) {

    return class C extends Src {

        constructor() {
            super('customer', init);
        }
        $init(ele: HTMLElement) {
        }
        $load(customer: Customer, element: HTMLElement) {
            element.appendChild($form.onSubmit(() => {
                let newVal = new Customer($form.values()).setId(customer.id);
                Customer.save(newVal).then(id => {
                    $form.reset(newVal)
                    customer = newVal;
                    alert('회원정보가 수정되었습니다.');
                });
            }).reset(customer).element)
        }

        close() {

        }
    }

}

