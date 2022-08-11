import { Donation } from "../classes/donation/Donation";
import { Donor } from "../classes/donors/Donor";
import { KinshipError } from "../classes/errors/KinshipError";
import { DeliveryMethod } from "../classes/notifications/delivery_methods";
import { KinshipNotification } from "../classes/notifications/Notification";
import { NotificationType } from "../classes/notifications/notification_types";
import { kinship_config } from "../config";
import { PaymentMethods } from "./enums";
import { raw_stripe_transaction_object } from "./interfaces";
const Stripe = require('stripe');
const dotenv = require('dotenv')
dotenv.config();

const stripe_client = Stripe(kinship_config.PRODUCTION_MODE ? process.env.STRIPE_LIVE_API_KEY : process.env.STRIPE_TEST_API_KEY)

/**
 * @section interfaces: these form templates for responses from stripe
 */
export interface StripeTags {
    payment_intent_id: string,
    charge_id?: string,
    balance_transaction_id?: string,
}

/**
 * 
 * @section functions to fetch data from stripe
 */

export async function fetch_charge_object(charge_id: string) {
    return stripe_client.charges.retrieve(charge_id)
}

export async function fetch_payment_intent_object(payment_intent_id: string) {
    return stripe_client.paymentIntents.retrieve(payment_intent_id)
}

export async function fetch_balance_transaction_object(balance_transaction_id: string) {
    return stripe_client.balanceTransactions.retrieve(balance_transaction_id)
}

export async function fetch_customer_object(stripe_customer_id: string) {
    return stripe_client.customers.retrieve(stripe_customer_id)
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
    }

    if (!full_collection_mode) {

        stripe_promises.push(fetch_payment_intent_object(stripe_tags.payment_intent_id))
        
        if (stripe_tags.charge_id != null) { stripe_promises.push(fetch_charge_object(stripe_tags.charge_id)) }
        if (stripe_tags.balance_transaction_id != null) { stripe_promises.push(fetch_balance_transaction_object(stripe_tags.balance_transaction_id)) }
    
    } else {
        const payment_intent_object = await fetch_payment_intent_object(stripe_tags.payment_intent_id)
        const charge_object = payment_intent_object.charges.data[0]

        stripe_promises.push(fetch_balance_transaction_object(charge_object.balance_transaction))

        raw_data_from_stripe.payment_intent_object = payment_intent_object
        raw_data_from_stripe.charge_object = charge_object

        stripe_tags.charge_id = charge_object.id
        stripe_tags.balance_transaction_id = charge_object.balance_transaction
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
            console.log(result)
            raw_data_from_stripe.balance_transaction_object = result
        }
    }

    return [stripe_tags, raw_data_from_stripe]
}

export function format_stripe_objects(raw_data_from_stripe: raw_stripe_transaction_object) {

    return {
        "payment_intent_id": raw_data_from_stripe.payment_intent_object["id"],
        "charge_id": raw_data_from_stripe.charge_object["id"],
        "balance_transaction_id": raw_data_from_stripe.balance_transaction_object["id"],
        
    }
    return raw_data_from_stripe
}

let tags: StripeTags = {
    payment_intent_id: "pi_3LUWxgBq7b4L3fUm3Etqb1Ey"
}

fetch_donation_from_stripe(tags, true).then((val)=>{
    tags = val[0]
    console.log(format_stripe_objects(val[1]))
})

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