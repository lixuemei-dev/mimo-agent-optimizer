/**
 * Cost Strategy
 * Manages API spend through model selection, caching, and budget caps.
 */

class CostStrategy {
  constructor() {
    this.name = 'cost';
    this.monthlyBudgetUsd = 100;
  }

  /**
   * Apply cost optimizations to a configuration.
   * @param {object} config - Current agent configuration.
   * @param {Array} recommendations - Analyzer recommendations.
   * @returns {object} Optimized configuration.
   */
  apply(config, recommendations = []) {
    const optimized = { ...config };

    // 1. Downgrade model for simple tasks
    if (optimized.model === 'gpt-4o') {
      optimized.model = 'gpt-4o-mini';
      optimized._costSavingsPct = (optimized._costSavingsPct || 0) + 40;
    }

    // 2. Enable response caching
    optimized.cacheEnabled = true;
    optimized.cacheTtlMs = 60000; // 1 minute

    // 3. Set per-session budget cap
    optimized.maxCostPerSessionUsd = this.monthlyBudgetUsd / 30; // Daily budget

    // 4. Limit tool call depth to prevent cost spirals
    optimized.maxToolCallDepth = optimized.maxToolCallDepth || 5;

    // 5. Enable prompt caching (provider-level)
    optimized.promptCaching = true;

    optimized._appliedStrategy = this.name;
    optimized._timestamp = new Date().toISOString();

    return optimized;
  }
}

module.exports = CostStrategy;
