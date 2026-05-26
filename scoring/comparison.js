/**
 * Comparison Engine
 * Statistical comparison between baseline and optimized results.
 */

class ComparisonEngine {
  constructor() {
    this.significanceLevel = 0.05;
  }

  /**
   * Compare two sets of metrics.
   * @param {object} baseline  - Baseline metrics { tokens, latency, cost }.
   * @param {object} optimized - Optimized metrics.
   * @returns {object} Comparison with deltas and significance.
   */
  compare(baseline, optimized) {
    const tokenDelta = baseline.tokens - optimized.tokens;
    const latencyDelta = baseline.latency - optimized.latency;
    const costDelta = baseline.cost - optimized.cost;

    const tokenPct = baseline.tokens > 0 ? ((tokenDelta / baseline.tokens) * 100).toFixed(1) : 0;
    const latencyPct = baseline.latency > 0 ? ((latencyDelta / baseline.latency) * 100).toFixed(1) : 0;
    const costPct = baseline.cost > 0 ? ((costDelta / baseline.cost) * 100).toFixed(1) : 0;

    return {
      tokens: {
        baseline: baseline.tokens,
        optimized: optimized.tokens,
        delta: tokenDelta,
        improvement: `${tokenPct}%`,
        significant: tokenDelta > baseline.tokens * 0.1,
      },
      latency: {
        baseline: baseline.latency,
        optimized: optimized.latency,
        delta: latencyDelta,
        improvement: `${latencyPct}%`,
        significant: latencyDelta > baseline.latency * 0.1,
      },
      cost: {
        baseline: baseline.cost,
        optimized: optimized.cost,
        delta: costDelta,
        improvement: `${costPct}%`,
        significant: costDelta > baseline.cost * 0.1,
      },
      overall: {
        improved: tokenDelta > 0 && latencyDelta >= 0,
        regressions: this._detectRegressions(baseline, optimized),
      },
    };
  }

  /**
   * Detect any metric regressions.
   * @private
   */
  _detectRegressions(baseline, optimized) {
    const regressions = [];
    if (optimized.tokens > baseline.tokens) regressions.push('tokens');
    if (optimized.latency > baseline.latency * 1.1) regressions.push('latency');
    if (optimized.cost > baseline.cost * 1.1) regressions.push('cost');
    return regressions;
  }
}

module.exports = ComparisonEngine;
