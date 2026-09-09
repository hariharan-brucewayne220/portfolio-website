---
title: Do Time-Series Foundation Models Beat HAR for Realized Volatility?
date: 2026-08-14
description: A free-data replication of arXiv:2607.05291 benchmarking Chronos-Bolt and IBM Granite TTM against HAR and GARCH across 30 assets and true 5-minute crypto RV. The answer is mostly no, and the write-up says so.
tags: [Python, Research, Machine-Learning, Time-Series, Forecasting, AI/ML, AI]
github: https://github.com/hariharan-brucewayne220/rv-tsfm-bench
featured: true
---

Zero-shot time-series foundation models are marketed as drop-in replacements for classical forecasters. I tested that claim on realized volatility, where HAR has been the stubborn baseline for twenty years, and reported the result I got rather than the one I wanted.

## Design

- **Spec first.** ~46 KB of `SPEC.md` / `PLAN.md` — alignment rules, lookahead constraints, lognormal corrections — written before any modelling code, so the evaluation could not be tuned after seeing results.

- **Two tracks.** Track A: 30 assets (13 equity ETFs, 7 FX pairs, 10 futures) with range-based Garman-Klass and Parkinson RV from 2005–2026 OHLC. Track B: true 5-minute realized volatility for BTC, ETH, BNB, XRP and SOL rebuilt from Binance 1-minute klines, with a ≥260-valid-interval-per-day rule.

- **Models.** Chronos-Bolt (tiny/small) and Granite TTM against HAR, Log-HAR, AR(1)-log, EWMA and GARCH(1,1), on a rolling 1000-day window refit every 22 days with direct-h estimation.

- **Scoring.** QLIKE on variance and MSE on annualized vol, with Diebold-Mariano tests (Newey-West, Harvey-Leybourne-Newbold correction) and rolling Mincer-Zarnowitz recalibration to separate genuine skill from miscalibration.

## Findings

- **At h=1 the foundation models are at parity on daily proxies and genuinely ahead on crypto 5-minute RV** — TTM reaches a 0.876 QLIKE ratio versus Log-HAR and is DM-significantly better on 3 of 5 symbols, worse on none.

- **The crypto edge survives recalibration (0.876 → 0.914); the Track A edge does not (0.998 → 1.027).** The apparent daily-proxy result was scaling, not skill — a distinction the recalibration step exists to expose.

- **At h=5 and h=22 econometrics wins decisively**, with TSFM ratios of 1.14–1.83. This diverges from the source paper and is reported as such.

- **Checkpoint choice mattered as much as architecture.** Moving TTM to the paper's `512-96-ft-r2.1` branch improved QLIKE by 9–22% and flipped the ensemble conclusion; the superseded tables are kept in the repo rather than quietly replaced.

## Correctness

The claim that matters in a backtest is that no future information leaked, so it is tested rather than asserted: `test_rolling_no_lookahead` pins the windowing, and `test_dm_newey_west_vs_statsmodels` validates the hand-rolled Diebold-Mariano implementation against statsmodels. Forecasts are cached and keyed by asset, model, horizon and origin so results reproduce exactly.
