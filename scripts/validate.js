#!/usr/bin/env node

/**
 * scripts/validate.js — Validation runner
 * Re-runs workloads against optimized config to verify improvements hold.
 */

const { Optimizer } = require('../src/core/optimizer');
const ConsoleReporter = require('../src/reporters/console');

const args = process.argv.slice(2);
const configPath = args[0] || './configs/balanced.json';

async function main() {
  const reporter = new ConsoleReporter();
  reporter.header('Validation Mode');

  const optimizer = new Optimizer({ configPath, iterations: 5 });
  const result = await optimizer.run();

  // Check that improvement is at least 10%
  const improvementPct = parseFloat(result.improvement);
  if (improvementPct >= 10) {
    console.log(`✅ PASS: Improvement of ${result.improvement} exceeds 10% threshold`);
  } else {
    console.log(`⚠️  WARN: Improvement of ${result.improvement} is below 10% threshold`);
  }

  // Check for regressions
  const regressions = result.optimized.p95 > result.baseline.metrics.latencyMs;
  if (regressions) {
    console.log('⚠️  WARN: P95 latency regression detected');
  } else {
    console.log('✅ PASS: No P95 latency regression');
  }

  console.log(`\nValidation complete. Score: ${result.optimized.score.toFixed(0)}`);
}

main().catch((err) => {
  console.error('❌ Validation failed:', err.message);
  process.exit(1);
});
