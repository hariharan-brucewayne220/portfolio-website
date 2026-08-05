---
title: AI Financial Advisor – RAG Platform with LangGraph Agents
date: 2026-01-15
institution: Solo Project
description: Document-grounded financial Q&A with hybrid retrieval (dense + BM25 + HyDE, RRF reranking), LangGraph agents for multi-step reasoning, and citation-backed answers.
tags: [FastAPI, React, pgvector, LangGraph, RAG, AI/ML]
github: https://github.com/hariharan-brucewayne220/ai-financial-advisor
featured: true
---

A production RAG platform for financial documents: ask questions, get grounded, citation-backed answers with sub-second retrieval.

## Key Achievements

- Built with FastAPI, React, pgvector, and Redis for document-grounded financial Q&A with sub-second retrieval latency; deployed on AWS (EC2, S3) with Docker

- Implemented hybrid retrieval combining dense embeddings, BM25, and HyDE with RRF reranking on sentence-transformer embeddings, beating single-strategy baselines on answer relevance

- Developed LangGraph agents for multi-step reasoning and automated report generation, with structured output parsing and citation-backed source attribution

- Designed an information extraction pipeline parsing unstructured financial documents into structured, verifiable outputs
