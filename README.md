<div align="center">

# Twitter MCP Server

Connect AI assistants to X (Twitter) using the Model Context Protocol (MCP).

Post tweets • Upload images • Search tweets • Reply to conversations

[![npm version](https://img.shields.io/npm/v/@muhammadsiddiq/twitter-mcp.svg)](https://www.npmjs.com/package/@muhammadsiddiq/twitter-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/node/v/@muhammadsiddiq/twitter-mcp)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Stars](https://img.shields.io/github/stars/GenAIwithMS/twitter-mcp?style=social)](https://github.com/GenAIwithMS/twitter-mcp/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/GenAIwithMS/twitter-mcp?style=social)](https://github.com/GenAIwithMS/twitter-mcp/network/members)

[Quick Start](#quick-start) •
[Features](#features) •
[Documentation](#usage) •
[Contributing](./CONTRIBUTING.md)

</div>

---

A Model Context Protocol (MCP) server that enables seamless interaction with Twitter/X through AI assistants such as Claude Desktop.

## Features

- 🐦 **Post Tweets** - Share your thoughts with the world
- 🖼️ **Image Support** - Post tweets with images (JPG, PNG, GIF, WEBP)
- 🔍 **Search Tweets** - Find and analyze tweets by query
- 🔎 **Optional Xquik Search** - Use Hermes Tweet/Xquik for read-only search
- 💬 **Reply to Tweets** - Engage in conversations
- 🔐 **Secure Authentication** - OAuth 1.0a authentication
- ⚡ **Rate Limiting** - Built-in protection against API limits

## Why Twitter MCP?

Twitter MCP makes it easy for AI assistants to interact with X (Twitter) through natural language.

### Benefits

- 🚀 Zero installation using NPX
- 🤖 Works with Claude Desktop and MCP-compatible clients
- 🐦 Post tweets directly from AI conversations
- 🖼️ Upload images with tweets
- 🔍 Search Twitter using multiple backends
- 🔐 Secure OAuth authentication
- ⚡ Built-in rate limiting and validation
- 🛠️ Open-source and TypeScript powered

### Perfect For

- Content creators
- Social media managers
- AI agent developers
- Marketing teams
- Researchers and analysts
- MCP enthusiasts

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Posting Tweets](#posting-tweets)
  - [Posting with Images](#posting-with-images)
  - [Searching Tweets](#searching-tweets)
- [API Reference](#api-reference)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or npx
- Twitter Developer Account with API credentials
- Claude Desktop App

### Quick Start

The easiest way to use this MCP server is through the interactive installer:

```bash
npx @muhammadsiddiq/twitter-mcp
```

## Configuration

### Step 1: Run the installer

Start the setup flow with:

```bash
npx @muhammadsiddiq/twitter-mcp
```

The installer guides you through every question and writes the correct MCP config for the client you choose.

### Step 2: Choose your target client

The first prompt asks which AI assistant environment you want to integrate with. Available options are:

- Claude Desktop App
- Cursor IDE
- OpenCode IDE
- Hermes
- Kilo
- Custom Agent

If you choose a built-in client, the installer already knows the right config location and format. If you choose Custom Agent, it asks for the config file path and the config structure to use.

### Step 3: Answer the credential prompts

Next, the installer asks for the Twitter/X API credentials it needs to work:

- Consumer Key
- Consumer Secret Key
- Access Token
- Access Token Secret

These values are required for posting, replying, and Twitter API search.

#### How to get Twitter API credentials

1. Visit [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new App or use an existing one
3. Navigate to "Keys and Tokens"
4. Generate/Copy the following:
  - Consumer Key
  - Consumer Secret Key
  - Access Token
  - Access Token Secret

Provide these values when the installer prompts for them.

### Step 4: Optional search backend keys

The installer then asks whether you want to add optional read-only search backends for `search_tweets`.

If you say yes, it can collect:

- XQuik / Hermes Tweet API key
- GetXAPI API key

These are optional. If you skip them, the server still works with the Twitter OAuth credentials.

#### Getting an Xquik / Hermes Tweet token

1. Sign in at [dashboard.xquik.com](https://dashboard.xquik.com/).
2. Open [Account > API Keys](https://dashboard.xquik.com/en/account?tab=api-keys).
3. Create an API key for this MCP server and copy it once.
4. Store that value as `XQUIK_API_KEY` in your MCP config or shell environment.
5. If your deployment uses the Hermes Tweet naming, set the same value as `HERMES_TWEET_API_KEY` instead.
6. Leave `XQUIK_BASE_URL` unset unless your team runs a compatible non-default deployment.
7. Restart your client and call `search_tweets` to verify read-only search.

Keep the key out of Git, chat prompts, screenshots, and shared config files. The key only changes `search_tweets`; posting and replying still use the Twitter OAuth variables.

#### Getting a GetXAPI token

1. Sign in at [getxapi.com](https://getxapi.com/).
2. Create an API key for this MCP server and copy it once.
3. Store that value as `GETXAPI_API_KEY` in your MCP config or shell environment.
4. Leave `GETXAPI_BASE_URL` unset unless your team runs a compatible non-default deployment.
5. Restart your client and call `search_tweets` to verify read-only search.


### Step 5: Finish setup

After the questions are answered, the installer writes the config automatically and tells you to restart the selected client.



### Troubleshooting

**Can't find Connectors in Settings?**
- Make sure you're using the latest version of Claude Desktop
- Try restarting the application

**Path not working?**
- Use the full absolute path (complete path from root)
- Avoid spaces in folder names, or use quotes around the path
- Check that the directory actually exists on your computer

**Changes not taking effect?**
- Make sure you completely closed Claude Desktop (check system tray/menu bar)
- Wait a few seconds before reopening
- Restart your computer if issues persist


## Usage

Once configured, you can interact with Twitter through natural language commands to Claude.

### Posting Tweets

**Simple Tweet:**
```
Post a tweet: "Hello World! 🌍"
```
### Posting with Images

> **Important**: Make sure you have configured the filesystem MCP server as shown in Step 4.

**Tweet with Image:**
```
Post this image with caption: "Check out this amazing view!"
take image from desktop
```

**Working with Images**

Images must be accessible to the MCP server process that your client launches. Below are the common flows and what to expect:

- CLI flow (running the server directly):
  - You can pass an absolute or relative path to the image when using the CLI/server directly.
  - Example: `npx @muhammadsiddiq/twitter-mcp --stdio` then provide `/home/me/Pictures/photo.jpg` or `./images/photo.jpg` when prompted.
  - If the CLI is started from a different working directory, provide an absolute path or change to the correct folder first.

- Agent flow (Claude Desktop, Cherry Studio, etc.):
  - Most desktop agents use a filesystem MCP connector to grant the agent access to files. Claude Desktop includes this; some clients (e.g., Cherry Studio) require you to enable/configure the filesystem connector.
  - Configure the client's filesystem MCP (or connector) to include the folder(s) containing your images. After granting access, restart the client and then ask the agent to attach or use the image by filename or path.

- Permission notes:
  - The MCP server process (or the agent) must have read permission for the image file.
  - When using desktop agents, the client will typically prompt you to grant filesystem access; follow the client's permission flow rather than changing file permissions globally.

Supported path examples:

  - Windows: `C:\Users\YourName\Pictures\image.jpg`
  - macOS: `/Users/YourName/Pictures/image.jpg`
  - Linux: `/home/yourname/pictures/image.jpg`
  - Relative: `./images/photo.jpg` (relative to the server's working directory)

Supported formats and limits:

  - JPEG/JPG, PNG, GIF, WEBP
  - Max size: ~5MB for static images, ~15MB for animated GIFs (subject to client limits)

Best practices:

  - Use absolute paths if you are unsure of the current working directory.
  - Keep images in a dedicated folder and add that folder to your client's filesystem permissions.
  - Prefer small, optimized images for faster uploads and fewer failures.
  - If an agent cannot see a file, check the client's filesystem connector settings and restart the client after granting access.

If you're using an MCP client not listed here, check the client's documentation for how to grant or configure filesystem access (search for "filesystem connector", "desktop connectors", or "MCP filesystem").

### Searching Tweets

**Basic Search:**
```
Search for tweets about "artificial intelligence"
```

**Advanced Search:**
```
Search for 50 tweets about "climate change" from the past week
```

## API Reference

### Tools

The server provides three tools that can be accessed:

#### 1. `post_tweet`

Post a text-only tweet.

**Parameters:**
- `text` (string) — Tweet content
- `reply_to_tweet_id` (string, optional) — ID of a tweet to reply to

#### 2. `post_tweet_with_image`

Post a tweet with an attached image.

**Parameters:**
- `text` (string) — Tweet content
- `image_path` (string) — Local path to image (absolute or relative)
- `reply_to_tweet_id` (string, optional) — ID of a tweet to reply to

**Supported Image Formats:**
- JPEG/JPG
- PNG
- GIF (animated, max 15MB)
- WEBP

#### 3. `search_tweets`

Search for tweets matching a query.

Set `XQUIK_API_KEY` or `HERMES_TWEET_API_KEY` to route search through
Hermes Tweet/Xquik. Set `GETXAPI_API_KEY` to route search through GetXAPI.
Without those variables, search uses the configured Twitter API credentials.

**Types:**
```typescript
interface SearchTweetsRequest {
  query: string;           // Search query string
  count: number;          // Number of results (10-100)
}

interface SearchResponse {
  tweets: Tweet[];
  meta: {
    result_count: number;
    next_token?: string;
  };
}
```

**Example:**
```json
// Request:
{
  "query": "machine learning",
  "count": 25
}

// Response:
{
  "status": "success",
  "message": "Search completed successfully",
  "data": {
    "tweets": [
      {
        "id": "1234567891",
        "text": "Exploring machine learning concepts...",
        "author_id": "user123",
        "created_at": "2025-11-06T12:00:00.000Z"
      }
      // ... more tweets
    ],
    "meta": {
      "result_count": 25,
      "next_token": "abc123xyz"
    }
  }
}
```
## Development

### Local Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/genaiwithms/twitter-mcp.git
cd twitter-mcp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the project:**
```bash
npm run build
```

4. **Set up environment:**

Create a `.env` file in the project root:
```env
API_KEY=your_api_key
API_SECRET_KEY=your_api_secret
ACCESS_TOKEN=your_access_token
ACCESS_TOKEN_SECRET=your_access_token_secret
```

5. **Run locally:**

Update your Claude config to use local build:
```json
{
  "mcpServers": {
    "twitter": {
      "command": "node",
      "args": ["${absolute_path_to_project}/build/index.js"],
      "envFile": ".env"
    }
  }
}
```

6. **Development commands:**
```bash
# Start the server
npm start

# Run tests
npm test

# Build for production
npm run build

# Publish to npm (maintainers only)
npm publish --access public
```

### Project Structure

```
twitter-mcp/
├── src/
│   ├── index.ts           # Main server entry point
│   ├── twitter-api.ts     # Twitter API client
│   ├── types.ts           # TypeScript type definitions
│   ├── formatter.ts       # Response formatting
│   ├── types/            # Type declarations
│   │   └── modelcontextprotocol.d.ts
│   └── evals/
│       └── evals.ts       # Test utilities
├── .github/              # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml        # CI pipeline
├── build/               # Compiled JavaScript (generated)
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
├── .gitignore         # Git ignore rules
├── .env.example       # Example environment variables
├── CHANGELOG.md       # Version history
├── CONTRIBUTING.md    # Contribution guidelines
└── README.md         # Project documentation
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled server
- `npm run prepublishOnly` - Build before publishing

## Troubleshooting

### Common Issues

#### 1. Authentication Errors

**Problem:** "401 Unauthorized" or authentication failed

**Solutions:**
- Verify Twitter API credentials in Developer Portal
- Ensure all four tokens are correct and complete
- Check app permissions (needs Read + Write)
- Try regenerating access tokens
- Verify `.env` file format if using local development

#### 2. Rate Limits

**Problem:** "Rate limit exceeded" or requests failing

**Solutions:**
- Built-in rate limiting protects against overuse
- Wait 15 minutes for limits to reset
- Check your [Twitter API tier limits](https://developer.twitter.com/en/docs/twitter-api/rate-limits)
- Use exponential backoff for retries
- Monitor usage in Twitter Developer Portal

#### 3. Image Upload Issues

**Problem:** Image upload fails or missing media

**Solutions:**
- Verify file exists and is readable
- Check size limits: 5MB (images), 15MB (GIFs)
- Ensure format is supported (JPG, PNG, GIF, WEBP)
- Use absolute file paths
- Check file permissions
- Verify image is not corrupted

#### 3. "Image Upload Failed"

**Problem:** Image file cannot be uploaded.

**Solutions:**
- Verify the file path is correct and absolute
- Check file exists and is readable
- Ensure file size is under limits (5MB for images, 15MB for GIFs)
- Verify file format is supported (JPG, PNG, GIF, WEBP)
- Check file permissions

#### 4. "Module Not Found" Error

**Problem:** Dependencies not installed or build not completed.

**Solution:**
```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Rebuild
npm run build
```

#### 5. Server Not Responding in Claude

**Problem:** MCP server not connecting to Claude.

**Solutions:**
- Restart Claude Desktop completely
- Check config file syntax is valid JSON
- Verify file path in config matches actual location
- Check Node.js is installed: `node --version`
- Look for errors in Claude's logs

### Debug Mode

To see detailed logs, check:

**Windows:**
```
%APPDATA%\Claude\logs\
```

**macOS:**
```
~/Library/Logs/Claude/
```

**Linux:**
```
~/.config/Claude/logs/
```

## Environment Variables

Posting tools require Twitter OAuth credentials. `search_tweets` can use
Twitter OAuth credentials, the optional Hermes Tweet/Xquik read-only backend,
or the optional GetXAPI read-only backend.

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | Twitter API Key | For posting and Twitter API search |
| `API_SECRET_KEY` | Twitter API Secret Key | For posting and Twitter API search |
| `ACCESS_TOKEN` | Twitter Access Token | For posting and Twitter API search |
| `ACCESS_TOKEN_SECRET` | Twitter Access Token Secret | For posting and Twitter API search |
| `XQUIK_API_KEY` | Optional Hermes Tweet/Xquik key for `search_tweets` | No |
| `HERMES_TWEET_API_KEY` | Optional alias for `XQUIK_API_KEY` | No |
| `XQUIK_BASE_URL` | Optional Xquik base URL, defaults to `https://xquik.com` | No |
| `GETXAPI_API_KEY` | Optional GetXAPI key for `search_tweets` | No |
| `GETXAPI_BASE_URL` | Optional GetXAPI base URL, defaults to `https://api.getxapi.com` | No |

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for sensitive data
3. **Rotate credentials** periodically
4. **Monitor API usage** in Twitter Developer Portal
5. **Set up alerts** for unusual activity
6. **Use separate credentials** for development and production

## Limitations

- Maximum tweet length: 280 characters
- Image file size limits: 5MB (images), 15MB (GIFs)
- Rate limits apply based on your Twitter API tier
- Media must be uploaded before tweeting (handled automatically)

## Testing

This project uses Jest for testing. Run tests with:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

Test files are located in `src/evals/`. Example test:

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork & Clone:**
   ```bash
   git clone https://github.com/genaiwithms/twitter-mcp.git
   cd twitter-mcp
   ```

2. **Create Branch:**
   ```bash
   git checkout -b feature/your-feature
   # or
   git checkout -b fix/your-bugfix
   ```

3. **Make Changes:**
   - Follow TypeScript practices
   - Add/update tests
   - Update documentation

4. **Test & Build:**
   ```bash
   npm install
   npm run build
   npm test
   ```

5. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/your-feature
   ```

6. **Open Pull Request:**
   - Use clear title and description
   - Reference issues if applicable
   - Include test results
   - Update documentation

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring
- `chore:` Maintenance


## Contributors

Thanks to everyone who contributes to Twitter MCP Server ❤️

<a href="https://github.com/GenAIwithMS/twitter-mcp/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=GenAIwithMS/twitter-mcp" />
</a>

## Support

- **Issues:** [GitHub Issues](https://github.com/genaiwithms/twitter-mcp/issues)
- **Documentation:** [MCP Documentation](https://modelcontextprotocol.io)
- **Twitter API:** [Twitter Developer Docs](https://developer.twitter.com/en/docs)

## Acknowledgments

- Model Context Protocol ecosystem
- Claude Desktop community
- twitter-api-v2 maintainers
- Xquik team
- GetXAPI team
- Open-source contributors

Special thanks to all community contributors who help improve this project.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



