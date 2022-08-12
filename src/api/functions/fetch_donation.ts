import { Donation } from "../../classes/donation/Donation";
import { KinshipError } from "../../classes/errors/KinshipError";
import { build_donation_from_raw_stripe_data, fetch_donation_from_stripe } from "../../stripe";
import { StripeTags } from "../../stripe/interfaces";

export default async function fetch_donation( donation_id : string ) : Promise<Donation> {
    
    if (donation_id.substring(0, 3) == "pi_") {

        try {
            const tags: StripeTags = {
                "payment_intent_id": donation_id
            }
            const raw_stripe_data = await fetch_donation_from_stripe(tags, true)
            const donation = build_donation_from_raw_stripe_data(raw_stripe_data[1])
            return donation

        } catch (error) {
            new KinshipError(error, "/api/functions/fetch_donation", "fetch_donation")
            throw new Error("Invalid payment intent id")
        }

    } else if (donation_id.substring(0, 3) == "ch_") {
        return null
    } else {
        return null
    }
    
}