# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email: security@mimo-optimizer.dev (or create a private advisory)
3. Include: description, steps to reproduce, potential impact

## Response Timeline

- **Acknowledgment**: within 48 hours
- **Initial assessment**: within 1 week
- **Fix release**: depends on severity

## Scope

This policy covers:
- The mimo-agent-optimizer codebase
- API key handling and environment variables
- Result file integrity

## Best Practices

- Never commit `.env` files
- Use environment variables for secrets
- Validate all user inputs
- Run `npm audit` regularly
