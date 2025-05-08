import dotenv from "dotenv";
import { ApifyClient } from "apify-client";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config();

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: process.env.APIFY_API_KEY,
});

// Function to get context from the context API
async function getContextFromAPI() {
    try {
        // For server-side, we need to use the full URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/context`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch context');
        }
        
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching context from API:', error);
        return null;
    }
}

// Function to get context from the local file
function getContextFromFile() {
    try {
        const dataDir = path.join(process.cwd(), '..', 'frontend', 'data');
        const contextFilePath = path.join(dataDir, 'user_context.json');
        
        if (fs.existsSync(contextFilePath)) {
            const fileData = fs.readFileSync(contextFilePath, 'utf8');
            return JSON.parse(fileData);
        }
    } catch (error) {
        console.error('Error reading context file:', error);
    }
    return null;
}

// Function to generate search terms based on the selected event
function generateSearchTerms(selectedEvent) {
    if (!selectedEvent) {
        return ["GTC 2025"];
    }
    
    // Only use the event title as the search term
    if (selectedEvent.title) {
        return [selectedEvent.title];
    }
    
    // If there's no title, use a default
    return ["GTC 2025"];
}

// Base input configuration
const baseInput = {
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

    "include:nativeretweets": false,
    "lang": "en",
    "since": "2024-12-31_23:59:59_UTC",
    "until": "2025-12-31_23:59:59_UTC",
    "maxItems": 20,
};

export async function scrape() {
    console.log('=== STARTING SCRAPE FUNCTION ===');
    
    // First try to get context from the API
    let context = await getContextFromAPI();
    console.log('Context from API:', context ? 'Found' : 'Not found');
    
    // If API fails, try to get context from the file
    if (!context) {
        context = getContextFromFile();
        console.log('Context from file:', context ? 'Found' : 'Not found');
    }
    
    // Log the full context for debugging
    if (context && context.selectedEvent) {
        console.log('=== SELECTED EVENT CONTEXT ===');
        console.log('Title:', context.selectedEvent.title);
        console.log('Description:', context.selectedEvent.description?.substring(0, 100) + '...');
        console.log('Date:', context.selectedEvent.date);
        console.log('Location:', context.selectedEvent.location);
        console.log('Keywords:', context.selectedEvent.keywords);
        console.log('Last Updated:', context.lastUpdated);
    } else {
        console.log('=== NO SELECTED EVENT FOUND ===');
    }
    
    // Generate search terms based on the selected event
    const searchTerms = context && context.selectedEvent
        ? generateSearchTerms(context.selectedEvent)
        : ["GTC 2025"]; // Default search term if no context is available
    
    // Create the input with dynamic search terms
    const input = {
        ...baseInput,
        searchTerms
    };
    
    console.log('=== SEARCH CONFIGURATION ===');
    console.log('Using search terms:', searchTerms);
    console.log('From user:', input.from);
    console.log('Language:', input.lang);
    console.log('Max items:', input.maxItems);
    
    // Run the Actor and wait for it to finish
    const run = await client.actor("CJdippxWmn9uRfooo").call(input);

    // Fetch Actor results from the run's dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    let retVal = "";
    items.forEach((item) => {
        if (item.text) {
            retVal += item.text + "\n";
        }
    });
    return retVal;
}
