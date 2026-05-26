/**
 * Anthropic Adapter
 * Interface for Claude Sonnet 4.6 / Opus 4.7 API.
 */

class AnthropicAdapter {
  constructor(opts = {}) {
    this.name = 'anthropic';
    this.baseUrl = opts.baseUrl || 'https://api.anthropic.com/v1';
    this.apiKey = opts.apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.model = opts.model || 'claude-sonnet-4.6';
    this.streaming = opts.streaming !== false;
  }

  /**
   * Normalize a configuration for Anthropic API format.
   * @param {object} config - Internal config format.
   * @returns {object} Anthropic-compatible request body.
   */
  normalizeConfig(config) {
    return {
      model: config.model || this.model,
      max_tokens: config.maxTokens || 4096,
      system: config.systemPrompt || '',
      messages: config.messages || [],
      stream: this.streaming,
      tools: (config.tools || []).map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.parameters,
      })),
    };
  }

  /**
   * Calculate cost for a given token count.
   * @param {number} inputTokens  - Number of input tokens.
   * @param {number} outputTokens - Number of output tokens.
   * @returns {number} Estimated cost in USD.
   */
  calculateCost(inputTokens, outputTokens) {
    const inputRate = 0.000003;   // $3 per 1M input tokens (Sonnet 4.6)
    const outputRate = 0.000015;  // $15 per 1M output tokens (Sonnet 4.6)
    return inputTokens * inputRate + outputTokens * outputRate;
  }

  /**
   * Get model-specific token limits.
   * @returns {object} Token limit configuration.
   */
  getTokenLimits() {
    return {
      maxContext: 200000,
      maxOutput: 8192,
      systemReserved: 4096,
    };
  }
}

module.exports = AnthropicAdapter;
