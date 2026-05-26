#!/usr/bin/env node

/**
 * MiMo Agent Auto-Optimizer CLI
 * Simple command-line entry point for running optimizations.
 */

const { Optimizer } = require('./core/optimizer');
const { ConsoleReporter } = require('./reporters/console');

const args = process.argv.slice(2);
const command = args[0] || 'optimize';
const configPath = args[1] || './configs/balanced.json';

async function main() {
  const reporter = new ConsoleReporter();

  switch (command) {
    case 'optimize': {
      reporter.header('MiMo Agent Auto-Optimizer');
      const optimizer = new Optimizer({ configPath });
      const result = await optimizer.run();
      reporter.printResult(result);
      break;
    }
    case 'validate': {
      reporter.header('Validation Mode');
      console.log('Running validation suite...');
      break;
    }
    case 'compare': {
      reporter.header('Comparison Mode');
      console.log('Comparing baseline vs optimized...');
      break;
    }
    default:
      console.error(`Unknown command: ${command}`);
      console.log('Usage: mimo-optimize [optimize|validate|compare] [config]');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
