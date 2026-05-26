/**
 * BottleneckAnalyzer
 * Identifies performance bottlenecks and token waste in agent profiles.
 */

class BottleneckAnalyzer {
  constructor() {
    this.thresholds = {
      highTokenCount: 50000,
      highLatencyMs: 3000,
      highCostUsd: 0.5,
      excessiveToolCalls: 10,
    };
  }

  /**
   * Analyze a profile result and return detected bottlenecks.
   * @param {object} profile - Profiler output with metrics and results.
   * @returns {Array<object>} List of bottleneck objects.
   */
  analyze(profile) {
    const bottlenecks = [];

    if (profile.metrics.totalTokens > this.thresholds.highTokenCount) {
      bottlenecks.push({
        type: 'token-waste',
        severity: 'high',
        message: `Token usage (${profile.metrics.totalTokens}) exceeds ${this.thresholds.highTokenCount} threshold`,
        metric: profile.metrics.totalTokens,
        threshold: this.thresholds.highTokenCount,
      });
    }

    if (profile.metrics.latencyMs > this.thresholds.highLatencyMs) {
      bottlenecks.push({
        type: 'latency',
        severity: 'high',
        message: `Latency (${profile.metrics.latencyMs}ms) exceeds ${this.thresholds.highLatencyMs}ms threshold`,
        metric: profile.metrics.latencyMs,
        threshold: this.thresholds.highLatencyMs,
      });
    }

    if (profile.metrics.costUsd > this.thresholds.highCostUsd) {
      bottlenecks.push({
        type: 'cost',
        severity: 'medium',
        message: `Cost ($${profile.metrics.costUsd.toFixed(4)}) exceeds $${this.thresholds.highCostUsd} threshold`,
        metric: profile.metrics.costUsd,
        threshold: this.thresholds.highCostUsd,
      });
    }

    if (profile.metrics.toolCalls > this.thresholds.excessiveToolCalls) {
      bottlenecks.push({
        type: 'tool-abuse',
        severity: 'medium',
        message: `Tool calls (${profile.metrics.toolCalls}) exceed ${this.thresholds.excessiveToolCalls} threshold`,
        metric: profile.metrics.toolCalls,
        threshold: this.thresholds.excessiveToolCalls,
      });
    }

    // Check for per-workload outliers
    if (profile.results) {
      for (const result of profile.results) {
        if (result.tokens > this.thresholds.highTokenCount * 0.5) {
          bottlenecks.push({
            type: 'workload-outlier',
            severity: 'low',
            message: `Workload "${result.name}" consumed ${result.tokens} tokens`,
            metric: result.tokens,
            workload: result.name,
          });
        }
      }
    }

    return bottlenecks;
  }
}

module.exports = BottleneckAnalyzer;
