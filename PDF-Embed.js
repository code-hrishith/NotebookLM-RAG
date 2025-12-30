import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

import dotenv from "dotenv";
import { parse as csvParse } from "csv-parse/sync";


dotenv.config();

// /**
//  * Convert uploaded files (PDF/CSV) to LangChain Document objects
//  * @param {Array} files - array of Multer files (memoryStorage)
//  * @returns {Promise<Document[]>}
//  */

async function parseFilesToDocs(files) {
  const docs = [];

  for (const file of files) {

    const buffer = file.buffer;
    const ext = file.originalname.split(".").pop().toLowerCase();
    // file.originalname.split(".").pop().toLowerCase() is used to take out whether the file is pdf or csv etc 

    if (ext === "pdf") { // this is if file is pdf
      // Save buffer temporarily (PDFLoader expects a path) OR use PDF.js directly
      // For simplicity, using fs + temp path:
      const fs = await import("fs");
      const tmpPath = `./temp_${Date.now()}.pdf`;// we generate a temporary filename 
      fs.writeFileSync(tmpPath, buffer);// writes the pdf buffer to disk becasue pdfloader expects a filepath therefore we generate one.

      // yaha se code is same - PDF loader ka kaam hai ab
      const loader = new PDFLoader(tmpPath);
      const pdfDocs = await loader.load();
      docs.push(...pdfDocs);
      fs.unlinkSync(tmpPath); // delete after use


    } else if (ext === "csv") {
      const text = buffer.toString("utf-8");
      const records = csvParse(text, { columns: true, skip_empty_lines: true });
      for (const row of records) {
        docs.push(new Document({ pageContent: JSON.stringify(row) }));
      }
    } else {
      console.warn(`Unsupported file type: ${file.originalname}`);
    }
  }

  return docs;
}

/**
 * Index documents into Qdrant
 */
async function indexFiles(files) {
    // 1. convert file to doc
  const rawDocs = await parseFilesToDocs(files);

  // Split text into manageable chunks
  // 2. split doc
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.splitDocuments(rawDocs);

  // Create embeddings
  // 3. embeddings 
  console.log("reached embeddings !!");
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: "text-embedding-3-large",
  });

  // Store in Qdrant
  // vector db update
  console.log("reached qdrant !!");
  const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: "http://localhost:6333",
    collectionName: "rag-pdf-text-proj",
  });

  console.log("Indexing complete:", docs.length, "chunks indexed!");
  return vectorStore;
}

export default indexFiles;

// text to vector db
export async function TextToDb(req,res){
  const {userInput} = req.body;
  console.log(userInput);
  const text =
    typeof userInput === "string"
      ? userInput
      : JSON.stringify(userInput); // fallback if object


  const embeddings = new OpenAIEmbeddings({ 
    // convert the chunks to vector embeddings and add it to the vector database
    apiKey:process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
    batchSize: 512, // Default value if omitted is 512. Max is 2048
    model: "text-embedding-3-large",
  });

  const docs = [
    new Document({
      pageContent:text,
      metadata:{source:"user_input"}
    })
   ]

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
        url: "http://localhost:6333",
        collectionName : "rag-pdf-text-proj"
    }
  )
  await vectorStore.addDocuments(docs);

  console.log("text has been added to RAG");
  res.json({status:true});
};