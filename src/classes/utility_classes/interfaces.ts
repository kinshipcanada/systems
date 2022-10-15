import { RegionList } from "./region_list";

export type AmountForRegion = {
    [region_id in RegionList] : number
}

export interface Cause {
    cause: string,
    amount_in_cents: number,
    region: RegionList,
    recurring: boolean
}