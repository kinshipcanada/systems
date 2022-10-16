import Stripe from "stripe";
import { DatabaseDonation } from "../../database/interfaces";
import { PaymentMethods } from "../../stripe/enums";
import { StripeTags } from "../../stripe/interfaces";
import { Cart } from "../cart/Cart";
import { Donor } from "../donors/Donor";
import { CountryList } from "../utility_classes/country_list";
import { CurrencyList } from "../utility_classes/currency_list";
import { KinshipPaymentMethod } from "../utility_classes/payment_method";

export class Donation {
    donor: Donor;

    amount_in_cents: number;
    native_currency: CountryList;
    native_amount_in_cents: number;

    fees_covered: boolean;
    fees_paid_in_cents: number;
    fees_charged_by_stripe: number;

    date_donated;
    date_logged: Date;

    transaction_successful: boolean;
    transaction_refunded: boolean;

    stripe_tags: StripeTags;
    recurring_donation: boolean;

    payment_method: Stripe.PaymentMethod

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
        payment_method: Stripe.PaymentMethod,
        stripe_payment_intent_id?: string,
        stripe_charge_id?: string,
        stripe_balance_transaction_id?: string,
        stripe_customer_id?: string,
    ) {
        this.donor = donor;
        this.amount_in_cents = amount_in_cents;
        this.native_currency = native_currency;
        this.native_amount_in_cents = native_amount_in_cents;
        this.fees_covered = fees_covered;
        this.fees_paid_in_cents = fees_paid_in_cents;
        this.fees_charged_by_stripe = fees_charged_by_stripe;
        this.cart = cart
        this.payment_method = payment_method
        this.stripe_tags = {
            payment_intent_id: stripe_payment_intent_id,
            charge_id: stripe_charge_id,
            balance_transaction_id: stripe_balance_transaction_id,
            customer_id: stripe_customer_id
        }

        this.date_donated = Date.now()

    }

    async store_donation() {
        /**
         * logs donation in database
         */
    }

    format_donation_for_upload() : DatabaseDonation {

        const kinship_formatted_payment_method: KinshipPaymentMethod = {
            card_brand: this.payment_method.card.brand,
            checks: {
                address_line1_check_passed: this.payment_method.card.checks.address_line1_check == "pass" ? true : false,
                address_postal_code_check_passed: this.payment_method.card.checks.address_postal_code_check == "pass" ? true : false,
                cvc_check_passed: this.payment_method.card.checks.cvc_check == "pass" ? true : false
            },
            // Currently only support cards
            type: PaymentMethods.CARD
        }

        const formatted_cart = this.cart.format_cart_for_upload()

        const formatted_donation: DatabaseDonation = {
            donation_created: new Date().toDateString(),
            // Update this
            donor: null,
            email: this.donor.email,
            phone_number: this.donor.phone_number ? this.donor.phone_number : null,
            amount_in_cents: parseInt(this.amount_in_cents.toString()),
            native_currency: this.native_currency == CountryList.CANADA ? CurrencyList.CANADIAN_DOLLAR : CountryList.UNITED_STATES ? CurrencyList.UNITED_STATES_DOLLAR : null,
            native_amount_in_cents: this.native_currency != CountryList.CANADA ? this.native_amount_in_cents : null,
            fees_covered: this.fees_covered,
            fees_covered_in_cents: parseInt(this.fees_paid_in_cents.toString()),
            fees_charged_by_stripe: this.fees_charged_by_stripe,
            // Hardcoding true for now, later we will log attempted txns too
            transaction_successful: true,
            // Need to add this
            transaction_refunded: false,
            payment_method: kinship_formatted_payment_method,
            donation_causes: formatted_cart,
            stripe_payment_intent_id: this.stripe_tags.payment_intent_id,
            stripe_charge_id: this.stripe_tags.charge_id,
            stripe_balance_transaction_id: this.stripe_tags.balance_transaction_id,
            stripe_customer_id: this.stripe_tags.customer_id,
            address_line_address: this.donor.address.line_address,
            address_country: this.donor.address.country,
            address_postal_code: this.donor.address.postal_code,
            address_city: this.donor.address.city,
            address_state: this.donor.address.state
        }

        return formatted_donation
    }
}