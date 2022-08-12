import { AmountForRegion, Cause } from "../utility_classes/interfaces"
import { RegionList } from "../utility_classes/region_list"
import { CartInterface } from "./CartInterface"

export class Cart {

    causes: Cause[]
    total_amount_in_cents: number
    fees_covered: boolean
    total_amount_per_region: AmountForRegion[]

    constructor (causes: Cause[], total_amount_in_cents: number, fees_covered: boolean) {
        
        this.causes = causes
        this.total_amount_in_cents = total_amount_in_cents
        this.fees_covered = fees_covered
        this.total_amount_per_region = this.calculate_total_amount_per_region(causes)

    }

    calculate_total_amount_per_region (causes = this.causes) : AmountForRegion[] {
        
        let regions = {
            "AF": 0,
            "IN": 0,
            "ME": 0,
            "CA": 0
        }

        for (const cause_object of causes) {
            let cause = cause_object.cause
            let region = cause_object.region
            
            regions[region] += cause.value
        }

        return
    }

    public format_cart_for_upload(): CartInterface {
        return {
            causes: [],
            regions: []
        }
    }
}