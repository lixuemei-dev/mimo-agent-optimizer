# MiMo Agent Auto-Optimizer

![CI Passing](https://img.shields.io/badge/CI-Passing-brightgreen)
![License MIT](https://img.shields.io/badge/License-MIT-blue)
![Version 1.0.0](https://img.shields.io/badge/Version-1.0.0-orange)
![Tests 15+](https://img.shields.io/badge/Tests-15%2B-purple)
![Files 40+](https://img.shields.io/badge/Files-40%2B-blue)
![Lines 3500+](https://img.shields.io/badge/Lines-3500%2B-purple)

**Auto-tune MiMo agent configurations for optimal token efficiency, latency, and cost.**

Most developers deploy LLM agents with default configs and never revisit them. The result: 30-50% token waste, hidden latency bottlenecks, and monthly bills that grow faster than usage. MiMo Agent Auto-Optimizer solves this by running your agent through a profiling → analysis → optimization → validation pipeline, then delivering a tested, improved configuration with measurable before/after comparisons.

---

## Why This Exists

| Problem | What Happens | Impact |
|---------|-------------|--------|
| **Default configs waste tokens** | Out-of-the-box configurations use verbose system prompts, redundant context injection, and unoptimized max_tokens settings | 30-50% token waste on every inference call |
| **Latency bottlenecks hidden** | Multi-step agent pipelines accumulate hidden latency at each hop — tool dispatch, context assembly, response streaming | Production agents that feel sluggish but nobody knows why |
| **Cost spirals unchecked** | Without per-session cost tracking, token costs grow silently until the monthly bill arrives | Budget overruns of 2-3x are common in teams |
| **Manual tuning is slow** | Engineers spend days tweaking temperature, top_p, max_tokens, and prompt wording with no systematic methodology | Weeks of trial-and-error with inconsistent results |
| **No A/B validation** | Configuration changes are deployed without statistical validation — regressions slip through | "Optimization" that actually makes things worse |

---

## Quick Start

```bash
# Clone the repository
git clone git@github.com:lixuemei-dev/mimo-agent-optimizer.git
cd mimo-agent-optimizer

# Install dependencies
npm install

# Set up API access
cp .env.example .env
# Edit .env with your MiMo API key

# Run the full optimization pipeline
node scripts/run.js

# Run with a specific config profile
node scripts/run.js --profile balanced

# Run only the profiling step (no optimization)
node scripts/run.js --step profile

# Compare two optimization runs
node scripts/compare.js results/run-a.json results/run-b.json
```

---

## How It Works

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Profile  │───▶│ Analyze  │───▶│ Optimize │───▶│ Validate │───▶│  Report  │
│           │    │          │    │          │    │          │    │          │
│ Run       │    │ Find     │    │ Apply    │    │ A/B test │    │ Generate │
│ workloads │    │ bottlenecks   │ strategies   │ results  │    │ summary  │
│ collect   │    │ & token  │    │ to agent │    │ vs       │    │ with     │
│ metrics   │    │ waste    │    │ config   │    │ baseline │    │ metrics  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

### Pipeline Steps

1. **Profile** — Execute reference workloads against your current agent configuration. Collect token counts (input/output/reasoning), latency percentiles (p50/p95/p99), tool call frequency, and per-session cost estimates.

2. **Analyze** — Identify bottlenecks through three analyzers:
   - **Bottleneck Analyzer**: Finds the slowest steps in your agent pipeline (which tool calls stall, where context assembly bleeds tokens)
   - **Token Waste Detector**: Spots redundant context, oversized system prompts, and unnecessary reasoning overhead
   - **Cost Hot-spot Mapper**: Maps cost-per-step to find where your budget is actually going

3. **Optimize** — Apply one or more optimization strategies to the agent configuration. Each strategy produces a modified config with specific changes documented.

4. **Validate** — Re-run the same workloads against the optimized configuration. Statistically compare results (not just averages — distribution-level comparison with confidence intervals).

5. **Report** — Generate a structured report in console, JSON, or HTML format with before/after tables, improvement percentages, and actionable next steps.

---

## Optimization Strategies

### Token Budget Optimization
Trims per-session token consumption without measurable quality loss.

| Technique | How It Works | Typical Savings |
|-----------|-------------|-----------------|
| System prompt compression | Remove redundant instructions, merge overlapping directives | 15-25% of system tokens |
| Context window trimming | Drop low-relevance historical messages before they hit the window | 20-40% of context tokens |
| Tool-result deduplication | Merge repeated tool outputs, cache intermediate results | 10-20% of tool tokens |
| Reasoning overhead reduction | Optimize prompt phrasing to reduce unnecessary chain-of-thought | 5-15% of output tokens |

### Latency Tuning
Optimizes inference latency through configuration changes and dispatch strategies.

| Technique | How It Works | Typical Improvement |
|-----------|-------------|-------------------|
| Prompt restructuring | Reorder instructions to reduce time-to-first-token | 10-30% TTFT reduction |
| Parallel tool dispatch | Identify independent tool calls and batch them | 20-40% wall-clock reduction |
| Streaming optimization | Tune chunk sizes and flush intervals for smoother output | Perceived speed improvement |
| Context size management | Keep context under critical thresholds where latency spikes | Avoid 2-5x latency jumps |

### Cost Control
Manages API spend through model selection and budget enforcement.

| Technique | How It Works | Typical Savings |
|-----------|-------------|-----------------|
| Model tier routing | Use cheaper models (GPT-5.5-mini, Sonnet 4.6) for simple tasks, expensive models for complex ones | 30-50% cost reduction |
| Query caching | Cache repeated or similar queries to avoid redundant API calls | 15-25% on repetitive workloads |
| Budget caps | Set per-session and per-day cost limits with automatic throttling | Predictable monthly spend |
| Token-aware scheduling | Batch requests during off-peak hours when possible (MiMo night discount) | Additional 20% on MiMo |

---

## Config Profiles

| Profile | Target | Token Budget | Max Latency | Use Case |
|---------|--------|-------------|-------------|----------|
| **aggressive** | Maximum savings | 50K tokens/session | 5s p95 | High-volume workloads, cost-sensitive deployments |
| **balanced** | Best trade-off | 100K tokens/session | 10s p95 | General-purpose agent tasks, production default |
| **conservative** | Maximum quality | 200K tokens/session | 30s p95 | Complex reasoning, long-context analysis, code generation |

### Custom Profiles

Create your own profile by defining thresholds:

```json
{
  "name": "my-profile",
  "tokenBudget": 150000,
  "maxLatencyMs": 15000,
  "costCapPerSession": 0.50,
  "strategies": ["token-budget", "latency"],
  "modelRouting": {
    "simple": "gpt-5.5-mini",
    "complex": "mimo-v2.5-pro"
  }
}
```

---

## Adapters

The optimizer ships with adapters for five major LLM providers:

| Adapter | Model Family | Streaming | Function Calling | Pricing Reference |
|---------|-------------|-----------|-----------------|-------------------|
| **MiMo** | Xiaomi MiMo-V2.5-Pro / V2.5 | ✅ | ✅ | Token Plan credits |
| **OpenAI** | GPT-5.5 / GPT-5.5-mini | ✅ | ✅ | $1.75/$14 per 1M tokens |
| **Anthropic** | Claude Sonnet 4.6 / Opus 4.7 | ✅ | ✅ | $3-5/$15-25 per 1M tokens |
| **Google** | Gemini 3.1 Pro | ✅ | ✅ | $1.50/$12 per 1M tokens |
| **Alibaba** | Qwen 3 Coder 32B | ✅ | ✅ | $0.30/$1.50 per 1M tokens |

### Adding Custom Adapters

```javascript
const { BaseAdapter } = require('./src/adapters/base');

class MyCustomAdapter extends BaseAdapter {
  constructor(opts) {
    super(opts);
    this.name = 'my-provider';
  }

  normalizeConfig(config) {
    // Convert internal config to your provider's API format
    return { /* ... */ };
  }

  calculateCost(inputTokens, outputTokens) {
    // Return cost in USD
    return inputTokens * this.inputRate + outputTokens * this.outputRate;
  }
}
```

---

## Workloads

The optimizer includes pre-built workloads for testing:

### Stress Tests (`workloads/stress/`)
Push the agent to its limits:
- **heavy-agent.json** — 50+ turn conversation with accumulated context
- **multi-tool.json** — 20+ tool calls per turn, parallel dispatch

### Realistic Scenarios (`workloads/realistic/`)
Based on actual production patterns:
- **coding-session.json** — Multi-file code generation with debugging loops
- **research-task.json** — Web search, summarization, and citation chain

### Reference Baselines (`workloads/reference/`)
Pre-configured comparison targets:
- **gpt4o-baseline.json** — GPT-5.5 reference results
- **claude35-baseline.json** — Claude Sonnet 4.6 reference results

### Custom Workloads

```json
{
  "name": "my-workload",
  "turns": 20,
  "toolsPerTurn": 5,
  "contextSize": 16000,
  "prompts": [
    "Analyze this codebase and suggest improvements",
    "Write unit tests for the auth module",
    "Debug the failing CI pipeline"
  ]
}
```

---

## Analyzers

| Analyzer | What It Measures | Key Metrics |
|----------|-----------------|-------------|
| **Bottleneck Analyzer** | Where time is spent in the pipeline | Per-step latency, slowest tool calls, context assembly time |
| **Token Waste Detector** | Redundant or oversized content | System prompt ratio, context bloat %, reasoning overhead |
| **Cost Hot-spot Mapper** | Where money is spent | Cost per tool call, cost per turn, model tier utilization |

---

## Scoring

Each optimization run produces a composite score:

```
composite_score = Σ(dimension_weight × dimension_score) / Σ(dimension_weight)
```

Default weights (configurable in `scoring/weights.json`):

| Dimension | Weight | Measures |
|-----------|--------|----------|
| Token Efficiency | 0.35 | Tokens saved vs. baseline |
| Latency Improvement | 0.30 | Latency reduction vs. baseline |
| Cost Reduction | 0.25 | Dollar savings vs. baseline |
| Quality Preservation | 0.10 | Output quality retained (accuracy, relevance) |

---

## Token Consumption

Based on typical agent workloads:

| Metric | Per Session | Monthly (est.) |
|--------|------------|----------------|
| Input tokens | 60K–120K | 600M–900M |
| Output tokens | 40K–80K | 400M–600M |
| **Total** | **100K–200K** | **1B–1.5B** |

The optimization pipeline itself consumes tokens during profiling and validation (typically 2-3x per workload run). With weekly optimization cycles across multiple agent configurations, total monthly consumption reaches 1-1.5B tokens.

Optimized configurations target a **35% reduction** in total token consumption without measurable quality degradation.

---

## Output Artifacts

Each run produces structured results in `results/`:

```
results/
├── 2026-05-26T14-30-00/
│   ├── manifest.json          # Run metadata
│   ├── profile.json           # Baseline metrics
│   ├── analysis.json          # Bottleneck findings
│   ├── optimized-config.json  # Improved configuration
│   ├── validation.json        # A/B test results
│   ├── summary.json           # Composite scores
│   └── comparison.json        # vs. previous run (if available)
├── latest → 2026-05-26T14-30-00
```

---

## CI/CD Integration

### GitHub Actions

The included workflow runs:
- **On PR**: Smoke test (profile + analyze, no optimization) — fast feedback
- **Nightly**: Full optimization pipeline with comparison against previous run
- **On tag**: Full suite + HTML report generation

### Programmatic Usage

```javascript
const { Optimizer } = require('./src/core/optimizer');

const optimizer = new Optimizer({
  adapter: 'mimo',
  model: 'MiMo-V2.5-Pro',
  profile: 'balanced',
  strategies: ['token-budget', 'cost'],
});

const result = await optimizer.run({
  workloads: ['coding-session', 'research-task'],
});

console.log(`Score: ${result.compositeScore}`);
console.log(`Tokens saved: ${result.tokensSaved}`);
console.log(`Cost reduced: $${result.costSaved}`);
```

---

## Development

```bash
# Clone
git clone git@github.com:lixuemei-dev/mimo-agent-optimizer.git
cd mimo-agent-optimizer

# Install
npm install

# Run tests
npm test

# Run with coverage
node --test --experimental-test-coverage tests/**/*.test.js

# Lint
node --check src/**/*.js scripts/**/*.js
```

---

## Project Structure

```
mimo-agent-optimizer/
├── src/
│   ├── core/           # Optimizer, profiler, benchmark, reporter
│   ├── strategies/     # Token budget, latency, cost strategies
│   ├── adapters/       # MiMo, OpenAI, Anthropic, Google, Qwen
│   ├── analyzers/      # Bottleneck, recommendation engines
│   └── reporters/      # Console, JSON, HTML output
├── configs/            # Pre-built optimization profiles
├── workloads/          # Stress, realistic, and reference tests
├── tests/              # Unit and integration tests
├── scoring/            # Composite scoring and comparison
├── scripts/            # CLI entry points
├── docs/               # Project demo page
└── results/            # Optimization run outputs
```

---

## Roadmap

- [ ] v1.1: Web UI for optimization results visualization
- [ ] v1.2: Multi-model parallel comparison mode
- [ ] v1.3: Cost prediction engine (estimate monthly spend before running)
- [ ] v1.4: Plugin system for custom strategies and analyzers
- [ ] v2.0: Continuous optimization daemon (auto-tune on schedule)

---

## License

MIT License — see [LICENSE](LICENSE) for details.
