---
title: RevLens – Multi-Tenant Sales Call Intelligence
date: 2026-03-19
institution: Solo Project
description: Sales calls in, structured pipeline intelligence out — a Whisper to GPT-4o event chain extracting objections, buying signals and risks, behind strict per-organisation isolation.
tags: [Next.js, TypeScript, PostgreSQL, Prisma, Inngest, GPT-4o, Full-Stack, AI, Software]
github: https://github.com/hariharan-brucewayne220/rev-lens
featured: false
---

A B2B SaaS core loop: a rep uploads a call recording, and the deal's health score moves because of what was actually said on it.

## Architecture

- **A three-stage event chain**, not a request handler. `call/uploaded` triggers Whisper transcription, which emits `call/transcribed` for GPT-4o structured extraction — objections, competitor mentions, buying signals, action items, risks, coaching notes — which emits `call/analyzed` for an opportunity health-score delta clamped to a sane range. Each stage is independently retriable, and the upload request returns immediately.

- **Isolation as a data-layer concern.** Org scoping and a rep-level filter live in the data access layer rather than being re-implemented per route, so a missed check in a new endpoint cannot leak another tenant's pipeline.

- **20 Prisma models** covering CRM objects and call intelligence, with per-organisation OpenAI keys encrypted with AES-256-GCM under a fresh IV per operation, and audio held in private storage behind short-lived signed URLs.

- Plus the product surface: a drag-and-drop pipeline board, CSV import, invite-only onboarding, and role-gated admin.

## Proven rather than assumed

Multi-tenancy is the claim worth testing, so it was tested with real requests across two seeded organisations: cross-tenant stage updates return 404 in every direction, a rep cannot see a colleague's deals, and dashboard aggregates never include the other org's numbers.

That exercise also found a genuine authentication flaw. Sign-in resolved users with a query that assumed email was globally unique, but the schema only makes it unique *per organisation* — so with the same address in two tenants, Postgres picked one **by physical row order**. The second account was unreachable, and a routine `VACUUM FULL` could have silently flipped those credentials to the other tenant. It now refuses to authenticate an ambiguous address rather than guessing.

Upload validation was checked the same way: a text file renamed `.mp3` is rejected on its magic bytes, an oversized file is rejected against Whisper's limit, and neither leaves a row behind.

Scope note: the core loop is complete, while the accounts, forecast, renewals and team sections are deliberate placeholders.
