---
title: City Witness – Real-Time Voice+Vision AI Agent
date: 2026-03-15
institution: NYC Build With AI Hackathon, NYU Tandon
description: Multimodal Gemini Live agent that sees NYC through your camera, narrates live, and grounds answers in real city data (311, restaurant inspections, crime stats) for that exact location.
tags: [Python, FastAPI, Gemini-Live, Voice-AI, MCP, AI/ML]
github: https://github.com/hariharan-brucewayne220/city_pulse
featured: true
---

Point your camera at anything in NYC; the agent sees it, speaks live narration, and answers follow-up voice questions grounded in city data.

## Key Achievements

- Built a multimodal voice+vision agent on the Gemini Live API with bidirectional audio and video streaming: the agent watches the camera feed and narrates what it sees in real time

- Grounded responses in NYC Open Data via the Socrata API, pulling 311 complaints, restaurant inspections, and crime statistics for the user's exact location

- Wired up Google ADK and MCP for tool orchestration, with DuckDB for local analytics and deployment on Cloud Run

- Built at the NYC Build With AI Hackathon at NYU Tandon
