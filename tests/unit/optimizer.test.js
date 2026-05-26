/**
 * Unit tests for the Optimizer engine.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { Optimizer } = require('../../src/core/optimizer');

describe('Optimizer', () => {
  it('should instantiate with default options', () => {
    const optimizer = new Optimizer();
    assert.equal(optimizer.configPath, './configs/balanced.json');
    assert.equal(optimizer.strategyName, 'token-budget');
    assert.equal(optimizer.iterations, 3);
  });

  it('should accept custom options', () => {
    const optimizer = new Optimizer({
      configPath: './configs/aggressive.json',
      strategy: 'latency',
      iterations: 5,
    });
    assert.equal(optimizer.configPath, './configs/aggressive.json');
    assert.equal(optimizer.strategyName, 'latency');
    assert.equal(optimizer.iterations, 5);
  });

  it('should load correct strategy module', () => {
    const optimizer = new Optimizer({ strategy: 'cost' });
    const StrategyClass = optimizer._loadStrategy('cost');
    assert.equal(StrategyClass.name, 'CostStrategy');
  });

  it('should default to token-budget strategy', () => {
    const optimizer = new Optimizer({ strategy: 'unknown' });
    const StrategyClass = optimizer._loadStrategy('unknown');
    assert.equal(StrategyClass.name, 'TokenBudgetStrategy');
  });

  it('should run the full pipeline', async () => {
    const optimizer = new Optimizer({ iterations: 1 });
    const result = await optimizer.run();
    assert.ok(result.baseline);
    assert.ok(result.optimized);
    assert.ok(result.improvement);
    assert.equal(result.iterations, 1);
    assert.ok(result.durationMs >= 0);
  });
});
