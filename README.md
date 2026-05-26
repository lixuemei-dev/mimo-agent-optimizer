# MiMo Agent Auto-Optimizer

![CI Passing](https://img.shields.io/badge/CI-Passing-brightgreen)
![License MIT](https://img.shields.io/badge/License-MIT-blue)
![Version 1.0.0](https://img.shields.io/badge/Version-1.0.0-orange)
![Tests 15+](https://img.shields.io/badge/Tests-15%2B-purple)

Auto-tune MiMo agent configurations for optimal token efficiency, latency, and cost.

---

## Why This Exists

| Pain Point | Description |
|---|---|
| **Default configs waste tokens** | Out-of-the-box configurations use verbose prompts and redundant context, burning tokens on every inference call. |
| **Latency bottlenecks hidden** | Multi-step agent pipelines accumulate hidden latency that only surfaces under production load. |
| **Cost spirals unchecked** | Without per-session tracking, token costs grow silently until the bill arrives. |
| **Manual tuning is slow** | Engineers spend days tweaking temperatures and max_tokens with no systematic methodology. |
| **No A/B validation** | Configuration changes are deployed without statistical validation, leading to regressions. |

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/mimo-optimizer/mimo-agent-optimizer.git
cd mimo-agent-optimizer

# Install dependencies
npm install

# Run the optimizer
node scripts/run.js
```

---

## How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Profile   │────▶│   Analyze   │────▶│  Optimize   │────▶│  Validate   │────▶│   Report    │
│             │     │             │     │             │     │             │     │             │
│ Run workload │     │ Find        │     │ Apply       │     │ A/B test    │     │ Generate    │
│ collect      │     │ bottlenecks │     │ strategies  │     │ results     │     │ summary     │
│ metrics      │     │ & waste     │     │ to config   │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Pipeline Steps

1. **Profile** — Execute reference workloads against baseline configurations and collect token counts, latency, and cost metrics.
2. **Analyze** — Identify bottlenecks: excessive token usage, slow inference paths, and cost hot-spots per tool call.
3. **Optimize** — Apply selected strategy (Token Budget / Latency Tuning / Cost Control) to the agent configuration.
4. **Validate** — Re-run workloads against optimized configs and statistically compare results.
5. **Report** — Generate console, JSON, or HTML reports with before/after comparisons and recommendations.

---

## Strategies

### Token Budget
Reduces per-session token consumption by trimming context windows, compressing system prompts, and deduplicating tool-result content. Targets 30-50% token reduction with minimal quality loss.

### Latency Tuning
Optimizes inference latency through prompt engineering, parallel tool dispatch, and streaming response strategies. Focuses on time-to-first-token and total completion time.

### Cost Control
Manages API spend by selecting cost-optimal models for each task tier, caching repeated queries, and enforcing per-session budget caps. Keeps monthly costs within defined thresholds.

---

## Config Profiles

| Profile | Target | Token Budget | Max Latency | Use Case |
|---|---|---|---|---|
| **aggressive** | Maximum savings | 50K tokens | 5s | High-volume, cost-sensitive workloads |
| **balanced** | Best trade-off | 100K tokens | 10s | General-purpose agent tasks |
| **conservative** | Maximum quality | 200K tokens | 30s | Complex reasoning, long-context tasks |

---

## Adapters

The optimizer ships with adapters for three major LLM providers:

| Adapter | Model Family | Streaming | Function Calling |
|---|---|---|---|
| **MiMo** | Xiaomi MiMo-V2.5-Pro / V2.5 | ✅ | ✅ |
| **OpenAI** | GPT-5.5 / GPT-5.5-mini | ✅ | ✅ |
| **Anthropic** | Claude Sonnet 4.6 / Opus 4.7 | ✅ | ✅ |
| **Google** | Gemini 3.1 Pro | ✅ | ✅ |
| **Alibaba** | Qwen 3 Coder 32B | ✅ | ✅ |

---

## Token Consumption

Based on typical agent workloads:

| Metric | Per Session | Monthly (est.) |
|---|---|---|
| Input tokens | 60K–120K | 600M–900M |
| Output tokens | 40K–80K | 400M–600M |
| **Total** | **100K–200K** | **1B–1.5B** |

Optimized configurations target a 35% reduction in total token consumption without measurable quality degradation.

---

## License

MIT License — see [LICENSE](LICENSE) for details.
