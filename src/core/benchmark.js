/**
 * Benchmark — Run optimized configs and measure performance.
 */

const fs = require('fs');
const path = require('path');

class Benchmark {
  constructor() {
    this.iterations = 5;
  }

  /**
   * Benchmark a configuration against reference workloads.
   * @param {object} config - Agent configuration.
   * @returns {Promise<object>} Benchmark results with score.
   */
  async run(config) {
    const results = [];

    for (let i = 0; i < this.iterations; i++) {
      const iteration = await this._runIteration(config, i);
      results.push(iteration);
    }

    const aggregated = this._aggregate(results);
    const score = this._calculateScore(aggregated);

    return {
      config,
      iterations: results,
      metrics: aggregated,
      score,
      p50: this._percentile(results.map((r) => r.latencyMs), 50),
      p95: this._percentile(results.map((r) => r.latencyMs), 95),
      p99: this._percentile(results.map((r) => r.latencyMs), 99),
    };
  }

  /**
   * Run a single benchmark iteration (simulated).
   * @private
   */
  async _runIteration(config, index) {
    const maxTokens = config.maxTokens || 100000;
    const tokens = Math.floor(Math.random() * maxTokens * 0.5) + maxTokens * 0.1;
    const latency = Math.floor(Math.random() * 3000) + 500;
    const cost = tokens * 0.000002;

    return {
      iteration: index,
      tokens: Math.floor(tokens),
      latencyMs: latency,
      costUsd: cost,
    };
  }

  /**
   * Aggregate iteration results.
   * @private
   */
  _aggregate(results) {
    const totals = results.reduce(
      (acc, r) => ({
        totalTokens: acc.totalTokens + r.tokens,
        totalLatency: acc.totalLatency + r.latencyMs,
        totalCost: acc.totalCost + r.costUsd,
      }),
      { totalTokens: 0, totalLatency: 0, totalCost: 0 }
    );

    return {
      totalTokens: totals.totalTokens,
      avgLatency: Math.round(totals.totalLatency / results.length),
      totalCost: totals.totalCost,
      avgTokens: Math.round(totals.totalTokens / results.length),
    };
  }

  /**
   * Calculate composite score.
   * @private
   */
  _calculateScore(metrics) {
    return (
      metrics.totalTokens * 0.4 +
      metrics.avgLatency * 0.3 +
      metrics.totalCost * 10000 * 0.3
    );
  }

  /**
   * Compute percentile from an array of values.
   * @private
   */
  _percentile(values, p) {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }
}

module.exports = { Benchmark };
