/**
 * RecommendationEngine
 * Generates actionable optimization recommendations from detected bottlenecks.
 */

class RecommendationEngine {
  constructor() {
    this.strategies = {
      'token-waste': [
        {
          action: 'compress-system-prompt',
          description: 'Reduce system prompt to essential instructions only',
          impact: 'high',
          effort: 'low',
        },
        {
          action: 'enable-result-dedup',
          description: 'Deduplicate repeated tool call results in context',
          impact: 'medium',
          effort: 'low',
        },
        {
          action: 'reduce-context-window',
          description: 'Lower maxContextTokens from 128K to 80K',
          impact: 'high',
          effort: 'medium',
        },
      ],
      latency: [
        {
          action: 'enable-streaming',
          description: 'Use streaming responses to reduce perceived latency',
          impact: 'high',
          effort: 'low',
        },
        {
          action: 'parallel-tool-dispatch',
          description: 'Execute independent tool calls in parallel',
          impact: 'high',
          effort: 'medium',
        },
        {
          action: 'reduce-max-tokens',
          description: 'Lower max_tokens to speed up generation',
          impact: 'medium',
          effort: 'low',
        },
      ],
      cost: [
        {
          action: 'model-downgrade',
          description: 'Use GPT-4o-mini for simple routing tasks',
          impact: 'high',
          effort: 'low',
        },
        {
          action: 'enable-response-cache',
          description: 'Cache identical requests for 60 seconds',
          impact: 'medium',
          effort: 'low',
        },
        {
          action: 'set-budget-cap',
          description: 'Enforce per-session cost ceiling',
          impact: 'high',
          effort: 'low',
        },
      ],
      'tool-abuse': [
        {
          action: 'limit-tool-depth',
          description: 'Cap recursive tool call depth at 5',
          impact: 'medium',
          effort: 'low',
        },
        {
          action: 'batch-tool-calls',
          description: 'Combine sequential tool calls into batches',
          impact: 'medium',
          effort: 'medium',
        },
      ],
    };
  }

  /**
   * Generate recommendations from a list of bottlenecks.
   * @param {Array<object>} bottlenecks - Bottleneck objects from BottleneckAnalyzer.
   * @returns {Array<object>} Prioritized recommendation list.
   */
  generate(bottlenecks) {
    const seen = new Set();
    const recommendations = [];

    for (const bottleneck of bottlenecks) {
      const candidates = this.strategies[bottleneck.type] || [];
      for (const rec of candidates) {
        const key = rec.action;
        if (!seen.has(key)) {
          seen.add(key);
          recommendations.push({
            ...rec,
            source: bottleneck.type,
            severity: bottleneck.severity,
          });
        }
      }
    }

    // Sort: high impact first, then by severity
    const severityOrder = { high: 0, medium: 1, low: 2 };
    const impactOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => {
      const impactDiff = (impactOrder[a.impact] || 2) - (impactOrder[b.impact] || 2);
      if (impactDiff !== 0) return impactDiff;
      return (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2);
    });

    return recommendations;
  }
}

module.exports = RecommendationEngine;
