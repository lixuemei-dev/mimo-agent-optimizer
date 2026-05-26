/**
 * Token Budget Strategy
 * Reduces token consumption by trimming context, compressing prompts, and deduplication.
 */

class TokenBudgetStrategy {
  constructor() {
    this.name = 'token-budget';
    this.defaultReduction = 0.35; // Target 35% reduction
  }

  /**
   * Apply token budget optimizations to a configuration.
   * @param {object} config - Current agent configuration.
   * @param {Array} recommendations - Analyzer recommendations.
   * @returns {object} Optimized configuration.
   */
  apply(config, recommendations = []) {
    const optimized = { ...config };

    // 1. Trim system prompt
    if (optimized.systemPrompt && optimized.systemPrompt.length > 500) {
      optimized.systemPrompt = this._compressPrompt(optimized.systemPrompt);
      optimized._tokenSavings = (optimized._tokenSavings || 0) + 150;
    }

    // 2. Reduce context window
    if (optimized.maxContextTokens > 50000) {
      const reduction = this._getContextReduction(recommendations);
      optimized.maxContextTokens = Math.floor(optimized.maxContextTokens * (1 - reduction));
      optimized._tokenSavings = (optimized._tokenSavings || 0) + Math.floor(50000 * reduction);
    }

    // 3. Enable result deduplication
    optimized.deduplicateToolResults = true;

    // 4. Truncate long tool outputs
    optimized.maxToolOutputTokens = optimized.maxToolOutputTokens || 2000;

    optimized._appliedStrategy = this.name;
    optimized._timestamp = new Date().toISOString();

    return optimized;
  }

  /**
   * Compress a system prompt by removing redundant instructions.
   * @private
   */
  _compressPrompt(prompt) {
    // Placeholder: real implementation would use NLP-based compression
    return prompt.substring(0, Math.floor(prompt.length * 0.6));
  }

  /**
   * Determine context reduction factor from recommendations.
   * @private
   */
  _getContextReduction(recommendations) {
    const tokenRecs = recommendations.filter((r) => r.type === 'token-waste');
    return Math.min(0.5, this.defaultReduction + tokenRecs.length * 0.05);
  }
}

module.exports = TokenBudgetStrategy;
