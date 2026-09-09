---
title: Sentinel – End-to-End MLOps Pipeline
date: 2026-03-01
institution: Solo Project
description: An anomaly detector taken through the whole lifecycle — ingest, train, track in MLflow, serve over FastAPI, monitor for drift with Evidently, and ship through CI to a container registry.
tags: [Python, scikit-learn, MLflow, Evidently, Docker, GitHub-Actions, MLOps, AI]
github: https://github.com/hariharan-brucewayne220/sentinal-anomoly-detection
featured: false
---

Less about the model than about everything around it: the parts of an ML system that decide whether it stays correct after the notebook is closed.

## The pipeline

- **Ingest and train.** The NAB machine-temperature series (22,695 points) with engineered rolling mean, standard deviation and first difference over a 12-step window, fitted with an Isolation Forest on standardised features. Parameters, metrics and artifacts are logged to MLflow, and the model, scaler and metadata are persisted for serving.

- **Serve.** A FastAPI service exposing `/predict`, `/predict/batch`, `/model/info` and a `/health` endpoint that reports request, anomaly and latency counters.

- **Monitor.** Evidently compares a reference split against a rolling current window and writes data-drift and data-quality reports.

- **Ship.** GitHub Actions runs ruff, then pytest with coverage, then builds the image, smoke-tests `/health` inside it, and pushes to Docker Hub on main. The API runs on Railway; a Streamlit dashboard covers system overview, model registry, pipeline health and CI status.

## Measured, then re-measured

The headline numbers are reproducible rather than remembered — `src/models/evaluate.py` scores the persisted model against NAB's four labelled failure windows offline and writes the results to disk:

**ROC-AUC 0.8233 · precision 48.24% · recall 48.28% · F1 48.26%** (TP 1095, FP 1175, FN 1173, TN 19252)

Contamination is set to 0.10 rather than the 0.05 that looks better on precision: 0.05 gives 59.7% precision at 29.9% recall, and for a failure detector, missing two thirds of the failures is the worse trade. Re-running the evaluator against a freshly trained model reproduces these figures exactly.

Where the dashboard shows illustrative rather than live data — the alert timeline, the synthetic sensor stream — it says so on the panel. The experiment-history view reads real MLflow runs when a tracking store is present and falls back to a labelled sample when it is not.
