/**
 * MiMo Agent Auto-Optimizer
 * Core module entry point
 */

const { Optimizer } = require('./core/optimizer');
const { Profiler } = require('./core/profiler');
const { Benchmark } = require('./core/benchmark');
const { Reporter } = require('./core/reporter');

const TokenBudgetStrategy = require('./strategies/token-budget');
const LatencyStrategy = require('./strategies/latency');
const CostStrategy = require('./strategies/cost');

const MiMoAdapter = require('./adapters/mimo');
const OpenAIAdapter = require('./adapters/openai');
const AnthropicAdapter = require('./adapters/anthropic');

const BottleneckAnalyzer = require('./analyzers/bottleneck');
const RecommendationEngine = require('./analyzers/recommendation');

const ConsoleReporter = require('./reporters/console');
const JsonReporter = require('./reporters/json');
const HtmlReporter = require('./reporters/html');

module.exports = {
  Optimizer,
  Profiler,
  Benchmark,
  Reporter,
  strategies: {
    TokenBudgetStrategy,
    LatencyStrategy,
    CostStrategy,
  },
  adapters: {
    MiMoAdapter,
    OpenAIAdapter,
    AnthropicAdapter,
  },
  analyzers: {
    BottleneckAnalyzer,
    RecommendationEngine,
  },
  reporters: {
    ConsoleReporter,
    JsonReporter,
    HtmlReporter,
  },
};
