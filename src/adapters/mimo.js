/**
 * MiMo Adapter
 * Interface for Xiaomi MiMo-v2 LLM API.
 */

class MiMoAdapter {
  constructor(opts = {}) {
    this.name = 'mimo';
    this.baseUrl = opts.baseUrl || process.env.MIMO_BASE_URL || 'https://api.mimo.xiaomi.com';
    this.apiKey = opts.apiKey || process.env.MIMO_API_KEY || '';
    this.model = opts.model || 'mimo-v2';
    this.streaming = opts.streaming !== false;
  }

  /**
   * Normalize a configuration for MiMo API format.
   * @param {object} config - Internal config format.
   * @returns {object} MiMo-compatible request body.
   */
  normalizeConfig(config) {
    return {
      model: config.model || this.model,
      messages: config.messages || [],
      max_tokens: config.maxTokens || 4096,
      temperature: config.temperature || 0.7,
      stream: this.streaming,
      tools: config.tools || [],
    };
  }

  /**
   * Calculate cost for a given token count.
   * @param {number} inputTokens  - Number of input tokens.
   * @param {number} outputTokens - Number of output tokens.
   * @returns {number} Estimated cost in USD.
   */
  calculateCost(inputTokens, outputTokens) {
    const inputRate = 0.000001;   // $1 per 1M input tokens
    const outputRate = 0.000002;  // $2 per 1M output tokens
    return inputTokens * inputRate + outputTokens * outputRate;
  }

  /**
   * Get model-specific token limits.
   * @returns {object} Token limit configuration.
   */
  getTokenLimits() {
    return {
      maxContext: 128000,
      maxOutput: 8192,
      systemReserved: 4096,
    };
  }
}

module.exports = MiMoAdapter;
