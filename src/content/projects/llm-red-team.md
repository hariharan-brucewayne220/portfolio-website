---
title: LLM Red Team Platform – Adversarial Assessment Harness
date: 2025-08-26
institution: Take-Home Project
description: Runs adversarial prompt suites against a target model across five attack categories, scores each response, and streams progress live — with the scoring method named honestly rather than dressed up as an LLM judge.
tags: [Next.js, TypeScript, Flask, AI-Security, LLM, Evals, AI, Software]
image: /projects/red-teaming.png
github: https://github.com/hariharan-brucewayne220/task-llm
featured: false
---

An evaluation harness for probing a model's safety behaviour before it ships: point it at a provider, choose categories, and watch the assessment run.

## How it works

- **Five attack categories** — jailbreak, bias, hallucination, privacy leakage and manipulation — backed by a seeded corpus of prompts loaded into the database on first start.

- **Multi-provider targets.** OpenAI, Anthropic and Google behind one client factory, with API keys encrypted at rest rather than held in plaintext.

- **A run you can steer.** Assessments execute in a background queue with working pause, resume and stop; progress, per-test results and completion stream to the Next.js dashboard over Socket.IO. Results are scored, persisted, charted, and exportable to PDF and CSV.

## Saying what the scoring actually is

The interesting part of this project turned out to be its honesty. The assertion engine implements promptfoo-style checks — substring, regex, JavaScript expressions — and an `llm-rubric` type. That rubric was not an LLM judge at all; it was keyword matching wearing the name of one, which is precisely the sort of thing an evaluation tool must not do, because everything downstream inherits the mislabel.

It now runs in one of two explicit modes: `keyword`, the deterministic heuristic, named for what it is and the default so the suite runs without credentials; or `llm`, a real judge call through the same provider abstraction, given both the prompt and the response. Safeguard detection sits alongside it, with BLEU, VADER sentiment and embedding-consistency metrics for the nuance a single score loses.

## Verification

Driving a full assessment against a stub model server — rather than trusting the unit tests — exposed a run loop that never marked itself `running` (so the stop endpoint refused genuinely running assessments), stopped runs reporting themselves as completed, and the four summary columns the history view reads never being written by anything. All fixed, and the lifecycle re-verified end to end: `pending → running → completed` with scored results, and `running → stopped` with partial results retained.
