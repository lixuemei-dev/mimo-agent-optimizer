/**
 * Profiler — Performance measurement engine
 * Runs reference workloads against configurations and collects metrics.
 */

const fs = require('fs');
const path = require('path');

class Profiler {
  constructor() {
    this.metrics = {
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      costUsd: 0,
      toolCalls: 0,
    };
  }

  /**
   * Profile a configuration by running reference workloads.
   * @param {string} configPath - Path to the config file.
   * @returns {Promise<object>} Collected metrics and the config.
   */
  async profile(configPath) {
    const config = this._loadConfig(configPath);
    const workloads = this._loadWorkloads();

    const results = [];
    for (const workload of workloads) {
      const result = await this._runWorkload(config, workload);
      results.push(result);
    }

    const aggregated = this._aggregate(results);

    return {
      config,
      results,
      metrics: aggregated,
      score: this._calculateScore(aggregated),
    };
  }

  /**
   * Load a configuration file.
   * @private
   */
  _loadConfig(configPath) {
    try {
      const fullPath = path.resolve(configPath);
      return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    } catch {
      return { profile: 'balanced', maxTokens: 100000, temperature: 0.7 };
    }
  }

  /**
   * Load available workload definitions.
   * @private
   */
  _loadWorkloads() {
    const workloadDir = path.join(__dirname, '../../workloads');
    const workloads = [];

    for (const subdir of ['stress', 'realistic', 'reference']) {
      const dir = path.join(workloadDir, subdir);
      if (!fs.existsSync(dir)) continue;
      for (const file of fs.readdirSync(dir)) {
        if (file.endsWith('.json')) {
          workloads.push(JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')));
        }
      }
    }

    return workloads;
  }

  /**
   * Simulate running a single workload (placeholder for real API calls).
   * @private
   */
  async _runWorkload(config, workload) {
    const simulatedTokens = Math.floor(Math.random() * 50000) + 10000;
    const simulatedLatency = Math.floor(Math.random() * 5000) + 1000;

    return {
      name: workload.name || 'unnamed',
      tokens: simulatedTokens,
      latencyMs: simulatedLatency,
      costUsd: simulatedTokens * 0.000002,
      toolCalls: workload.tools ? workload.tools.length : 0,
    };
  }

  /**
   * Aggregate results from multiple workloads.
   * @private
   */
  _aggregate(results) {
    return results.reduce(
      (acc, r) => ({
        totalTokens: acc.totalTokens + r.tokens,
        latencyMs: acc.latencyMs + r.latencyMs,
        costUsd: acc.costUsd + r.costUsd,
        toolCalls: acc.toolCalls + r.toolCalls,
      }),
      { totalTokens: 0, latencyMs: 0, costUsd: 0, toolCalls: 0 }
    );
  }

  /**
   * Calculate a composite score (lower is better).
   * @private
   */
  _calculateScore(metrics) {
    return (
      metrics.totalTokens * 0.4 +
      metrics.latencyMs * 0.3 +
      metrics.costUsd * 10000 * 0.3
    );
  }
}

module.exports = { Profiler };
