import { RegionList } from "./region_list";

export interface CauseMap {
    [cause: string] : number,
}

export type AmountForRegion = {
    [region_id in RegionList] : number
}

export interface Cause {
    cause: CauseMap,
    region: RegionList
}