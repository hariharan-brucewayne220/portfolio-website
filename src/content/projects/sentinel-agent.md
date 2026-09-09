---
title: Sentinel – Autonomous Agent with On-Chain Guardrails
date: 2026-04-27
description: A LangGraph trading agent on Base Sepolia whose limits are enforced by a smart contract rather than by its own prompt, with every decision's reasoning pinned to IPFS and readable from the dashboard.
tags: [Solidity, Python, LangGraph, ERC-4337, Next.js, AI/ML, AI, Software]
github: https://github.com/hariharan-brucewayne220/sentinel-blockchain-agent
featured: true
---

The interesting question in agentic systems is not what an agent decides but what stops it. Sentinel puts the trust boundary on-chain: the LLM only ever *proposes* a trade, and a contract decides whether it happens.

## Design

- **Agent.** A LangGraph state machine — researcher → strategist → risk check → executor → auditor — with bounded retries back to the strategist. The researcher reads live Chainlink feeds and account balances; the strategist proposes; the auditor confirms the receipt on-chain.

- **The guardrail is a contract, not a prompt.** `PolicyGuard.sol` enforces a token whitelist, a USD trade cap priced from Chainlink with a one-hour staleness revert, per-token cooldowns and a 24-hour drawdown window. A proposal that violates any of these reverts the transaction, regardless of what the model concluded.

- **Account abstraction from scratch.** ERC-4337 v0.7 packed UserOperations built and signed in Python — gas estimation and submission through a Pimlico bundler, EIP-191 signing over the v0.7 hash, and receipt polling — rather than delegating to an SDK.

- **Auditability.** Each decision's full reasoning is pinned to IPFS and its CID travels in the call data, so the dashboard's "WHY?" button resolves the exact rationale behind any historical action via a The Graph subgraph.

## Verification

41 Foundry tests across the four contracts (including 10,000-run fuzz tests on the policy logic) and 35 Python tests. The packing of the paymaster field is pinned from both sides: a cross-language test feeds the exact bytes the Python encoder produces through the EntryPoint's own `unpackPaymasterStaticFields`, so an offset error cannot pass by agreeing with itself.

Building this also surfaced the failure mode that matters most in an autonomous system: a swallowed exception on an unreachable RPC produced a *fabricated* zero-balance portfolio that the strategist would then size trades against. It now fails loudly at the first on-chain read.

## Scope

This is a testnet demonstrator. Swaps execute against a mock DEX rather than real liquidity, and the zero-knowledge attestation path is scaffolding, not a working verifier — the repository's README states both plainly.
