# Adapter: Slack → notify

- `post(channel, message)` via the Slack MCP/connector or an incoming webhook (URL from env).
- Never block the primary action: on failure, retry or log out of band.

**Binding** (`delivery.yml`): `{ adapter: slack, channel: "#channel" }`
