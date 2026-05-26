/**
 * Integration tests for the full optimization pipeline.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { Optimizer } = require('../../src/core/optimizer');
const BottleneckAnalyzer = require('../../src/analyzers/bottleneck');
const RecommendationEngine = require('../../src/analyzers/recommendation');
const JsonReporter = require('../../src/reporters/json');
const HtmlReporter = require('../../src/reporters/html');

describe('Optimization Pipeline (Integration)', () => {
  it('should complete full pipeline with aggressive config', async () => {
    const optimizer = new Optimizer({
      configPath: './configs/aggressive.json',
      iterations: 1,
    });
    const result = await optimizer.run();
    assert.ok(result.baseline);
    assert.ok(result.optimized);
    assert.ok(result.bottlenecks);
    assert.ok(result.recommendations);
    assert.ok(result.improvement);
  });

  it('should complete full pipeline with balanced config', async () => {
    const optimizer = new Optimizer({
      configPath: './configs/balanced.json',
      iterations: 2,
    });
    const result = await optimizer.run();
    assert.equal(result.iterations, 2);
    assert.ok(typeof result.durationMs === 'number');
  });

  it('should detect bottlenecks from profile', () => {
    const analyzer = new BottleneckAnalyzer();
    const profile = {
      metrics: { totalTokens: 100000, latencyMs: 5000, costUsd: 1.0, toolCalls: 15 },
      results: [{ name: 'test', tokens: 60000 }],
    };
    const bottlenecks = analyzer.analyze(profile);
    assert.ok(bottlenecks.length >= 3);
    assert.ok(bottlenecks.some((b) => b.type === 'token-waste'));
    assert.ok(bottlenecks.some((b) => b.type === 'latency'));
    assert.ok(bottlenecks.some((b) => b.type === 'cost'));
  });

  it('should generate prioritized recommendations', () => {
    const engine = new RecommendationEngine();
    const bottlenecks = [
      { type: 'token-waste', severity: 'high' },
      { type: 'latency', severity: 'medium' },
    ];
    const recs = engine.generate(bottlenecks);
    assert.ok(recs.length > 0);
    assert.ok(recs[0].impact === 'high');
  });
});

describe('Reporters (Integration)', () => {
  const sampleResult = {
    improvement: '35.2%',
    strategy: 'token-budget',
    iterations: 3,
    durationMs: 1500,
    baseline: { metrics: { totalTokens: 120000, latencyMs: 4000, costUsd: 0.6 } },
    optimized: { metrics: { totalTokens: 78000, avgLatency: 2500, totalCost: 0.39 } },
    bottlenecks: [{ type: 'token-waste', severity: 'high', message: 'High token usage' }],
    recommendations: [{ action: 'compress-system-prompt', description: 'Compress prompt', impact: 'high', effort: 'low', source: 'token-waste', severity: 'high' }],
  };

  it('JsonReporter should produce valid JSON', () => {
    const reporter = new JsonReporter();
    const json = reporter.format(sampleResult);
    const parsed = JSON.parse(json);
    assert.equal(parsed.version, '1.0.0');
    assert.ok(parsed.summary);
  });

  it('HtmlReporter should produce valid HTML', () => {
    const reporter = new HtmlReporter();
    const html = reporter.format(sampleResult);
    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('35.2%'));
    assert.ok(html.includes('token-waste'));
  });
});
