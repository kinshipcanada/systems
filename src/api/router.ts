import express, { Request, Response } from "express";
import { KinshipError } from "../classes/errors/KinshipError";
import fetch_donation from "./functions/fetch_donation";
import { BatchedDonationResponse, DonationResponse, SimpleMessageResponse } from "./interfaces";

export const api_router = express.Router();

api_router.get("/", async (req: Request, res: Response) => {
    try {
        const api_response: SimpleMessageResponse = {
            status: 200,
            endpoint_called: "/",
            message: "Welcome to the Kinship Canada API. We're open source, check out our GitHub here: https://github.com/kinshipcanada/systems"
        }
        
        res.status(200).send(api_response);
    } catch (e) {
        res.status(500).send(e.message);
    }
});


api_router.get("/donation/:donation_id",  async (req: Request, res: Response) => {
    const donation_id: string = req.params.donation_id

    try {
        fetch_donation(donation_id).then((donation_object)=>{
            const successful_response: DonationResponse = {
                status: 200,
                endpoint_called: `/donation/${donation_id}`,
                donation: donation_object
            }
            return res.status(200).send(successful_response);
        }).catch((error)=>{
            const error_response: SimpleMessageResponse = {
                status: 500,
                endpoint_called: `/donation/${donation_id}`,
                message: error.message
            }
            return res.status(500).send(error_response);
        })
    } catch (error) {
        new KinshipError(`Error in api request : ${JSON.stringify(error)}`, "/src/api/router", "api_router.get('/fetch_donation')", true)
        res.status(500).send(error.message);
    }
});

api_router.get("/donation/batch/:list_of_donation_ids",  async (req: Request, res: Response) => {
    const list_of_donation_ids: string[] = req.params.list_of_donation_ids.split(',')

    try {

        let donations = []

        for (const donation_id of list_of_donation_ids) {
            donations.push(fetch_donation(donation_id))
        }

        await Promise.all(donations).then((donations_object)=>{
            const successful_response: BatchedDonationResponse = {
                status: 200,
                endpoint_called: `/donation/batch/${req.params.list_of_donation_ids}`,
                donations: donations_object
            }
            return res.status(200).send(successful_response);
        }).catch((error)=>{
            const error_response: SimpleMessageResponse = {
                status: 500,
                endpoint_called: `/donation/batch/${req.params.list_of_donation_ids}`,
                message: error.message
            }
            return res.status(500).send(error_response);
        })

    } catch (error) {
        new KinshipError(`Error in api request : ${JSON.stringify(error)}`, "/src/api/router", "api_router.get('/fetch_donation')", true)
        res.status(500).send(error.message);
    }
});
