import dotenv from "dotenv";
import { OpenAI } from "openai";
import readline from "readline";

dotenv.config();

// Initialize the OpenAI client, pointing to Arcade
const client = new OpenAI({
    baseURL: "https://api.arcade.dev/v1",
    apiKey: process.env.ARCADE_API_KEY,
});

const userId = "pulseagentmcp@gmail.com";

const tools = [
    "Google.SendEmail",
    "X.PostTweet",
];

const emailSubscribers = [
    "nishilanand21@gmail.com",
];

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// function input(promptText) {
//     return new Promise((resolve) => {
//         rl.question(promptText, resolve);
//     });
// }

export async function prompt(eventData) {
    // Use a tool and generate a response
    const response1 = await client.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are able to send emails through gmail. Send out an email to the newsletter subscribers about how cool Arcade.dev is. Here is a list of all the email subscribers: ${emailSubscribers.join(", ")}.`,
            },
        ],
        model: "gpt-4",
        user: userId,
        tools: tools,
        tool_choice: "generate",
    });

    console.log("Send email to subscribers");
    console.log(response1.choices[0].message.content);

    const response2 = await client.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are able to send tweets on X. Send out a tweet about how cool Arcade.dev is.`,
            },
        ],
        model: "gpt-4",
        user: userId,
        tools: tools,
        tool_choice: "generate",
    });

    console.log("Sent tweet to X");
    console.log(response2.choices[0].message.content);
}

// while (true) {
//     // Ask the user for input
//     const userInput = await input("Enter your prompt (type 'exit' to quit): ");
//     if (userInput.toLowerCase() === "exit") {
//         break;
//     }

//     const response = await prompt();

//     console.log(response.choices[0].message.content);
// }

// rl.close();
