/**
 * OpenAI Adapter
 * Interface for OpenAI GPT-4o / GPT-4o-mini API.
 */

class OpenAIAdapter {
  constructor(opts = {}) {
    this.name = 'openai';
    this.baseUrl = opts.baseUrl || 'https://api.openai.com/v1';
    this.apiKey = opts.apiKey || process.env.OPENAI_API_KEY || '';
    this.model = opts.model || 'gpt-4o';
    this.streaming = opts.streaming !== false;
  }

  /**
   * Normalize a configuration for OpenAI API format.
   * @param {object} config - Internal config format.
   * @returns {object} OpenAI-compatible request body.
   */
  normalizeConfig(config) {
    return {
      model: config.model || this.model,
      messages: config.messages || [],
      max_tokens: config.maxTokens || 4096,
      temperature: config.temperature || 0.7,
      stream: this.streaming,
      tools: config.tools || [],
      response_format: config.responseFormat || { type: 'text' },
    };
  }

  /**
   * Calculate cost for a given token count.
   * @param {number} inputTokens  - Number of input tokens.
   * @param {number} outputTokens - Number of output tokens.
   * @returns {number} Estimated cost in USD.
   */
  calculateCost(inputTokens, outputTokens) {
    const inputRate = 0.000005;   // $5 per 1M input tokens (GPT-4o)
    const outputRate = 0.000015;  // $15 per 1M output tokens (GPT-4o)
    return inputTokens * inputRate + outputTokens * outputRate;
  }

  /**
   * Get model-specific token limits.
   * @returns {object} Token limit configuration.
   */
  getTokenLimits() {
    return {
      maxContext: 128000,
      maxOutput: 16384,
      systemReserved: 4096,
    };
  }
}

module.exports = OpenAIAdapter;
