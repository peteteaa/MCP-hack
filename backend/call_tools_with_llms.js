import dotenv from "dotenv";
import { OpenAI } from "openai";
import readline from "readline";

dotenv.config();

// Initialize the OpenAI client, pointing to Arcade
const client = new OpenAI({
    baseURL: "https://api.arcade.dev/v1",
    apiKey: process.env.ARCADE_API_KEY,
});

let userId = "nishilanand21@gmail.com";

let tools = [
    "Google.SendEmail",
    "GitHub.SetStarred",
    "Github.ListStargazers",
    "Github.CreateIssue",
    "Github.CreateIssueComment",
    "Github.ListPullRequests",
    "Github.GetPullRequest",
    "Github.UpdatePullRequest",
    "Github.GetRepository",
    "Github.ListRepositoryActivities",
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function input(promptText) {
    return new Promise((resolve) => {
        rl.question(promptText, resolve);
    });
}

while (true) {
    // Ask the user for input
    const userInput = await input("Enter your prompt (type 'exit' to quit): ");
    if (userInput.toLowerCase() === "exit") {
        break;
    }

    // Use a tool and generate a response
    const response = await client.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that can interact with GitHub and send emails.",
            },
            { role: "user", content: userInput },
        ],
        model: "gpt-4",
        user: userId,
        tools: tools,
        tool_choice: "generate",
    });

    console.log(response.choices[0].message.content);
}

rl.close();