/**
 * @section interfaces: these form templates for responses from stripe
 */
export interface StripeTags {
    payment_intent_id: string,
    charge_id?: string,
    balance_transaction_id?: string,
    customer_id?: string,
    payment_method_id?: string
}

export interface raw_stripe_transaction_object {
    payment_intent_object: object,
    charge_object: object,
    balance_transaction_object: object,
    customer: object,
    payment_method: object
}
