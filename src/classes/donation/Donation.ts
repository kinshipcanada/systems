import { Cart } from "../cart/Cart";
import { Donor } from "../donors/Donor";
import { CountryList } from "../utility_classes/country_list";

export class Donation {
    donor: Donor;
    amount_in_cents: number;
    native_currency: CountryList;
    native_amount_in_cents: number;
    fees_covered: boolean;
    fees_paid_in_cents: number;
    fees_charged_by_stripe: number;
    cart: Cart;

    constructor ( 
        donor: Donor,
        amount_in_cents: number,
        native_currency: CountryList,
        native_amount_in_cents: number,
        fees_covered: boolean,
        fees_paid_in_cents: number,
        fees_charged_by_stripe: number,
        cart: Cart,
    ) {
        this.donor = donor;
        this.amount_in_cents = amount_in_cents;
        this.native_currency = native_currency;
        this.native_amount_in_cents = native_amount_in_cents;
        this.fees_covered = fees_covered;
        this.fees_paid_in_cents = fees_paid_in_cents;
        this.fees_charged_by_stripe = fees_charged_by_stripe;
        this.cart = cart
    }
}