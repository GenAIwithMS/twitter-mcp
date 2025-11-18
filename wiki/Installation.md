# Installation

Prerequisites
- Node.js 18 or higher
- npm or npx
- Twitter Developer account with API credentials
- Claude Desktop App

Quick start

Add this to your `claude_desktop_config.json` to run the MCP server with npx:

```json
{
  "mcpServers": {
    "twitter": {
      "command": "npx",
      "args": ["-y", "@muhammadsiddiq/twitter-mcp"],
      "env": {
        "API_KEY": "your_api_key",
        "API_SECRET_KEY": "your_api_secret_key",
        "ACCESS_TOKEN": "your_access_token",
        "ACCESS_TOKEN_SECRET": "your_access_token_secret"
      }
    }
  }
}
```

Restart Claude Desktop after editing the configuration.