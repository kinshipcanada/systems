import { Donation } from "../donation/Donation";
import { Donor } from "../donors/Donor";
import { CountryList } from "../utility_classes/country_list";
import { NotificationType } from "./notification_types";

export interface NotificationTemplate {
    email_subject: string;
    email_body: string;
    sms_friendly_message: string;
}

export function Templates( notification_type: NotificationType, donor: Donor, donation: Donation ) : NotificationTemplate {

    switch (notification_type) {
        case NotificationType.DONATION_MADE: {
            return {
                email_body: `
                Dear ${donor.first_name},
                
                Thank you for your donation of ${donation.native_amount_in_cents/100} ${donation.native_currency == CountryList.CANADA ? "CAD" : CountryList.UNITED_STATES ? "USD" : null }. 

                TBD
                `, 
                email_subject: "Thank you for your donation.",
                sms_friendly_message: "Thank you fr your donatoon"
            }
        }

        case NotificationType.DONATION_SENT: {
            return {
                email_body: `
                Dear ${donor.first_name},
                
                Thank you for your donation of ${donation.native_amount_in_cents/100} ${donation.native_currency == CountryList.CANADA ? "CAD" : CountryList.UNITED_STATES ? "USD" : null }. 

                TBD
                `, 
                email_subject: "Thank you for your donation.",
                sms_friendly_message: "Thank you fr your donatoon"
            }
        }

        case NotificationType.PROOF_AVAILABLE: {
            return {
                email_body: `
                Dear ${donor.first_name},
                
                Thank you for your donation of ${donation.native_amount_in_cents/100} ${donation.native_currency == CountryList.CANADA ? "CAD" : CountryList.UNITED_STATES ? "USD" : null }. 

                PROOF_AVAILABLE
                `, 
                email_subject: "PROOF_AVAILABLE you for your donation.",
                sms_friendly_message: "PROOF_AVAILABLE you fr your donatoon"
            }
        }

        case NotificationType.RECEIPT_AVAILABLE: {
            return {
                email_body: `
                Dear ${donor.first_name},
                
                Thank you for your donation of ${donation.native_amount_in_cents/100} ${donation.native_currency == CountryList.CANADA ? "CAD" : CountryList.UNITED_STATES ? "USD" : null }. 

                RECEIPT_AVAILABLE
                `, 
                email_subject: "RECEIPT_AVAILABLE you for your donation.",
                sms_friendly_message: "RECEIPT_AVAILABLE you fr your donatoon"
            }
        }

        case NotificationType.REFUND_ISSUED: {
            return {
                email_body: `
                Dear ${donor.first_name},
                
                Thank you for your donation of ${donation.native_amount_in_cents/100} ${donation.native_currency == CountryList.CANADA ? "CAD" : CountryList.UNITED_STATES ? "USD" : null }. 

                REFUND_ISSUED
                `, 
                email_subject: "TREFUND_ISSUED",
                sms_friendly_message: "Thank you fr REFUND_ISSUED donatoon"
            }
        }

        case NotificationType.REFUND_PROCESSING: {
            return {
                email_body: `
                Dear ${donor.first_name},
                
                Thank you for your donation of ${donation.native_amount_in_cents/100} ${donation.native_currency == CountryList.CANADA ? "CAD" : CountryList.UNITED_STATES ? "USD" : null }. 

                REFUND_PROCESSING
                `, 
                email_subject: "REFUND_PROCESSING",
                sms_friendly_message: "REFUND_PROCESSING"
            }
        }

    }
}