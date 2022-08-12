import { Cart } from "../classes/cart/Cart";
import { CartInterface } from "../classes/cart/CartInterface";
import { DonorAddress } from "../classes/utility_classes/address";
import { CurrencyList } from "../classes/utility_classes/currency_list";
import { KinshipPaymentMethod } from "../classes/utility_classes/payment_method";

export interface DatabaseDonation {
    donation_created: string,
    donor: string | null,
    email: string,
    phone_number: number,
    amount_in_cents: number,
    native_currency: CurrencyList,
    native_amount_in_cents?: number,
    fees_covered: boolean,
    fees_covered_in_cents: number,
    fees_charged_by_stripe: number,
    transaction_successful: boolean,
    transaction_refunded: boolean,
    payment_method: KinshipPaymentMethod,
    donation_causes: CartInterface,
    stripe_payment_intent_id: string,
    stripe_charge_id: string,
    stripe_balance_transaction_id: string,
    stripe_customer_id: string,
    address_line_address: DonorAddress["line_address"],
    address_country: DonorAddress["country"],
    address_postal_code: DonorAddress["postal_code"],
    address_city: DonorAddress["city"],
    address_state: DonorAddress["state"]
}