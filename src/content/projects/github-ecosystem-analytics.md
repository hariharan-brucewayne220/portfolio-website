---
title: GitHub Developer Ecosystem Analytics
date: 2026-05-08
institution: NYU Big Data Systems
description: A Lambda-architecture platform over GitHub Archive that predicts which new repositories reach 1,000 stars within 90 days, with a batch Spark ML path and a live Kafka streaming path feeding one Grafana view.
tags: [Python, Spark, Kafka, Airflow, HDFS, Infrastructure, Machine-Learning, AI, Software]
github: https://github.com/Shreyas191/Github-Analytics
featured: true
---

A four-person, five-week platform project where I was the Data Infrastructure Lead: I owned the entire batch path, the container topology every other workstream ran on, and the project's only test suite.

## Architecture

- **Batch path.** GitHub Archive event dumps pulled from GCS, parsed with PySpark into partitioned Parquet on HDFS, then a Spark MLlib RandomForest (200 trees, evaluated on PR-AUC given heavy class imbalance) predicting whether a new repository reaches ≥1,000 stars within 90 days, trained on a 2023–24 split and validated on 2025.

- **Streaming path.** GitHub Events API through a 4-token rotator (20k requests/hour) into Kafka (7 topics × 4 partitions), consumed by Spark Structured Streaming on 5-minute windows, scoring still-pending repositories with the batch-trained model and writing to InfluxDB.

- **Serving.** Both paths converge in Grafana, including a live viral-prediction panel driven by Flux queries.

- **Topology.** A 15-service `docker-compose` stack — Hadoop namenode plus two datanodes with YARN, Spark master/worker, Zookeeper and Kafka, Airflow webserver/scheduler on Postgres, InfluxDB, and Grafana.

## What I built

The single-source event schema, the GCS bulk downloader, the PySpark JSON.GZ-to-Parquet parser, the validation reporter, and both Airflow DAGs — daily ingestion and weekly model retraining that republishes the model to HDFS. I wrote and debugged the full compose topology, and the project's only automated tests: 261 pytest cases over the batch layer.

I also did the integration work that a four-way split tends to need — Python 3.8 compatibility fixes, a streaming lag-metric correction, and the Flux query fixes behind the live predictions panel — and reviewed and merged most of the team's pull requests.
