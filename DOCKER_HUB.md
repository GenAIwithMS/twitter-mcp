# Twitter MCP — Docker Image

**`genaiwithms/twitter-mcp`** | [Full README on GitHub](https://github.com/genaiwithms/twitter-mcp)

A [Model Context Protocol](https://modelcontextprotocol.io) server that lets AI
assistants (Claude, Cursor, OpenCode, and other MCP-compatible clients) read and
write to **X / Twitter** using natural language — post tweets, search, monitor
mentions, and engage with content.

This image runs the MCP **stdio** server. Credentials are never baked in; you
pass them as environment variables at run time.

## What the image does

- Runs the Twitter MCP server as a stdio process, ready to be wired into any
  MCP client via `docker run -i`.
- Post text-only tweets and tweets with images (JPG, PNG, GIF, WEBP).
- Search tweets (with optional Xquik / GetXAPI backends), fetch user profiles,
  thread history, recent mentions, and extract media URLs.
- Publish smart threads (auto-split long content), quote tweets, and like /
  retweet / bookmark.
- Runs as a non-root user (`node`) and needs no volume mounts — the server
  only reads stdin/stdout.

## Features

| Feature | Description |
|---|---|
| 🐦 Post tweets | Publish status updates, replies, and threaded replies |
| 🖼️ Image support | Attach JPG, PNG, GIF, WEBP images |
| 🔍 Search tweets | Query by keyword, hashtag, date, or advanced filters |
| 👤 User profiles | Bio, metrics, pinned tweet, recent activity |
| 💬 Thread history | Full conversation context by tweet ID |
| 🔔 Mention monitoring | Recent mentions of the authenticated user or keywords |
| 🧵 Smart threads | Auto-split long content into a tweet chain |
| 💬 Quote tweets | Quote an existing tweet with AI commentary |
| 🎬 Media extraction | Direct media URLs (images, video, GIF) |
| ❤️ Engagement | Like, retweet, or bookmark |
| 🔐 OAuth 1.0a | Secure Twitter authentication |

## Pull

```bash
# Docker
docker pull genaiwithms/twitter-mcp:latest

# Podman
podman pull docker.io/genaiwithms/twitter-mcp:latest
```

## Usage

The server speaks MCP over **stdio** (stdin/stdout). Point your MCP client at
the container, or smoke-test it directly:

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}\n' \
  | docker run -i --rm genaiwithms/twitter-mcp:latest
```

A successful handshake returns the server name and version (`twitter-mcp`).

## Configuration

Provide your Twitter credentials at run time with `-e`. The image ships with
no default credentials.

```bash
docker run -i --rm \
  -e API_KEY="your_consumer_api_key" \
  -e API_SECRET_KEY="your_consumer_api_secret" \
  -e ACCESS_TOKEN="your_access_token" \
  -e ACCESS_TOKEN_SECRET="your_access_token_secret" \
  genaiwithms/twitter-mcp:latest
```

> **`post_tweet_with_image`** reads a local file path. If you use that tool from
> the container, mount the file with `-v /abs/path/to/image.jpg:/abs/path/to/image.jpg`
> and pass the same path to the tool.

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `API_KEY` | Twitter consumer API key | Yes (posting / Twitter search) |
| `API_SECRET_KEY` | Twitter consumer API secret | Yes (posting / Twitter search) |
| `ACCESS_TOKEN` | Twitter access token | Yes (posting / Twitter search) |
| `ACCESS_TOKEN_SECRET` | Twitter access token secret | Yes (posting / Twitter search) |
| `XQUIK_API_KEY` | Optional Xquik key for `search_tweets` | No |
| `XQUIK_BASE_URL` | Xquik base URL, defaults to `https://xquik.com` | No |
| `GETXAPI_API_KEY` | Optional GetXAPI key for `search_tweets` | No |
| `GETXAPI_BASE_URL` | GetXAPI base URL, defaults to `https://api.getxapi.com` | No |

## MCP Setup

Register the container as a stdio MCP server in your client. Example for Claude
Desktop App (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "twitter-mcp": {
      "command": "docker",
      "args": ["run", "-i", "--rm",
        "-e", "API_KEY=your_consumer_api_key",
        "-e", "API_SECRET_KEY=your_consumer_api_secret",
        "-e", "ACCESS_TOKEN=your_access_token",
        "-e", "ACCESS_TOKEN_SECRET=your_access_token_secret",
        "genaiwithms/twitter-mcp:latest"
      ]
    }
  }
}
```

For Podman, replace `"docker"` with `"podman"`. Restart your client after saving.

## Links

- [Full README & documentation](https://github.com/genaiwithms/twitter-mcp)
- [Report an issue](https://github.com/genaiwithms/twitter-mcp/issues)
- [License: MIT](https://github.com/genaiwithms/twitter-mcp/blob/main/LICENSE)
