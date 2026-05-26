/**
 * Composite Scoring Engine
 * Calculates a single quality score from multiple metrics.
 */

const weights = require('./weights.json');

class CompositeScorer {
  constructor() {
    this.weights = weights.weights;
    this.normalizers = weights.normalizers;
    this.bonuses = weights.bonuses;
    this.penalties = weights.penalties;
  }

  /**
   * Calculate a composite score from metrics.
   * @param {object} metrics - { tokens, latency, cost, quality }
   * @param {object} config  - Agent configuration (for bonus/penalty evaluation).
   * @returns {number} Composite score (lower is better unless quality dominates).
   */
  score(metrics, config = {}) {
    const normalized = this._normalize(metrics);
    let total = 0;

    // Weighted sum of normalized metrics
    total += normalized.tokens * this.weights.tokens;
    total += normalized.latency * this.weights.latency;
    total += normalized.cost * this.weights.cost;
    total += normalized.quality * this.weights.quality;

    // Apply bonuses (negative = score improvement)
    if (config.streaming) total += this.bonuses.streamingEnabled;
    if (config.parallelToolCalls) total += this.bonuses.parallelToolsEnabled;
    if (config.cacheEnabled) total += this.bonuses.cacheEnabled;
    if (config.deduplicateToolResults) total += this.bonuses.deduplicationEnabled;

    // Apply penalties
    if (!config.timeoutMs) total += this.penalties.missingTimeout;
    if ((config.maxToolCallDepth || 0) > 10) total += this.penalties.excessiveToolDepth;
    if (!config.maxCostPerSessionUsd) total += this.penalties.noBudgetCap;

    return Math.round(total);
  }

  /**
   * Normalize raw metrics to a 0-1000 scale.
   * @private
   */
  _normalize(metrics) {
    return {
      tokens: this._norm(metrics.tokens, this.normalizers.tokens),
      latency: this._norm(metrics.latency, this.normalizers.latency),
      cost: this._norm(metrics.cost, this.normalizers.cost),
      quality: this._normInverse(metrics.quality || 1.0, this.normalizers.quality),
    };
  }

  _norm(value, norm) {
    const clamped = Math.min(value, norm.max);
    return (clamped / norm.max) * 1000;
  }

  _normInverse(value, norm) {
    const clamped = Math.min(value, norm.max);
    return (1 - clamped / norm.max) * 1000;
  }
}

module.exports = CompositeScorer;
