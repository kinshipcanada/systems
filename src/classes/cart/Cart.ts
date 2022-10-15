import { AmountForRegion, Cause } from "../utility_classes/interfaces"
import { RegionList } from "../utility_classes/region_list"
import { CartInterface } from "./CartInterface"

export interface BreakdownByRegion {
    total_amount_in_cents_for_region: number,
    causes: { [cause_name: string]: number }
}
export interface FormattedCart {
    total_amount_paid_in_cents: number
    total_amount_to_send_in_cents: number
    fees_covered: boolean,
    fees_paid_in_cents: number,
    regions: { [region in RegionList]: BreakdownByRegion }
}

export class Cart {

    causes: Cause[]
    total_amount_paid_in_cents: number
    total_amount_to_send_in_cents: number
    fees_covered: boolean
    fees_paid_in_cents: number
    formatted_cart: FormattedCart

    constructor (causes: Cause[], total_amount_paid_in_cents: number, fees_covered: boolean) {
        
        this.causes = causes
        this.total_amount_paid_in_cents = total_amount_paid_in_cents
        this.fees_covered = fees_covered
        
        const breakdown_by_region_and_cause = this.calculate_breakdown_by_region_and_cause(causes)
        const total_amount_per_region = this.calculate_total_amount_by_region(breakdown_by_region_and_cause)
        this.calculate_fees_paid_in_cents(total_amount_per_region)
        this.create_formatted_cart(breakdown_by_region_and_cause, total_amount_per_region)

    }

    calculate_fees_paid_in_cents (total_amount_per_region) {

        let total = 0

        for (const region of Object.keys(total_amount_per_region)) {
            total += total_amount_per_region[region]
        }

        if (this.fees_covered) {
            this.fees_paid_in_cents = 0.029 * total
        } else {
            this.fees_paid_in_cents = 0
        }

        this.total_amount_to_send_in_cents = total
    }

    calculate_breakdown_by_region_and_cause (causes = this.causes) : any {
        
        let regions = {
            "AF": {},
            "IN": {},
            "ME": {},
            "CA": {}
        }

        for (const cause_object of causes) {
            let cause = cause_object.cause
            let amount_in_cents = cause_object.amount_in_cents
            let region = cause_object.region
            
            if (regions[region][cause]) {
                regions[region][cause] += amount_in_cents
            } else {
                regions[region][cause] = amount_in_cents
            }
        }

        return regions
    }

    calculate_total_amount_by_region (breakdown_by_region_and_cause: object) {
        let regions = {
            "AF": 0,
            "IN": 0,
            "ME": 0,
            "CA": 0
        }

        for (const region of Object.keys(regions)) {
            for (const cause of Object.keys(breakdown_by_region_and_cause[region])) {
                regions[region] += breakdown_by_region_and_cause[region][cause]
            }
        }

        return regions
    }

    create_formatted_cart (breakdown_by_region_and_cause, total_amount_per_region) {

        let regions: { [region in RegionList]: BreakdownByRegion } = {
            "AF": {
                total_amount_in_cents_for_region: 0,
                causes: {}
            },
            "IN": {
                total_amount_in_cents_for_region: 0,
                causes: {}
            },
            "ME": {
                total_amount_in_cents_for_region: 0,
                causes: {}
            },
            "CA": {
                total_amount_in_cents_for_region: 0,
                causes: {}
            },
        }

        for (const region of Object.keys(breakdown_by_region_and_cause)) {
            regions[region]["causes"] = breakdown_by_region_and_cause[region]
        }

        for (const region of Object.keys(total_amount_per_region)) {
            regions[region]["total_amount_in_cents_for_region"] = total_amount_per_region[region]
        }

        this.formatted_cart = {
            total_amount_paid_in_cents: this.total_amount_paid_in_cents,
            total_amount_to_send_in_cents: this.total_amount_to_send_in_cents,
            fees_covered: this.fees_covered,
            fees_paid_in_cents: this.fees_paid_in_cents,
            regions: regions
        }
    }

    public format_cart_for_upload(): CartInterface {
        return {
            causes: [],
            regions: []
        }
    }
}