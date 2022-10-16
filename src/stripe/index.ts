import Stripe from "stripe";
import { Cart } from "../classes/cart/Cart";
import { Donation } from "../classes/donation/Donation";
import { Donor } from "../classes/donors/Donor";
import { KinshipError } from "../classes/errors/KinshipError";
import { DeliveryMethod } from "../classes/notifications/delivery_methods";
import { KinshipNotification } from "../classes/notifications/Notification";
import { NotificationType } from "../classes/notifications/notification_types";
import { CountryList } from "../classes/utility_classes/country_list";
import { kinship_config } from "../config";
import { PaymentMethods } from "./enums";
import { raw_stripe_transaction_object, StripeTags } from "./interfaces";
const StripeClient = require('stripe');
const dotenv = require('dotenv')
dotenv.config();

const stripe_client = StripeClient(kinship_config.PRODUCTION_MODE ? process.env.STRIPE_LIVE_API_KEY : process.env.STRIPE_TEST_API_KEY)

/**
 * 
 * @section functions to fetch data from stripe
 */

export async function fetch_charge_object(charge_id: string) : Promise<Stripe.Charge> {
    return stripe_client.charges.retrieve(charge_id)
}

export async function fetch_payment_intent_object(payment_intent_id: string) : Promise<Stripe.PaymentIntent> {
    return stripe_client.paymentIntents.retrieve(payment_intent_id)
}

export async function fetch_balance_transaction_object(balance_transaction_id: string) : Promise<Stripe.BalanceTransaction>  {
    return stripe_client.balanceTransactions.retrieve(balance_transaction_id)
}

export async function fetch_customer_object(stripe_customer_id: string) : Promise<Stripe.Customer> {
    return stripe_client.customers.retrieve(stripe_customer_id) as Promise<Stripe.Customer>
}

export async function fetch_specific_payment_method(payment_method_id: string) : Promise<Stripe.PaymentMethod>  {
    return stripe_client.paymentMethods.retrieve(payment_method_id) as Promise<Stripe.PaymentMethod>
}

export async function fetch_payment_methods(stripe_customer_id: string, payment_method_type: PaymentMethods = PaymentMethods.CARD) {
    return stripe_client.stripe.paymentMethods.retrieve(
        stripe_customer_id,
        { type: payment_method_type }
    )
}

export async function fetch_donation_from_stripe(stripe_tags: StripeTags, full_collection_mode: boolean = false) : Promise<[StripeTags, raw_stripe_transaction_object]> {
    /**
     * @description fetches all objects representing the donation on Stripe
     * @param stripe_tags - StripeTags object containing, at minimum, the payment intent id
     * @param full_collection_mode - if set to true, all objects (payment_intent, balance_txn, charge) are collected. if not, just the ids available in the tags
     * @returns [StripeTags, raw_stripe_transaction_object] - object containing updated StripeTags and a raw_stripe_transaction_object
     */
    let stripe_promises = []

    let raw_data_from_stripe: raw_stripe_transaction_object = {
        payment_intent_object: null,
        charge_object: null,
        balance_transaction_object: null,
        customer: null,
        payment_method: null
    }

    if (!full_collection_mode) {

        if (stripe_tags.payment_intent_id != null) { stripe_promises.push(fetch_payment_intent_object(stripe_tags.payment_intent_id)) }
        if (stripe_tags.charge_id != null) { stripe_promises.push(fetch_charge_object(stripe_tags.charge_id)) }
        if (stripe_tags.balance_transaction_id != null) { stripe_promises.push(fetch_balance_transaction_object(stripe_tags.balance_transaction_id)) }
        if (stripe_tags.payment_method_id != null) { stripe_promises.push(fetch_specific_payment_method(stripe_tags.payment_method_id)) }
        if (stripe_tags.customer_id != null) { stripe_promises.push(fetch_customer_object(stripe_tags.customer_id)) }

    } else {

        if (!stripe_tags.charge_id && !stripe_tags.payment_intent_id) {
            new KinshipError("Pass in either the charge id or payment intent ID to fetch a donation from Stripe", "/src/stripe/index", "fetch_donation_from_stripe", true)
            return
        }

        let payment_intent_object: Stripe.PaymentIntent;
        let charge_object: Stripe.Charge;

        if (stripe_tags.payment_intent_id) {
            payment_intent_object = await fetch_payment_intent_object(stripe_tags.payment_intent_id)
            charge_object = payment_intent_object.charges.data[0]
        } else if (stripe_tags.charge_id) {
            charge_object = await fetch_charge_object(stripe_tags.charge_id)
            payment_intent_object = await fetch_payment_intent_object(charge_object.payment_intent as string)
        }
        

        stripe_promises.push(fetch_balance_transaction_object(charge_object.balance_transaction as string))
        stripe_promises.push(fetch_specific_payment_method(charge_object.payment_method as string))
        stripe_promises.push(fetch_customer_object(charge_object.customer as string))

        raw_data_from_stripe.payment_intent_object = payment_intent_object
        raw_data_from_stripe.charge_object = charge_object

        stripe_tags.charge_id = charge_object.id
        stripe_tags.balance_transaction_id = charge_object.balance_transaction as string
        stripe_tags.customer_id = charge_object.customer as string
        stripe_tags.payment_method_id = charge_object.payment_method

    }

    const stripe_results = await Promise.all(stripe_promises)

    for (const result of stripe_results) {
        if (result.object == 'payment_intent') {
            raw_data_from_stripe.payment_intent_object = result
        }

        if (result.object == 'charge') { 
            raw_data_from_stripe.charge_object = result
        }

        if (result.object == 'balance_transaction') {
            raw_data_from_stripe.balance_transaction_object = result
        }

        if (result.object == 'customer') {
            raw_data_from_stripe.customer = result
        }

        if (result.object == 'payment_method') {
            raw_data_from_stripe.payment_method = result
        }
    }

    return [stripe_tags, raw_data_from_stripe]
}

export function build_donation_from_raw_stripe_data(stripe_data: raw_stripe_transaction_object) {
    const donor = new Donor({
        first_name: stripe_data.charge_object.metadata.custom_first_name ? stripe_data.charge_object.metadata.custom_first_name : stripe_data.customer.metadata.first_name as string,
        last_name: stripe_data.charge_object.metadata.custom_last_name ? stripe_data.charge_object.metadata.custom_last_name : stripe_data.customer.metadata.first_name as string,
        stripe_cus_id: stripe_data.customer.id,
        email: stripe_data.customer.email,
        phone_number: parseInt(stripe_data.customer.phone),
        address: {
            line_address: stripe_data.customer.address.line1,
            postal_code: stripe_data.customer.address.postal_code,
            city: stripe_data.customer.address.city,
            state: stripe_data.customer.address.state,
            country: stripe_data.customer.address.country == "Canada" ? CountryList.CANADA : stripe_data.customer.address.country == "United States" ? CountryList.UNITED_STATES : CountryList.UNDEFINED,
        }
    }, (stripe_data.customer.metadata != null && stripe_data.customer.metadata != undefined) ? stripe_data.customer.metadata.user_id : null)

    const amount_in_cents = stripe_data.charge_object.amount_captured
    const native_currency = stripe_data.charge_object.currency == "cad" ? CountryList.CANADA : stripe_data.charge_object.currency == "usd" ? CountryList.UNITED_STATES : CountryList.UNDEFINED
    const amount_captured = stripe_data.charge_object.amount_captured
    const fees_covered = stripe_data.charge_object.metadata.fees_covered ? Boolean(stripe_data.charge_object.metadata.fees_covered) : false
    const fees_paid_in_cents = fees_covered ? stripe_data.charge_object.amount_captured / 1.029 : 0
    const fees_charged_by_stripe = stripe_data.balance_transaction_object.fee
    const cart = new Cart([], stripe_data.charge_object.amount_captured, fees_covered)
    
    const donation = new Donation(
        donor, 
        amount_in_cents, 
        native_currency,
        amount_captured,
        cart,
        fees_covered,
        fees_paid_in_cents,
        fees_charged_by_stripe,
        stripe_data.payment_method,
        stripe_data.payment_intent_object.id,
        stripe_data.charge_object.id,
        stripe_data.balance_transaction_object.id,
        stripe_data.customer.id
    )

    return donation
}

/**
 * @section push functions - these update data on stripe
 */
export async function update_charge_metadata(additional_metadata: object, merge: boolean = true, donation?: Donation, stripe_charge_id?: string) {
    /**
     * @description adds metadata to a stripe charge object
     * @param additional_metadata - the new data to add
     * @param merge - if set to false, the new data will replace the old data
     * @param donation - donation to update. Either this or stripe_charge_id must be provided
     * @param stripe_charge_id - charge id to update. Either this or donation must be provided
     */

    try {
        return
    } catch (error) {
        new KinshipError(`Error updating charge metadata: ${error}`, "/src/stripe/index", "update_charge_metadata", true)
        return null
    }
}

export async function update_payment_method(donor: Donor) {
    /**
     * @description updates a payment method on file for a donor
     */
    try {
        return
    } catch (error) {
        new KinshipError(`Error updating donor ${donor.email} payment method ${donor.donor_id ? `(id: ${donor.donor_id})` : "(not logged in)"}: ${error}`, "/src/stripe/index", "update_payment_method", true)
        return null
    }
}

export async function refund_payment(donation: Donation, delivery_method: DeliveryMethod) {
    /**
     * @description refunds a donation, and updates object on database
     */
    try {

        const notification = new KinshipNotification(NotificationType.REFUND_PROCESSING, donation, donation.donor)
        if (delivery_method) {
            await notification.send(delivery_method)
        } else {
            await Promise.all([
                notification.send(DeliveryMethod.EMAIL),
                notification.send(DeliveryMethod.PHONE)
            ])
        }
        return
    } catch (error) {
        new KinshipError(`Error refunding payment: ${error}`, "/src/stripe/index", "update_charge_metadata", true)
        return null
    }
}

/**
 * @section functions to create data on Stripe
 */

export async function create_stripe_customer(auth_0_user: any) {
    return stripe_client.customers.create({
        description: "Customer ID created on signup by Kinship API",
        email: auth_0_user.email,
        metadata: {
            user_id: auth_0_user.user_id,
            email: auth_0_user.email
        }
    })
}