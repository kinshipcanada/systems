import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { api_router } from "./router";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/", api_router)

app.listen(port, () => {
    console.log(`Kinship API listening on port ${port}`);
});