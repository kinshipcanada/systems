import { CountryList } from "./country_list";

export interface DonorAddress {
    line_address: string,
    state: string,
    city: string,
    postal_code: string,
    country: CountryList
}