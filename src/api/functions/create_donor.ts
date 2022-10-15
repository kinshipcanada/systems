import { create_stripe_customer } from "../../stripe"
import { PrismaClient } from '@prisma/client'
const axios = require("axios").default;
const prisma = new PrismaClient()

export async function create_donor(auth_0_user: any) {

    // Get stripe customer id
    const stripe_customer = await create_stripe_customer(auth_0_user);

    // Fill out database
    await prisma.donors.create({
        data: {
            id: auth_0_user.user_id,
            stripe_customer_id: stripe_customer.id,
            email: auth_0_user.email,
            email_verified: auth_0_user.email_verified,
            created_at: auth_0_user.created_at
        }
    })

    await prisma.$disconnect

    return stripe_customer.id
}