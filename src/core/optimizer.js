/**
 * Optimizer — Main optimization engine
 * Orchestrates the full Profile → Analyze → Optimize → Validate → Report pipeline.
 */

const { Profiler } = require('./profiler');
const { Benchmark } = require('./benchmark');
const BottleneckAnalyzer = require('../analyzers/bottleneck');
const RecommendationEngine = require('../analyzers/recommendation');

class Optimizer {
  /**
   * @param {object} opts
   * @param {string} opts.configPath - Path to the configuration file to optimize.
   * @param {string} [opts.strategy]  - Strategy name: token-budget | latency | cost.
   * @param {number} [opts.iterations] - Number of optimization iterations.
   */
  constructor(opts = {}) {
    this.configPath = opts.configPath || './configs/balanced.json';
    this.strategyName = opts.strategy || 'token-budget';
    this.iterations = opts.iterations || 3;
    this.profiler = new Profiler();
    this.benchmark = new Benchmark();
    this.bottleneckAnalyzer = new BottleneckAnalyzer();
    this.recommendationEngine = new RecommendationEngine();
  }

  /**
   * Execute the full optimization pipeline.
   * @returns {Promise<object>} Optimization results with before/after metrics.
   */
  async run() {
    const startTime = Date.now();

    // Step 1: Profile — run baseline workloads
    const baseline = await this.profiler.profile(this.configPath);

    // Step 2: Analyze — find bottlenecks and waste
    const bottlenecks = this.bottleneckAnalyzer.analyze(baseline);
    const recommendations = this.recommendationEngine.generate(bottlenecks);

    // Step 3: Optimize — apply strategy iteratively
    let bestConfig = { ...baseline.config };
    let bestScore = baseline.score;

    for (let i = 0; i < this.iterations; i++) {
      const optimized = await this._applyStrategy(bestConfig, recommendations);
      const result = await this.benchmark.run(optimized);
      if (result.score < bestScore) {
        bestScore = result.score;
        bestConfig = optimized;
      }
    }

    // Step 4: Validate — final comparison
    const validation = await this.benchmark.run(bestConfig);

    return {
      baseline,
      optimized: validation,
      bottlenecks,
      recommendations,
      iterations: this.iterations,
      strategy: this.strategyName,
      durationMs: Date.now() - startTime,
      improvement: ((baseline.score - bestScore) / baseline.score * 100).toFixed(1) + '%',
    };
  }

  /**
   * Apply the selected optimization strategy.
   * @private
   */
  async _applyStrategy(config, recommendations) {
    const StrategyClass = this._loadStrategy(this.strategyName);
    const strategy = new StrategyClass();
    return strategy.apply(config, recommendations);
  }

  /**
   * Load strategy class by name.
   * @private
   */
  _loadStrategy(name) {
    const map = {
      'token-budget': require('../strategies/token-budget'),
      'latency': require('../strategies/latency'),
      'cost': require('../strategies/cost'),
    };
    return map[name] || map['token-budget'];
  }
}

module.exports = { Optimizer };
