import { Donation } from "../donation/Donation";
import { Donor } from "../donors/Donor";
import { KinshipEvent } from "../events/KinshipEvent";
import { EventTypes } from "../events/event_types";
import { CountryList } from "../utility_classes/country_list";
import { DeliveryMethod } from "./delivery_methods";
import { NotificationType } from "./notification_types";
import { Templates } from "./Templates";
import { v4 as uuidv4 } from 'uuid';
import { KinshipError } from "../errors/KinshipError";
const twilio = require('twilio')
const postmark = require("postmark");

require('dotenv').config();

export class KinshipNotification extends KinshipEvent {
    notification_id;
    notification_type: NotificationType;
    donor: Donor;
    donation: Donation
    
    constructor ( 
        notification_type: NotificationType, 
        donation: Donation,
        donor: Donor,
        notification_id = uuidv4()
    ) {
        
        super(notification_id, EventTypes.NOTIFICATION)

        this.notification_id = notification_id;
        this.notification_type = notification_type;
        this.donation = donation
        this.donor = donor
    }

    async send(method: DeliveryMethod) {
        /**
         * @description Sends notification out, by either phone or email.
         */
        
        if (this.notification_type == NotificationType.RECEIPT_AVAILABLE && this.donor.address.country != CountryList.CANADA) {
            new KinshipError("Can only issue receipts to Canadians", "/src/classes/notifications", "send", true)
            return
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

            const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

            console.log("SENDING TO: ", this.donor.email)
            // const message = await sendgrid.send({
            //     to: this.donor.email,
            //     from: process.env.SENDGRID_FROM_EMAIL,
            //     subject: template.email_subject,
            //     text: template.email_body
            // })

            await client.sendEmail({
                "From": process.env.SENDGRID_FROM_EMAIL,
                "To": this.donor.email,
                "Subject": template.email_subject,
                "TextBody": template.email_body
            });

            this.log_event("Sent email to " + this.donor.email);
            return

        }
        
    }
}
