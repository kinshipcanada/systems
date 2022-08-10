import { Cart } from "../cart/Cart";
import { Donor } from "../donors/Donor";
import { CountryList } from "../utility_classes/country_list";

interface StripeTags {
    idempotency_key: string,
    payment_intent_id: string,
    charge_id?: string,
    balance_transaction_id?: string,
    checkout_session_id?: string,
}

interface StripeObject {
    donation: { },
}

export class Donation {
    donor: Donor;

    amount_in_cents: number;
    native_currency: CountryList;
    native_amount_in_cents: number;

    fees_covered: boolean;
    fees_paid_in_cents: number;
    fees_charged_by_stripe: number;

    date_donated: Date;
    date_logged: Date;

    transaction_successful: boolean;
    transaction_refunded: boolean;

    stripe_data: StripeTags;

    cart: Cart;

    constructor ( 
        donor: Donor,
        amount_in_cents: number,
        native_currency: CountryList,
        native_amount_in_cents: number,
        cart: Cart,
        fees_covered: boolean,
        fees_paid_in_cents: number,
        fees_charged_by_stripe: number,
        stripe_idempotency_key: string,
        stripe_payment_intent_id: string,
        stripe_charge_id?: string,
        stripe_balance_transaction_id?: string,
        stripe_checkout_session_id?: string,
    ) {
        this.donor = donor;
        this.amount_in_cents = amount_in_cents;
        this.native_currency = native_currency;
        this.native_amount_in_cents = native_amount_in_cents;
        this.fees_covered = fees_covered;
        this.fees_paid_in_cents = fees_paid_in_cents;
        this.fees_charged_by_stripe = fees_charged_by_stripe;
        this.cart = cart
        this.stripe_data = {
            idempotency_key: stripe_idempotency_key,
            payment_intent_id: stripe_payment_intent_id,
            charge_id: stripe_charge_id,
            balance_transaction_id: stripe_balance_transaction_id,
            checkout_session_id: stripe_checkout_session_id,
        }
    }

    async fetch_donation_from_stripe(full_collection_mode: boolean = false) {
        return 0
    }
}