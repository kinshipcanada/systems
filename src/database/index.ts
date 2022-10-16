import { KinshipError } from "../classes/errors/KinshipError";
import { DatabaseDonation } from "./interfaces";

require('dotenv').config();

const database = require('knex')({
    client: "pg",
    connection: process.env.DATABASE_URL
})

export function upload_donation_to_database(donation: DatabaseDonation) : Promise<any> {
    try {
        return database('donations').insert(donation)
    } catch (error) {
        new KinshipError(`Error uploading donation to database: ${error.message}`, "/src/database/index", "upload_donation_to_database")
        return
    }
}
