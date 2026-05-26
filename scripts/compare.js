#!/usr/bin/env node

/**
 * scripts/compare.js — Compare two configurations
 * Usage: node scripts/compare.js [config-a] [config-b]
 */

const { Optimizer } = require('../src/core/optimizer');
const ComparisonEngine = require('../scoring/comparison');
const ConsoleReporter = require('../src/reporters/console');

const args = process.argv.slice(2);
const configA = args[0] || './configs/balanced.json';
const configB = args[1] || './configs/aggressive.json';

async function main() {
  const reporter = new ConsoleReporter();
  reporter.header('Configuration Comparison');

  console.log(`Config A: ${configA}`);
  console.log(`Config B: ${configB}\n`);

  // Run both configurations
  const optimizerA = new Optimizer({ configPath: configA, iterations: 3 });
  const optimizerB = new Optimizer({ configPath: configB, iterations: 3 });

  const [resultA, resultB] = await Promise.all([optimizerA.run(), optimizerB.run()]);

  // Compare results
  const comparator = new ComparisonEngine();
  const comparison = comparator.compare(
    {
      tokens: resultA.optimized.metrics.totalTokens,
      latency: resultA.optimized.metrics.avgLatency,
      cost: resultA.optimized.metrics.totalCost,
    },
    {
      tokens: resultB.optimized.metrics.totalTokens,
      latency: resultB.optimized.metrics.avgLatency,
      cost: resultB.optimized.metrics.totalCost,
    }
  );

  console.log('─── Token Comparison ───');
  console.log(`  A: ${comparison.tokens.baseline.toLocaleString()} tokens`);
  console.log(`  B: ${comparison.tokens.optimized.toLocaleString()} tokens`);
  console.log(`  Delta: ${comparison.tokens.improvement} (${comparison.tokens.significant ? 'significant' : 'not significant'})`);

  console.log('\n─── Latency Comparison ───');
  console.log(`  A: ${comparison.latency.baseline}ms`);
  console.log(`  B: ${comparison.latency.optimized}ms`);
  console.log(`  Delta: ${comparison.latency.improvement} (${comparison.latency.significant ? 'significant' : 'not significant'})`);

  console.log('\n─── Cost Comparison ───');
  console.log(`  A: $${comparison.cost.baseline.toFixed(4)}`);
  console.log(`  B: $${comparison.cost.optimized.toFixed(4)}`);
  console.log(`  Delta: ${comparison.cost.improvement}`);

  console.log(`\nOverall: ${comparison.overall.improved ? '✅ B improves on A' : '⚠️  B does not clearly improve on A'}`);
  if (comparison.overall.regressions.length > 0) {
    console.log(`Regressions in: ${comparison.overall.regressions.join(', ')}`);
  }
}

main().catch((err) => {
  console.error('❌ Comparison failed:', err.message);
  process.exit(1);
});
