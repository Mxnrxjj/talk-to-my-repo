# TalkToMyRepo

TalkToMyRepo is an AI-powered codebase assistant that lets you chat with any public GitHub repository.

It clones a repository, indexes the source code into semantic embeddings, retrieves the most relevant code using vector search, and answers questions with streaming responses and source-aware citations.

Instead of keyword search, TalkToMyRepo understands the meaning of your code.

---

## Why I Built This

Understanding an unfamiliar codebase is one of the biggest bottlenecks in software engineering.

Existing tools either rely on keyword search or require developers to manually navigate large repositories.

TalkToMyRepo explores a different workflow: semantic retrieval combined with streaming AI responses and direct links back to the relevant source code.

The goal is not to replace reading code, but to reduce the time required to find the right code.

## Example Questions

TalkToMyRepo is designed to answer questions such as:

- Where is authentication implemented?
- How does repository indexing work?
- Which service is responsible for cloning repositories?
- Explain the request lifecycle for chat messages.
- Where is repository cleanup performed?
- What happens when a repository is indexed?

---

## Features

- Streaming AI responses
- Semantic code search
- Retrieval-Augmented Generation (RAG)
- Source-aware citations
- Built-in code viewer
- Multiple conversations per repository
- Automatic conversation titles
- Repository structure viewer
- Syntax highlighted source preview
- Markdown rendering
- Copy-to-clipboard for source code
- Asynchronous repository indexing
- Persistent chat history

---

## Highlights

- Built from scratch without AI frameworks such as LangChain or LlamaIndex.
- Uses PostgreSQL + pgvector for semantic retrieval.
- Streams responses while preserving source-aware citations.
- Asynchronous repository indexing with BullMQ workers.
- Designed with a service-oriented architecture to keep indexing, retrieval and chat generation independent.

---

## Architecture

### Repository Indexing

```
                 User submits GitHub URL
                           │
                           ▼
                  Create Repository Record
                           │
                           ▼
                Add Job to BullMQ Queue
                           │
                           ▼
                    BullMQ Worker
                           │
                           ▼
                  Clone Repository
                           │
                           ▼
                  Parse Supported Files
                           │
                           ▼
                Split Files into Chunks
                           │
                           ▼
              Generate Vector Embeddings
                           │
                           ▼
              Store Chunks in PostgreSQL
                      (pgvector)
                           │
                           ▼
                Update Repository Status
                           │
                           ▼
                Remove Temporary Clone
```

### Question Answering

```
                  User asks a question
                           │
                           ▼
             Generate Question Embedding
                           │
                           ▼
              pgvector Similarity Search
                           │
                           ▼
                Retrieve Relevant Chunks
                           │
                           ▼
              Build Context + Chat History
                           │
                           ▼
                Gemini 2.5 Flash Prompt
                           │
                  (Streaming Response)
                           │
                           ▼
              Stream Markdown to Frontend
                           │
                           ▼
              Extract Source References
                           │
                           ▼
          Persist Answer + Source References
                           │
                           ▼
              Refresh Chat with Citations
```

---

## Design Principles

- Retrieval and generation are kept as separate services.
- Repository indexing is asynchronous and fault tolerant.
- Source citations are stored alongside every assistant response.
- Repository clones are cleaned up after indexing to minimize storage usage.
- UI components are isolated from AI and indexing logic through service layers.
- LLMs are used only for generation; semantic retrieval determines the context.

---

## Tech Stack

### Frontend

- Next.js 15
- React 19
- TailwindCSS
- shadcn/ui

### Backend

- Next.js Route Handlers
- Prisma ORM
- PostgreSQL
- pgvector

### AI

- Gemini 2.5 Flash
- Voyage AI Embeddings (1024 dimensions)

### Infrastructure

- BullMQ
- Redis
- Git
- TypeScript

---

## Retrieval Pipeline

1. Clone the repository.
2. Parse supported source files.
3. Ignore generated and binary files.
4. Split code into overlapping chunks.
5. Generate vector embeddings.
6. Store chunks in PostgreSQL using pgvector.
7. Perform semantic similarity search.
8. Send retrieved context to Gemini.
9. Stream the response.
10. Persist the generated answer together with source references selected by the language model.

---

## Current Capabilities

- Index repositories asynchronously
- Repository status tracking
- Semantic retrieval instead of keyword matching
- Streaming responses
- Source citations
- Multiple chats
- Automatic chat naming
- Repository structure visualization
- Source code preview inside the workspace
- Persistent conversations

---

## Challenges & Design Decisions

### Streaming + Source Citations

Streaming answers while preserving source citations was one of the more interesting engineering challenges.

Returning structured JSON from the model prevented true streaming. Instead, the response is streamed as plain Markdown while source metadata is extracted after generation and attached before persistence.

This allows the UI to receive tokens immediately while keeping citations accurate.

---

### Repository Cleanup

Repositories are cloned into a temporary workspace during indexing.

After embeddings have been generated, the temporary clone is deleted while indexed chunks remain in PostgreSQL.

This keeps storage requirements small and allows indexing very large repositories without permanently storing local clones.

---

### Semantic Retrieval

Traditional code search depends on filenames or keywords.

TalkToMyRepo embeds every code chunk into vector space and retrieves code by meaning instead of exact text matches.

This allows queries such as:

- Where is repository cleanup performed?
- How does authentication work?
- Explain the indexing pipeline.

without knowing filenames beforehand.

---

### Background Processing

Repository indexing runs through BullMQ workers.

Long-running operations such as cloning, parsing, chunking and embedding never block the main application.

---

## Project Structure

```
app/          Next.js App Router pages and API routes
components/   Reusable UI components
services/     Repository indexing, search and AI services
worker/       BullMQ indexing worker
lib/          Shared utilities and database clients
prisma/       Database schema and migrations
```

---

## Running Locally

```bash
git clone <repository>

pnpm install

pnpm prisma migrate dev

pnpm dev

pnpm worker
```

---

## Environment Variables

```env
DATABASE_URL=

GEMINI_API_KEY=

VOYAGE_API_KEY=
```

---

## Current Limitations

- Public GitHub repositories only
- Repository structure is currently rendered as a tree view instead of an interactive explorer
- Source highlighting is planned but not yet implemented
- Large repositories may require several minutes for initial indexing
- Authentication is not yet implemented
- Production deployment is currently in progress

---

## Future Improvements

The current implementation focuses on semantic retrieval and repository understanding. Planned improvements include:

- Interactive repository explorer
- Line-level source highlighting
- Authentication and private workspaces
- Repository search and filtering
- Support for private GitHub repositories
- Improved retrieval ranking and context compression
- Multi-repository conversations
- Agentic workflows for repository analysis

---

## Roadmap

### In Progress

- Dashboard redesign
- Authentication
- Production deployment

### Planned

- Interactive repository explorer
- Highlight cited lines
- Follow-up suggestions
- Multi-repository chat
- Repository search
- Agent workflows

---

## Before Production

The remaining work before the first public deployment is:

- Dashboard redesign
- Authentication
- User-specific repositories and chats
- Cloud object storage for repository files
- Rate limiting
- Error monitoring
- Production deployment
- Documentation and screenshots

---

## Lessons Learned

Building TalkToMyRepo involved solving several practical engineering problems beyond simply integrating an LLM.

Some of the more interesting challenges included:

- Designing a retrieval pipeline without relying on frameworks such as LangChain or LlamaIndex.
- Streaming model responses while preserving accurate source citations.
- Keeping repository indexing asynchronous using BullMQ workers.
- Separating indexing, retrieval and generation into independent services.
- Managing temporary repository clones while minimizing storage usage.
- Building a responsive workspace capable of displaying both conversations and source code simultaneously.
- Balancing response quality, latency and retrieval accuracy without introducing unnecessary framework abstractions.

---

## Status

TalkToMyRepo is currently under active development.

The core retrieval pipeline, semantic search and AI workspace are complete.

Current work is focused on dashboard redesign, authentication and production deployment before the first public release.

---

## Copyright

Copyright © 2026 Manraj Singh. All rights reserved.

This project is not open source. This repository is publicly visible for evaluation purposes only.

No permission is granted to copy, modify, distribute or commercially use this source code without prior written permission.
