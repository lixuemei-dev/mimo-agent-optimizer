/**
 * JsonReporter
 * Outputs optimization results as structured JSON.
 */

const fs = require('fs');
const path = require('path');

class JsonReporter {
  constructor() {
    this.outputDir = path.join(__dirname, '../../results');
    this._ensureDir();
  }

  /**
   * Ensure output directory exists.
   * @private
   */
  _ensureDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Format result as JSON.
   * @param {object} result - Optimization result.
   * @returns {string} JSON string.
   */
  format(result) {
    const output = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      summary: {
        improvement: result.improvement,
        strategy: result.strategy,
        iterations: result.iterations,
        durationMs: result.durationMs,
      },
      baseline: {
        tokens: result.baseline.metrics.totalTokens,
        latencyMs: result.baseline.metrics.latencyMs,
        costUsd: result.baseline.metrics.costUsd,
      },
      optimized: {
        tokens: result.optimized.metrics.totalTokens,
        avgLatency: result.optimized.metrics.avgLatency,
        totalCost: result.optimized.metrics.totalCost,
      },
      bottlenecks: result.bottlenecks,
      recommendations: result.recommendations,
    };

    return JSON.stringify(output, null, 2);
  }

  /**
   * Write result to a JSON file.
   * @param {object} result - Optimization result.
   * @returns {string} Path to the written file.
   */
  write(result) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(this.outputDir, `report-${ts}.json`);
    fs.writeFileSync(filePath, this.format(result), 'utf-8');
    return filePath;
  }
}

module.exports = JsonReporter;
