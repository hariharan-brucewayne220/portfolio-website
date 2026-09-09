---
title: AI Financial Advisor – Hybrid-Retrieval RAG with LangGraph
date: 2026-03-11
institution: Solo Project
description: Document-grounded Q&A for financial advisors — hybrid dense and lexical retrieval fused with RRF, a LangGraph agent that retries when its own answer scores poorly, and PII redaction before anything is indexed.
tags: [FastAPI, React, pgvector, LangGraph, RAG, AI/ML, AI]
github: https://github.com/hariharan-brucewayne220/ai-financial-advisor
featured: false
---

A multi-tenant advisor tool: upload a client's statements and filings, then ask questions and get answers grounded in those documents rather than in the model's memory.

## Retrieval and reasoning

- **Hybrid retrieval.** A HyDE-expanded query runs against pgvector cosine similarity and a per-client BM25 index in parallel, with the two rankings fused by reciprocal rank fusion rather than a hand-tuned weighting.

- **An agent that checks itself.** The question-answering path is a LangGraph state machine — classify, retrieve, rerank, compress, fetch market data, generate, score — with a conditional edge that re-retrieves and regenerates when the faithfulness score falls below threshold, bounded to two retries. Report generation is a second graph with its own draft, self-review and revise loop.

- **Ingestion with redaction.** Documents are parsed locally, scanned for personally identifiable information and redacted before chunking, embedding and indexing, so client identifiers do not reach the vector store. Verified end to end: a name, SSN, email and phone in a source document arrive as `[PERSON]`, `[US_SSN]`, `[EMAIL_ADDRESS]` and `[PHONE_NUMBER]` in the stored chunk.

- **Tenancy.** Advisors are isolated at the API layer — reading another advisor's client or documents returns 403, and a token signed with the wrong secret is rejected rather than merely expired.

## Honest scope

This is a working MVP, and the parts that are not finished are labelled as such rather than described as if they were: the rerank stage currently sorts by the fused score instead of running a cross-encoder, and the context-compression stage is a pass-through. The pipeline is wired for both, and the configuration for them exists, but the models are not called yet.

Verifying it also surfaced three defects worth naming. The committed lockfile had been generated inside an Alpine container and carried only that platform's native binaries, so a clean `npm ci` **could not build the frontend on any other machine** — including Debian, not just Windows. The Alembic migration could never run as documented, because the environment loaded its settings and then ignored them in favour of a hardcoded compose hostname. And the redaction routine corrupted its own output when the detector returned overlapping spans, splicing `[EMAIL_ADDRESS]` into fragments — latent at the default threshold, but exactly the wrong failure for a privacy control.
