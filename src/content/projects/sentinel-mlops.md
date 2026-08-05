---
title: Sentinel – Production MLOps Pipeline
date: 2025-08-15
institution: Solo Project
description: End-to-end MLOps pipeline with Isolation Forest anomaly detection, MLflow tracking and registry, Evidently drift alerting to Slack, and full CI/CD deploys.
tags: [MLflow, Evidently, Docker, GitHub-Actions, MLOps, AI/ML]
github: https://github.com/hariharan-brucewayne220/sentinal-anomoly-detection
featured: false
---

An end-to-end MLOps pipeline: train, track, deploy, and monitor an anomaly detector with automated drift alerting.

## Key Achievements

- Built an Isolation Forest anomaly detector on NAB sensor data with engineered rolling features (mean, std, diff, window=12), reaching ROC-AUC 0.82

- Configured a remote MLflow tracking server with experiment logging, artifact storage, and a model registry

- Automated CI/CD via GitHub Actions: lint, test, Docker build, smoke test, and Railway deploy on every push

- Implemented live Evidently drift alerting to Slack, scheduled via APScheduler every 24 hours with graceful fallback
