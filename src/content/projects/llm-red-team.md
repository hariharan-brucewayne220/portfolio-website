---
title: LLM Red Team Platform – AI Security Assessment Tool
date: 2025-08-01
institution: Personal Project
description: An automated LLM vulnerability testing platform enabling security assessments across 5 attack vectors with multi-provider support and comprehensive reporting.
tags: [Next.js, TypeScript, Flask, AI-Security, LLM, Cybersecurity]
image: /projects/red-teaming.png
github: https://github.com/hariharan-brucewayne220/task-llm
featured: true
---

Automated AI Security Assessment Platform

Developed a comprehensive security testing platform for Large Language Models, enabling organizations to identify vulnerabilities before deployment.

## Key Achievements

- Developed a full-stack LLM vulnerability testing platform using Next.js 14, React 18, TypeScript, and Flask, enabling automated security assessments across 5 attack vectors: jailbreak, bias, hallucination, privacy leakage, and manipulation

- Integrated multi-provider LLM support (OpenAI GPT-4, Anthropic Claude, Google Gemini) with a unified API abstraction layer, real-time WebSocket streaming for live assessment progress, and concurrent async processing

- Implemented two-layer safeguard detection system combining PromptFoo YAML pattern matching with ML-based evaluators using NLTK, Sentence Transformers, and VADER sentiment analysis for nuanced vulnerability scoring (0-10 scale)

- Built comprehensive reporting with Plotly.js visualizations, PDF export via jsPDF/ReportLab, historical trend analysis, and REST API endpoints for CI/CD integration enabling automated recurring security tests
