/**
 * ConsoleReporter
 * Formats and outputs optimization results to the terminal.
 */

class ConsoleReporter {
  constructor() {
    this.colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      cyan: '\x1b[36m',
      bold: '\x1b[1m',
    };
  }

  /**
   * Print a section header.
   * @param {string} title - Header text.
   */
  header(title) {
    const line = '═'.repeat(50);
    console.log(`\n${this.colors.bold}${line}${this.colors.reset}`);
    console.log(`${this.colors.cyan}  ${title}${this.colors.reset}`);
    console.log(`${this.colors.bold}${line}${this.colors.reset}\n`);
  }

  /**
   * Print a formatted optimization result.
   * @param {object} result - Optimization result.
   */
  printResult(result) {
    const { baseline, optimized, improvement, bottlenecks, recommendations } = result;

    this.header('Optimization Results');

    console.log(`${this.colors.green}✓ Improvement: ${improvement}${this.colors.reset}\n`);

    console.log(`${this.colors.bold}Baseline Metrics:${this.colors.reset}`);
    console.log(`  Tokens:    ${baseline.metrics.totalTokens.toLocaleString()}`);
    console.log(`  Latency:   ${baseline.metrics.latencyMs}ms`);
    console.log(`  Cost:      $${baseline.metrics.costUsd.toFixed(4)}\n`);

    console.log(`${this.colors.bold}Optimized Metrics:${this.colors.reset}`);
    console.log(`  Tokens:    ${optimized.metrics.totalTokens.toLocaleString()}`);
    console.log(`  Latency:   ${optimized.metrics.avgLatency}ms`);
    console.log(`  Cost:      $${optimized.metrics.totalCost.toFixed(4)}\n`);

    if (bottlenecks.length > 0) {
      console.log(`${this.colors.yellow}Bottlenecks Found:${this.colors.reset}`);
      for (const b of bottlenecks) {
        console.log(`  ⚠ [${b.severity}] ${b.message}`);
      }
      console.log('');
    }

    if (recommendations.length > 0) {
      console.log(`${this.colors.cyan}Recommendations:${this.colors.reset}`);
      for (const r of recommendations) {
        console.log(`  → ${r.description} (${r.impact} impact)`);
      }
    }
  }

  /**
   * Print a progress message.
   * @param {string} message - Progress text.
   */
  progress(message) {
    console.log(`${this.colors.cyan}⏳ ${message}${this.colors.reset}`);
  }
}

module.exports = ConsoleReporter;
