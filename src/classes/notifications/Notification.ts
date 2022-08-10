import { Donor } from "../donors/Donor";
import { Event } from "../events/Event";
import { EventTypes } from "../events/event_types";
import { country_list } from "../utility_classes/country_list";
import { DeliveryMethod } from "./delivery_methods";
import { NotificationType } from "./notification_types";

export class Notification extends Event {
    notification_type: NotificationType;
    donor: Donor;
    recipient_email: string;
    recipient_phone_number: number;
    recipient_country: country_list;

    constructor ( 
        id: string, 
        notification_type: NotificationType, 
        donor?: Donor,
        recipient_email?: string, 
        recipient_phone_number?: number, 
        recipient_country?: country_list,
    ) {
        super(id, EventTypes.NOTIFICATION)

        this.notification_type = notification_type;

        if (!donor && (!(recipient_email && recipient_country)) && (!(recipient_phone_number && recipient_country))) {
            throw new Error(`Could not create new notification ${id}: please provide a donor object, or a phone + country, or a email + country`)
        }
    }

    async send(method: DeliveryMethod) {
        /**
         * Sends notification out
         */
        
        if (this.notification_type == NotificationType.RECEIPT_AVAILABLE && this.recipient_country != country_list.CANADA) {
            throw new Error("Can only issue receipts to Canadians")
        }

        
    }
}
