---
title: API Monitor – Go Health Checker with Local LLM Insights
date: 2025-08-09
institution: Solo Project
description: A small Go service that concurrently health-checks HTTP endpoints, persists results to Postgres, and asks a locally hosted GGUF model to explain what the numbers mean, falling back to rule-based insights when it is unavailable.
tags: [Go, PostgreSQL, Docker, Local-LLM, Infrastructure, Backend, Software, AI]
github: https://github.com/hariharan-brucewayne220/distributed-api-monitor
featured: false
---

Written to learn Go concurrency properly and to run a language model entirely on my own hardware, with no vendor API in the loop.

## What it does

- **Concurrent checking.** Endpoints are fanned out across goroutines with a `WaitGroup`, recording status code, latency and health per target, and serving both a JSON API and a single-page dashboard with a response-time chart.

- **Local inference, with a real fallback.** Insights come from an OpenAI-compatible endpoint that is a `llama-cpp-python` wrapper around a GGUF model running on my own GPU. When that endpoint is unreachable the service degrades to deterministic rule-based insights rather than failing the request — verified by killing the model server mid-run and confirming the dashboard still answers.

- **Persistence behind an interface.** A `Store` abstraction backs the web server with Postgres when `DATABASE_URL` is set and an in-memory ring buffer when it is not, so history survives a process restart in deployment and the service still runs with no database at all.

## What running it against a real database taught me

The persistence layer passed its tests against fakes and was still wrong in three ways, each only visible against real Postgres:

- `TIMESTAMP` without a time zone silently discarded the driver's UTC offset on write and relabelled it on read, shifting every stored timestamp by the local offset.
- Because a batch is written in one transaction, a single over-length URL aborted it and **discarded the results for every other endpoint** — while the API still returned 200.
- Timestamps that tied at the clock's granularity left `ORDER BY checked_at DESC` undefined, so "most recent" was arbitrary.

All three are fixed, each with a test that fails without the fix, plus an idempotent migration that upgrades a table written by the older binary in place. 28 tests.

I also deleted a gRPC service definition that had been sitting in the tree: no stubs were ever generated, the server registered nothing, and no caller referenced it. It looked like a feature and was dead weight.
