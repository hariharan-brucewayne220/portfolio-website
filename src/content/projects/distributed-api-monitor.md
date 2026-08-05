---
title: Distributed API Monitor – Go ML-Serving Health System
date: 2026-02-15
institution: Solo Project
description: Low-latency Go monitoring system simulating model-serving health across 1,000+ endpoints, with Prometheus metrics, gRPC streaming, and 3-tier AI service degradation.
tags: [Go, Prometheus, gRPC, Docker, Infrastructure, Backend]
github: https://github.com/hariharan-brucewayne220/distributed-api-monitor
featured: true
---

A production-grade monitoring service for ML-serving fleets, built to exercise real Go concurrency patterns under load.

## Key Achievements

- Built goroutine-per-endpoint fan-out with buffered channel backpressure and graceful shutdown, simulating real-time model-serving health across 1,000+ endpoints

- Instrumented with Prometheus (8 custom counters/gauges) and a gRPC streaming interface for live health updates

- Implemented 3-tier service degradation (OpenAI API → local GGUF model → rule-based fallback) for zero-downtime AI-layer failover

- Containerized via Docker multi-stage builds with Compose, PostgreSQL health checks, and a Compose-to-Kubernetes migration path
