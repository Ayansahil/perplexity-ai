  import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
  import { ChatMistralAI } from "@langchain/mistralai";
  import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
  import { searchInternet } from "./internet.service.js";

  const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAl_API_KEY,
  });

  const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
  });

  export async function generateResponse(messages, proSearch = false) {
    const formattedMessages = messages.map((msg) =>
      msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    );

    // ── Pro Search OFF: use Gemini from internal knowledge ──
    if (!proSearch) {
      const response = await geminiModel.invoke([
        new SystemMessage("You are a helpful, knowledgeable assistant. Answer the user's question clearly and thoroughly based on your internal knowledge."),
        ...formattedMessages,
      ]);
      return response.content;
    }

    // ── Pro Search ON: always fetch from Tavily, then answer with Mistral ──
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const query = lastUserMessage?.content ?? "latest news";

    let searchResults = "";
    try {
      searchResults = await searchInternet({ query });
    } catch (err) {
      console.error("Tavily search failed:", err.message);
      searchResults = "No search results available.";
    }

    const response = await mistralModel.invoke([
      new SystemMessage(
        "You are a helpful assistant. The user has enabled Pro Search. " +
        "Use ONLY the web search results below to answer the question. " +
        "Cite sources where possible. Do not use your built-in knowledge."
      ),
      ...formattedMessages,
      new HumanMessage(`Web search results:\n${searchResults}\n\nAnswer the user's question based only on these results.`),
    ]);

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
