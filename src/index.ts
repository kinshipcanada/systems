import { Cart } from "./classes/cart/Cart";
import { Donation } from "./classes/donation/Donation";
import { Donor } from "./classes/donors/Donor";
import { DeliveryMethod } from "./classes/notifications/delivery_methods";
import { KinshipNotification } from "./classes/notifications/Notification";
import { NotificationType } from "./classes/notifications/notification_types";
import { CountryList } from "./classes/utility_classes/country_list";
import { Cause } from "./classes/utility_classes/interfaces";
import { RegionList } from "./classes/utility_classes/region_list";

const donor = new Donor({
    first_name: "Shakeel",
    last_name: "Hussein",
    stripe_cus_id: "ddd",
    email: "hobbleabbas@gmail.com",
    phone_number: 6475627867,
    address: {
        line_address: "43 Matson Dr",
        postal_code: "L7E0B1",
        city: "Bolton",
        state: "Ontario",
        country: CountryList.CANADA,
    }
}, "69696969696")

let causes: Cause[] = []

causes.push({
    region: RegionList.AFRICA,
    amount_in_cents: 50000,
    cause: "Orphans",
    recurring: false
})

causes.push({
    region: RegionList.INDIA,
    amount_in_cents: 25000,
    cause: "Education",
    recurring: false
})

causes.push({
    region: RegionList.INDIA,
    amount_in_cents: 50000,
    cause: "Infrastructure",
    recurring: false
})

const cart = new Cart(causes, 128625, true)

console.log(cart.formatted_cart)

// const donation = new Donation(donor, cart.total_amount_paid_in_cents, CountryList.CANADA, cart.total_amount_in_cents, cart, cart.fees_covered, )
// const dsonation = new Donation(donor, 50000, CountryList.CANADA, 50000, cart, false, 0, 1480,  true, "pi_3LUWxgBq7b4L3fUm3Etqb1Ey")

// const notif = new KinshipNotification(NotificationType.DONATION_MADE, donation, donor)
// notif.send(DeliveryMethod.EMAIL)