# Configuration

1. Get Twitter API credentials from the Twitter Developer Portal (API Key, API Secret Key, Access Token, Access Token Secret).

2. Configure Claude Desktop's MCP settings (see `Installation.md`).

3. Optional read-only search backend:
   - Set `XQUIK_API_KEY` or `HERMES_TWEET_API_KEY` to route `search_tweets` through Hermes Tweet/Xquik.
   - Set `XQUIK_BASE_URL` only when using a non-default Xquik deployment.
   - Posting tools still require Twitter OAuth credentials.

4. Filesystem access options:
- Built-in MCP: Claude Desktop often provides a built-in filesystem MCP. Grant folder access via the app UI.
- External filesystem MCP: Run a filesystem MCP if you need stricter control.

Example (external filesystem MCP):
```json
{
  "mcpServers": {
    "twitter": { /* twitter config */ },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontext/filesystem-server"],
      "env": {
        "ROOT_DIRS": "C:\\Users\\YourName\\Pictures;./images"
      }
    }
  }
}
```

Notes:
- When using a built-in MCP, ensure Claude Desktop has permission to read the folders containing images.
- The `twitter-mcp` server expects image paths that are accessible by whichever MCP serves the filesystem.
