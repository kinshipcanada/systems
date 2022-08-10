import { Donation } from "../donation/Donation";
import { Donor } from "../donors/Donor";
import { Event } from "../events/Event";
import { EventTypes } from "../events/event_types";
import { CountryList } from "../utility_classes/country_list";
import { DeliveryMethod } from "./delivery_methods";
import { NotificationType } from "./notification_types";
import { Templates } from "./Templates";
const twilio = require('twilio')
const sendgrid = require('@sendgrid/mail')
require('dotenv').config();

export class KinshipNotification extends Event {
    notification_type: NotificationType;
    donor: Donor;
    recipient_email: string;
    recipient_phone_number: number;
    recipient_country: CountryList;
    donation: Donation

    constructor ( 
        id: string, 
        notification_type: NotificationType, 
        donation: Donation,
        donor?: Donor,
        recipient_email?: string, 
        recipient_phone_number?: number, 
        recipient_country?: CountryList,
    ) {
        super(id, EventTypes.NOTIFICATION)

        this.notification_type = notification_type;
        this.donation = donation
        this.donor = donor

        if (!donor && (!(recipient_email && recipient_country)) && (!(recipient_phone_number && recipient_country))) {
            throw new Error(`Could not create new notification ${id}: please provide a donor object, or a phone + country, or a email + country`)
        }
    }

    async send(method: DeliveryMethod) {
        /**
         * Sends notification out
         */
        
        if (this.notification_type == NotificationType.RECEIPT_AVAILABLE && this.recipient_country != CountryList.CANADA) {
            throw new Error("Can only issue receipts to Canadians")
        }

        const template = Templates(this.notification_type, this.donor, this.donation)

        if (method == DeliveryMethod.PHONE) {

            const twilio_client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
            const message = await twilio_client.messages.create({
                body: template.sms_friendly_message,
                to: this.donor.formatted_phone_number(), 
                from: this.donor.address.country == CountryList.CANADA ? process.env.TWILIO_CANADIAN_NUMBER : process.env.TWILIO_USA_NUMBER,
            })

            this.log_event(message.sid);
            return

        } else if (method == DeliveryMethod.EMAIL) {

            sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

            const message = await sendgrid.send({
                to: this.donor.email,
                from: process.env.SENDGRID_FROM_EMAIL,
                subject: template.email_subject,
                text: template.email_body
            })

            this.log_event(message[0].statusCode)
            return

        }
        
    }
}
