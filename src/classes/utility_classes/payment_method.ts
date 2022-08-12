import { PaymentMethods } from "../../stripe/enums";

export interface KinshipPaymentMethod {
    type: PaymentMethods,
    card_brand?: string,
    checks: {
        address_line1_check_passed: boolean,
        address_postal_code_check_passed: boolean,
        cvc_check_passed: boolean
    }
}

