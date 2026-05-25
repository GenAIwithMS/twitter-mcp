# Configuration

1. Get Twitter API credentials from the Twitter Developer Portal (API Key, API Secret Key, Access Token, Access Token Secret).

2. Configure Claude Desktop's MCP settings (see `Installation.md`).

3. Optional read-only search backend:
   - Set `XQUIK_API_KEY` or `HERMES_TWEET_API_KEY` to route `search_tweets` through Hermes Tweet/Xquik.
   - Set `XQUIK_BASE_URL` only when using a non-default Xquik deployment.
   - Posting tools still require Twitter OAuth credentials.

4. Get an Xquik / Hermes Tweet token:
   - Sign in at [dashboard.xquik.com](https://dashboard.xquik.com/).
   - Open [Account > API Keys](https://dashboard.xquik.com/en/account?tab=api-keys).
   - Create an API key for this MCP server and copy it once.
   - Store it as `XQUIK_API_KEY` in the Claude Desktop MCP config or shell environment.
   - If your deployment uses the Hermes Tweet naming, store the same value as `HERMES_TWEET_API_KEY`.
   - Leave `XQUIK_BASE_URL` unset unless your team runs a compatible non-default deployment.
   - Restart Claude Desktop and call `search_tweets` to confirm read-only search.

Keep the key out of Git, chat prompts, screenshots, and shared config files.

5. Filesystem access options:
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
