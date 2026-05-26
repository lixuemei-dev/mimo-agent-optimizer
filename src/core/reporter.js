/**
 * Reporter — Base reporter for formatting and outputting optimization results.
 */

const fs = require('fs');
const path = require('path');

class Reporter {
  constructor() {
    this.outputDir = path.join(__dirname, '../../results');
    this._ensureOutputDir();
  }

  /**
   * Ensure the results output directory exists.
   * @private
   */
  _ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate a timestamp-based filename.
   * @param {string} ext - File extension (e.g. 'json', 'html').
   * @returns {string} Full path to the output file.
   */
  outputPath(ext = 'json') {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    return path.join(this.outputDir, `report-${ts}.${ext}`);
  }

  /**
   * Format a result object for display (override in subclasses).
   * @param {object} result - Optimization result.
   * @returns {string} Formatted string.
   */
  format(result) {
    return JSON.stringify(result, null, 2);
  }

  /**
   * Write a result to a file.
   * @param {object} result - Optimization result.
   * @param {string} ext - File extension.
   * @returns {string} Path to the written file.
   */
  write(result, ext = 'json') {
    const filePath = this.outputPath(ext);
    fs.writeFileSync(filePath, this.format(result), 'utf-8');
    return filePath;
  }
}

module.exports = { Reporter };
