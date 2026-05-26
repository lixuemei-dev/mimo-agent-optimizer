/**
 * Unit tests for optimization strategies.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const TokenBudgetStrategy = require('../../src/strategies/token-budget');
const LatencyStrategy = require('../../src/strategies/latency');
const CostStrategy = require('../../src/strategies/cost');

describe('TokenBudgetStrategy', () => {
  it('should have correct name', () => {
    const strategy = new TokenBudgetStrategy();
    assert.equal(strategy.name, 'token-budget');
  });

  it('should compress long system prompts', () => {
    const strategy = new TokenBudgetStrategy();
    const config = { systemPrompt: 'A'.repeat(1000), maxContextTokens: 100000 };
    const result = strategy.apply(config);
    assert.ok(result.systemPrompt.length < 1000);
  });

  it('should reduce context window', () => {
    const strategy = new TokenBudgetStrategy();
    const config = { maxContextTokens: 100000 };
    const result = strategy.apply(config);
    assert.ok(result.maxContextTokens < 100000);
  });

  it('should enable deduplication', () => {
    const strategy = new TokenBudgetStrategy();
    const result = strategy.apply({});
    assert.equal(result.deduplicateToolResults, true);
  });

  it('should mark applied strategy', () => {
    const strategy = new TokenBudgetStrategy();
    const result = strategy.apply({});
    assert.equal(result._appliedStrategy, 'token-budget');
  });
});

describe('LatencyStrategy', () => {
  it('should enable streaming', () => {
    const strategy = new LatencyStrategy();
    const result = strategy.apply({});
    assert.equal(result.streaming, true);
  });

  it('should enable parallel tool calls', () => {
    const strategy = new LatencyStrategy();
    const result = strategy.apply({});
    assert.equal(result.parallelToolCalls, true);
  });

  it('should reduce maxTokens to 4096', () => {
    const strategy = new LatencyStrategy();
    const config = { maxTokens: 8192 };
    const result = strategy.apply(config);
    assert.equal(result.maxTokens, 4096);
  });

  it('should set timeout', () => {
    const strategy = new LatencyStrategy();
    const result = strategy.apply({});
    assert.equal(result.timeoutMs, 5000);
  });
});

describe('CostStrategy', () => {
  it('should enable caching', () => {
    const strategy = new CostStrategy();
    const result = strategy.apply({});
    assert.equal(result.cacheEnabled, true);
  });

  it('should set budget cap', () => {
    const strategy = new CostStrategy();
    const result = strategy.apply({});
    assert.ok(result.maxCostPerSessionUsd > 0);
  });

  it('should limit tool call depth', () => {
    const strategy = new CostStrategy();
    const result = strategy.apply({});
    assert.equal(result.maxToolCallDepth, 5);
  });

  it('should downgrade model from gpt-4o', () => {
    const strategy = new CostStrategy();
    const config = { model: 'gpt-4o' };
    const result = strategy.apply(config);
    assert.equal(result.model, 'gpt-4o-mini');
  });

  it('should mark applied strategy', () => {
    const strategy = new CostStrategy();
    const result = strategy.apply({});
    assert.equal(result._appliedStrategy, 'cost');
  });
});
