# RAG PDF Question Answering System

A Retrieval-Augmented Generation (RAG) system built with **Node.js**, **LangChain**, **Qdrant**, and **OpenAI-compatible LLMs**. The system allows users to upload PDF documents, index them into a vector database, and ask natural language questions that are answered strictly using the content of the uploaded documents.

This project is designed with a clean separation between **ingestion**, **retrieval**, and **generation**, and follows best practices for production-grade RAG pipelines.

---

## Features

* PDF upload and parsing
* Text chunking and embedding
* Vector storage using Qdrant
* Semantic search over document embeddings
* Context-grounded answers using an LLM
* Safe handling of empty or insufficient context
* Modular Node.js architecture (Express-based)

---

## Tech Stack

* **Runtime**: Node.js (ES Modules)
* **Backend Framework**: Express.js
* **LLM Orchestration**: LangChain (JS)
* **Vector Database**: Qdrant
* **Embeddings**: OpenAI / OpenAI-compatible models
* **PDF Parsing**: pdf-parse (v1.x)

---

## Project Structure

```
RAG_proj/
│
├── routes/
│   └── upload.routes.js        # File upload and indexing routes
│
├── PDF-Embed.js                # PDF ingestion, chunking, and embedding logic
├── vectorStore.js              # Qdrant vector store configuration
├── llm.js                      # LLM and embedding model setup
├── server.js                   # Express server entry point
│
├── node_modules/
├── package.json
└── README.md
```

---

## High-Level Architecture

1. **PDF Upload**

   * User uploads a PDF file
   * File is parsed into raw text

2. **Chunking & Embedding**

   * Text is split into overlapping chunks
   * Each chunk is converted into a vector embedding

3. **Vector Storage (Qdrant)**

   * Embeddings are stored in Qdrant with metadata

4. **Query Flow**

   * User submits a question
   * Question is embedded
   * Qdrant returns top-k similar chunks
   * Retrieved context is passed to the LLM
   * LLM generates a grounded response

## Core RAG Logic (Key Concept)

```js
const relevantChunks = await vectorSearcher.invoke(queryString);
```

This line:

* Converts the query into an embedding
* Performs semantic similarity search in Qdrant
* Returns the most relevant document chunks

These chunks are then injected into the LLM prompt as **context**.


## Future Improvements

* Streaming responses
* Hybrid (keyword + vector) search
* Metadata-based filtering
* Conversation memory
* Authenticated multi-user document spaces

---

## Author

Hrishith Savir

Computer Science Undergraduate | Backend & AI Engineer
