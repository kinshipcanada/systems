import { CountryList } from "../utility_classes/country_list"

export interface donor_details {
    first_name: string,
    last_name: string,
    stripe_cus_id: string,
    email: string,
    phone_number?: number
    address: {
        line_address: string,
        postal_code: string,
        city: string,
        state: string,
        country: CountryList,
    }
}