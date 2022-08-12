import { Cart } from "./classes/cart/Cart";
import { Donation } from "./classes/donation/Donation";
import { Donor } from "./classes/donors/Donor";
import { DeliveryMethod } from "./classes/notifications/delivery_methods";
import { KinshipNotification } from "./classes/notifications/Notification";
import { NotificationType } from "./classes/notifications/notification_types";
import { CountryList } from "./classes/utility_classes/country_list";

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

const car = new Cart([], 50000, false)

// const donation = new Donation(donor, 50000, CountryList.CANADA, 50000, car, false, 0, 1480, true, "pi_3LUWxgBq7b4L3fUm3Etqb1Ey")
// const notif = new KinshipNotification(NotificationType.DONATION_MADE, donation, donor)
// notif.send(DeliveryMethod.EMAIL)