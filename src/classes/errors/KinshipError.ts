import { KinshipEvent } from "../events/KinshipEvent";
import { EventTypes } from "../events/event_types";
import { v4 as uuidv4 } from 'uuid';

export class KinshipError extends KinshipEvent {
    constructor ( message: string, file_name: string, function_name: string, log_error: boolean = true ) {

        const error_id = uuidv4();

        super (error_id, EventTypes.INTERNAL_ERROR)

        if (log_error) {
            this.log_event(`Error at function ${function_name} in file ${file_name}: ${message}`)
        }
        
        throw new Error(message)
    }
}