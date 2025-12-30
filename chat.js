import OpenAI from "openai";
import dotenv from "dotenv";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
dotenv.config();
//backend
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const SYSTEM_PROMPT =
//   "You are an AI assistant who helps resolving user query based on the context available to you from a PDF file with the content and page number or simple textual data present in the Vector Database only Answer based on the available context from file only.";

export async function chat(req, res) {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      console.log("no query received!!!");
      return res.status(400).json({ error: "Invalid or empty query" });
    }

    console.log(`received query = ${query}`);

    const embeddings = new OpenAIEmbeddings({
      // convert the chunks to vector embeddings and add it to the vector database
      apiKey:process.env.OPENAI_API_KEY,
      batchSize: 512, // Default value if omitted is 512. Max is 2048
      model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: "http://localhost:6333",
        collectionName: "rag-pdf-text-proj",
      }
    );

    const vectorSearcher = vectorStore.asRetriever({
      k: 3,
    });

    const relevantChunk = await vectorSearcher.invoke(query);

    // console.log("userQuery value:", userQuery);
    // console.log("userQuery type:", typeof userQuery);

    const SYSTEM_PROMPT = ` You are an AI assistant who helps resolving user query based on the context available to you from a PDF file with the content and page number or simple textual data present in the Vector Database
    only Answer based on the available context from file only. 
    Context: 
    ${JSON.stringify(relevantChunk)}`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
    });

    console.log("output ===", response.choices[0].message.content);

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("chatHandler error:", error);
    // res.status(500).json({ error: "AI processing failed" });
  }
}
