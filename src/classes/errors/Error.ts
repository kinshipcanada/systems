export class KinshipError {
    constructor ( message: string, file_name: string, function_name: string, log_error: boolean = true ) {
        throw new Error(message)
    }
}