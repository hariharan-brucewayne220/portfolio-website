---
title: RevLens – Multi-Tenant Sales Call Intelligence SaaS
date: 2026-03-20
institution: Solo Project
description: B2B SaaS that turns raw sales calls into pipeline health scores, objections, and buying signals via a Whisper → GPT-4o event pipeline, with org-scoped isolation and encrypted storage.
tags: [Next.js, TypeScript, PostgreSQL, Inngest, GPT-4o, Full-Stack]
github: https://github.com/hariharan-brucewayne220/rev-lens
featured: true
---

A multi-tenant B2B SaaS platform for sales call intelligence: upload calls, get transcription, structured analysis, and deal health scoring.

## Key Achievements

- Architected a multi-tenant Next.js/TypeScript SaaS with an OOP data access layer enforcing org-scoped query isolation and role-gated REST API routes via middleware

- Implemented a 3-stage Inngest event pipeline: Whisper transcription → GPT-4o structured analysis → health score deltas, extracting objections, buying signals, and risks from every call

- Implemented AES-256-GCM encryption with a random IV per operation, plus an optimistic-UI kanban board with snapshot rollback on API failure

- Designed a 20+ model PostgreSQL schema with Prisma for CRM and call intelligence; built drag-and-drop pipeline board, CSV import, admin panel, and org-scoped dashboards
