import { Donation } from "../classes/donation/Donation"

export interface BaseApiResponse {
    status: 200 | 400 | 500,
    endpoint_called: string
}

export interface SimpleMessageResponse extends BaseApiResponse {
    message: string
}

export interface DonationResponse extends BaseApiResponse {
    donation: Donation
}