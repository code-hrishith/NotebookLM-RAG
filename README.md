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

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd RAG_proj
```

### 2. Install dependencies

```bash
npm install
```

> Important: This project requires **pdf-parse v1**

```bash
npm install pdf-parse@^1
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_api_key_here
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=documents
```

---

## Running Qdrant

Using Docker (recommended):

```bash
docker run -p 6333:6333 qdrant/qdrant
```

Access Qdrant dashboard:

```
http://localhost:6333/dashboard
```

---

## Running the Project

```bash
node server.js
```

Server will start on:

```
http://localhost:3000
```

---

## Core RAG Logic (Key Concept)

```js
const relevantChunks = await vectorSearcher.invoke(queryString);
```

This line:

* Converts the query into an embedding
* Performs semantic similarity search in Qdrant
* Returns the most relevant document chunks

These chunks are then injected into the LLM prompt as **context**.

---

## Empty Context Handling

If Qdrant contains no data or no relevant matches are found:

* Retrieval returns an empty array
* The system safely responds with an informational message
* Prevents hallucinated answers

Recommended pattern:

```js
if (relevantChunks.length === 0) {
  return "I don't have enough information to answer this based on the uploaded documents.";
}
```

---

## Common Issues & Fixes

### 1. `ERR_MODULE_NOT_FOUND: @langchain/core`

```bash
npm install @langchain/core
```

### 2. `pdf-parse` not found or incompatible

```bash
npm install pdf-parse@^1
```

LangChain PDFLoader currently does **not support pdf-parse v2**.

### 3. Qdrant dashboard shows no graph

* Ensure data has been indexed
* Verify correct collection name
* Confirm vectors are being inserted successfully

---

## Future Improvements

* Streaming responses
* Hybrid (keyword + vector) search
* Metadata-based filtering
* Conversation memory
* Authenticated multi-user document spaces

---

## License

MIT License

---

## Author

Hrishith Savir

Computer Science Undergraduate | Backend & AI Engineer
