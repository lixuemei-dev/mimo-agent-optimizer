/**
 * Latency Strategy
 * Optimizes inference latency through prompt engineering and parallel dispatch.
 */

class LatencyStrategy {
  constructor() {
    this.name = 'latency';
    this.targetLatencyMs = 5000;
  }

  /**
   * Apply latency optimizations to a configuration.
   * @param {object} config - Current agent configuration.
   * @param {Array} recommendations - Analyzer recommendations.
   * @returns {object} Optimized configuration.
   */
  apply(config, recommendations = []) {
    const optimized = { ...config };

    // 1. Enable streaming responses
    optimized.streaming = true;

    // 2. Parallel tool dispatch
    optimized.parallelToolCalls = true;
    optimized.maxParallelTools = 3;

    // 3. Reduce max tokens for faster completion
    if (optimized.maxTokens > 4096) {
      optimized.maxTokens = 4096;
      optimized._latencySavingsMs = (optimized._latencySavingsMs || 0) + 2000;
    }

    // 4. Shorter system prompt for faster time-to-first-token
    if (optimized.systemPrompt && optimized.systemPrompt.length > 1000) {
      optimized.systemPrompt = optimized.systemPrompt.substring(0, 1000);
      optimized._latencySavingsMs = (optimized._latencySavingsMs || 0) + 500;
    }

    // 5. Set timeout based on target latency
    optimized.timeoutMs = this.targetLatencyMs;

    optimized._appliedStrategy = this.name;
    optimized._timestamp = new Date().toISOString();

    return optimized;
  }
}

module.exports = LatencyStrategy;
