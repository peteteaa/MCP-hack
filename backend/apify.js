import dotenv from "dotenv";
import { ApifyClient } from "apify-client";

dotenv.config();

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: process.env.APIFY_API_KEY,
});

// Prepare Actor input
const input = {
    "filter:blue_verified": false,
    "filter:consumer_video": false,
    "filter:has_engagement": false,
    "filter:hashtags": false,
    "filter:images": false,
    "filter:links": false,
    "filter:media": false,
    "filter:mentions": false,
    "filter:native_video": false,
    "filter:nativeretweets": false,
    "filter:news": false,
    "filter:pro_video": false,
    "filter:quote": false,
    "filter:replies": false,
    "filter:safe": false,
    "filter:spaces": false,
    "filter:twimg": false,
    "filter:verified": false,
    "filter:videos": false,
    "filter:vine": false,
    "from": "elonmusk",
    "include:nativeretweets": false,
    "lang": "en",
    "searchTerms": [
        "GTC 2025"
    ],
    "since": "2021-12-31_23:59:59_UTC",
    "until": "2024-12-31_23:59:59_UTC"
};

export async function scrape() {
    // console.log("apify client ", client);

    // Run the Actor and wait for it to finish
    const run = await client.actor("CJdippxWmn9uRfooo").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    // console.log("Results from dataset");
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    let retVal = "";
    items.forEach((item) => {
        retVal += JSON.stringify(item, null, 2);
    });
    return retVal;
}
