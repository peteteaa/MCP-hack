import dotenv from "dotenv";
import { scrape } from "./apify.js";
import { prompt } from "./arcade.js";

dotenv.config();

const eventData = await scrape();

console.log(eventData);

console.log("Got event data, now sending to Arcade...");

await prompt(eventData);
