#!/usr/bin/env node

/**
 * scripts/run.js — Main optimization runner
 * Usage: node scripts/run.js [config] [strategy] [iterations]
 */

const path = require('path');
const { Optimizer } = require('../src/core/optimizer');
const ConsoleReporter = require('../src/reporters/console');
const JsonReporter = require('../src/reporters/json');
const HtmlReporter = require('../src/reporters/html');

const args = process.argv.slice(2);
const configPath = args[0] || './configs/balanced.json';
const strategy = args[1] || 'token-budget';
const iterations = parseInt(args[2], 10) || 3;

async function main() {
  const consoleReporter = new ConsoleReporter();
  const jsonReporter = new JsonReporter();
  const htmlReporter = new HtmlReporter();

  consoleReporter.header('MiMo Agent Auto-Optimizer');
  consoleReporter.progress(`Config: ${configPath}`);
  consoleReporter.progress(`Strategy: ${strategy}`);
  consoleReporter.progress(`Iterations: ${iterations}`);
  console.log('');

  const optimizer = new Optimizer({ configPath, strategy, iterations });
  const result = await optimizer.run();

  consoleReporter.printResult(result);

  const jsonPath = jsonReporter.write(result);
  const htmlPath = htmlReporter.write(result);

  console.log(`\n📊 JSON report: ${jsonPath}`);
  console.log(`🌐 HTML report: ${htmlPath}`);
  console.log(`\n✅ Optimization complete in ${result.durationMs}ms`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
