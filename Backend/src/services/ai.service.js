  import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
  import { ChatMistralAI } from "@langchain/mistralai";
  import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
  import { tool } from "@langchain/core/tools";
  import * as z from "zod";
  import { searchInternet } from "./internet.service.js";

  const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAl_API_KEY,
  });

  const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
  });

  const searchInternetTool = tool(searchInternet, {
    name: "searchInternet",
    description: "Use this tool to get latest information from the internet.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the internet."),
    }),
  });

  const modelWithTools = mistralModel.bindTools([searchInternetTool]);

  export async function generateResponse(messages) {
    const formattedMessages = [
      new SystemMessage(`You are a helpful assistant. If the question needs latest info, use searchInternet tool.`),
      ...messages.map((msg) =>
        msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
      ),
    ];

    const response = await modelWithTools.invoke(formattedMessages);

    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];
      const searchResult = await searchInternet(toolCall.args);
      
      const finalResponse = await mistralModel.invoke([
        ...formattedMessages,
        response,
        new HumanMessage(`Search results: ${JSON.stringify(searchResult)}\n\nNow answer based on these results.`),
      ]);
      return finalResponse.content;
    }

    return response.content;
  }


  export async function generateChatTitle(message) {
    const response = await mistralModel.invoke([
      new SystemMessage(`
              You are a helpful assistant that generates concise and descriptive titles for chat conversations.
              
              User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
          `),
      new HumanMessage(`
              Generate a title for a chat conversation based on the following first message:
              "${message}"
              `),
    ]);
    return response.content;
  }
