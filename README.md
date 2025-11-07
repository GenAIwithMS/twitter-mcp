# Twitter MCP Server

A Model Context Protocol (MCP) server that enables seamless interaction with Twitter/X platform. Post tweets, share images, and search Twitter directly through Claude AI.

[![npm version](https://img.shields.io/npm/v/@muhammadsiddiq/twitter-mcp.svg)](https://www.npmjs.com/package/@muhammadsiddiq/twitter-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/node/v/@muhammadsiddiq/twitter-mcp)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## Features

- 🐦 **Post Tweets** - Share your thoughts with the world
- 🖼️ **Image Support** - Post tweets with images (JPG, PNG, GIF, WEBP)
- 🔍 **Search Tweets** - Find and analyze tweets by query
- 💬 **Reply to Tweets** - Engage in conversations
- 🔐 **Secure Authentication** - OAuth 1.0a authentication
- ⚡ **Rate Limiting** - Built-in protection against API limits

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
- [License](#license)

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or npx
- Twitter Developer Account with API credentials
- Claude Desktop App

### Quick Start

The easiest way to use this MCP server is through npx (no installation required):

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
## Configuration

### Step 1: Get Twitter API Credentials

1. Visit [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new App or use an existing one
3. Navigate to "Keys and Tokens"
4. Generate/Copy the following:
   - API Key
   - API Secret Key
   - Access Token
   - Access Token Secret

### Step 2: Configure Claude Desktop

#### Windows

Edit the configuration file located at:
```
%APPDATA%\Claude\claude_desktop_config.json
```

Or navigate to:
```
C:\Users\YOUR_USERNAME\AppData\Roaming\Claude\claude_desktop_config.json
```

#### macOS

Edit the configuration file located at:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

#### Linux

Edit the configuration file located at:
```
~/.config/Claude/claude_desktop_config.json
```

### Step 3: Add MCP Server Configuration

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "twitter": {
      "command": "npx",
      "args": ["-y", "@muhammadsiddiq/twitter-mcp"],
      "env": {
        "API_KEY": "your_api_key_here",
        "API_SECRET_KEY": "your_api_secret_key_here",
        "ACCESS_TOKEN": "your_access_token_here",
        "ACCESS_TOKEN_SECRET": "your_access_token_secret_here"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontext/filesystem-server"]
    }
  }
}
```

For security, consider using environment variables in production:

```json
{
  "mcpServers": {
    "twitter": {
      "command": "npx",
      "args": ["-y", "@muhammadsiddiq/twitter-mcp"],
      "env": {
        "API_KEY": "${TWITTER_API_KEY}",
        "API_SECRET_KEY": "${TWITTER_API_SECRET_KEY}",
        "ACCESS_TOKEN": "${TWITTER_ACCESS_TOKEN}",
        "ACCESS_TOKEN_SECRET": "${TWITTER_ACCESS_TOKEN_SECRET}"
      }
    }
  }
}
```

**Important:** Replace the placeholder values with your actual Twitter API credentials.

### Step 4: Restart Claude Desktop

Close and reopen Claude Desktop completely for the changes to take effect.

### Claude Desktop built-in MCP (filesystem)

Claude Desktop already includes built-in MCP support for common services (including a filesystem connector in many releases). That means in most cases you do NOT need to run a separate `filesystem` MCP server to let Claude access local files and images.

What this means for you:

- Convenience: For most users it's easiest to use the built-in MCP — there's no extra process to install or run.
- Permissions: Claude Desktop will ask for permission to access files or folders. Use the app's UI to grant access to the directories containing images.
- External server (optional): If you prefer more control (restricting which folders are exposed, or running in an environment where the built-in connector is unavailable), you can run an external filesystem MCP server instead and connect to it from Claude.

Which approach to choose (recommended):

- Beginner / one-off usage: Use the built-in MCP in Claude Desktop. It's simpler and requires minimal configuration.
- Advanced / production / security-conscious setups: Use an external filesystem MCP server so you can restrict the exact folders served and run under a separate account. This is useful if you share a machine or want fine-grained auditability.

Example — using built-in MCP (no extra filesystem entry needed):

```json
{
  "mcpServers": {
    "twitter": {
      "command": "npx",
      "args": ["-y", "@muhammadsiddiq/twitter-mcp"],
      "env": {
        "API_KEY": "${TWITTER_API_KEY}",
        "API_SECRET_KEY": "${TWITTER_API_SECRET_KEY}",
        "ACCESS_TOKEN": "${TWITTER_ACCESS_TOKEN}",
        "ACCESS_TOKEN_SECRET": "${TWITTER_ACCESS_TOKEN_SECRET}"
      }
    }
  }
}
```

Example — using an external filesystem MCP (optional):

```json
{
  "mcpServers": {
    "twitter": {
      "command": "npx",
      "args": ["-y", "@muhammadsiddiq/twitter-mcp"],
      "env": { /* twitter env */ }
    },
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

Notes and tips:

- If you use the built-in MCP, confirm that Claude Desktop has permission to read the folders where your images are stored.
- When using an external filesystem MCP, prefer absolute paths or a small set of root directories to reduce accidental exposure.
- The `twitter-mcp` server expects image paths to point to local files that are readable by the MCP that serves the filesystem.

With this guidance in place, you can pick the approach that fits your workflow: built-in for convenience, external for stricter control.

## Usage

Once configured, you can interact with Twitter through natural language commands to Claude.

### Posting Tweets

**Simple Tweet:**
```
Post a tweet: "Hello World! 🌍"
```

**Reply to a Tweet:**
```
Reply to tweet 1234567890 with: "Great point!"
```

### Posting with Images

> **Important**: Make sure you have configured the filesystem MCP server as shown in Step 3.

**Tweet with Image:**
```
Post this image with caption: "Check out this amazing view!"
Image path: C:\Users\Photos\sunset.jpg
```

**Working with Images:**

1. **File Access**:
  - The filesystem MCP server must be configured to access local images
  - Images must be in an accessible location on your computer
  - Both absolute and relative paths are supported

2. **Path Formats**:
  - Windows: `C:\Users\YourName\Pictures\image.jpg`
  - macOS: `/Users/YourName/Pictures/image.jpg`
  - Linux: `/home/yourname/pictures/image.jpg`
  - Relative: `./images/photo.jpg` (relative to your working directory)

3. **Supported Image Formats**:
  - JPEG/JPG (`image/jpeg`)
  - PNG (`image/png`)
  - GIF (`image/gif`)
  - WEBP (`image/webp`)

4. **Image Requirements**:
  - Maximum file size: 5MB for static images, 15MB for GIFs
  - Recommended dimensions: 1200x675 pixels (16:9 aspect ratio)
  - File permissions: Must be readable by the Claude Desktop app

5. **Best Practices**:
  - Use relative paths when possible for portability
  - Keep images in a dedicated folder for better organization
  - Consider image optimization for better upload performance
  - Test with small images first

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

The server provides three tools that can be accessed through Claude:

#### 1. `post_tweet`

Post a text-only tweet.

**Types:**
```typescript
interface PostTweetRequest {
  text: string;              // Max 280 characters
  reply_to_tweet_id?: string; // Optional tweet ID to reply to
}

interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
}
```

**Example:**
```json
{
  "text": "Hello Twitter! 👋",
  "reply_to_tweet_id": "1234567890"
}

// Response:
{
  "status": "success",
  "message": "Tweet posted successfully",
  "data": {
    "id": "1234567891",
    "text": "Hello Twitter! 👋",
    "author_id": "self",
    "created_at": "2025-11-06T12:00:00.000Z"
  }
}
```

#### 2. `post_tweet_with_image`

Post a tweet with an attached image.

**Types:**
```typescript
interface PostTweetWithImageRequest {
  text: string;              // Max 280 characters
  image_path: string;        // Absolute path to image file
  reply_to_tweet_id?: string; // Optional tweet ID to reply to
}

// Response uses the same Tweet interface
```

**Supported Image Formats:**
- JPEG/JPG
- PNG
- GIF (animated, max 15MB)
- WEBP

**Example:**
```json
// Request:
{
  "text": "Beautiful sunset today! 🌅",
  "image_path": "C:\\Users\\Photos\\sunset.jpg",
  "reply_to_tweet_id": "1234567890"
}

// Response:
{
  "status": "success",
  "message": "Tweet with image posted successfully",
  "data": {
    "id": "1234567891",
    "text": "Beautiful sunset today! 🌅",
    "author_id": "self",
    "created_at": "2025-11-06T12:00:00.000Z"
  }
}
```
#### 3. `search_tweets`

Search for tweets matching a query.

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
git clone https://github.com/EnesCinr/twitter-mcp.git
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

The server requires the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | Twitter API Key | Yes |
| `API_SECRET_KEY` | Twitter API Secret Key | Yes |
| `ACCESS_TOKEN` | Twitter Access Token | Yes |
| `ACCESS_TOKEN_SECRET` | Twitter Access Token Secret | Yes |

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

```typescript
import { describe, it, expect } from '@jest/globals';
import { TwitterClient } from '../twitter-api';

describe('TwitterClient', () => {
  it('should post a tweet', async () => {
    const client = new TwitterClient();
    const tweet = await client.postTweet({
      text: 'Test tweet'
    });
    expect(tweet.text).toBe('Test tweet');
  });
});
```

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork & Clone:**
   ```bash
   git clone https://github.com/EnesCinr/twitter-mcp.git
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
   npm test
   npm run build
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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues:** [GitHub Issues](https://github.com/genaiwithms/twitter-mcp/issues)
- **Documentation:** [MCP Documentation](https://modelcontextprotocol.io)
- **Twitter API:** [Twitter Developer Docs](https://developer.twitter.com/en/docs)

## Acknowledgments

- Built with [Model Context Protocol SDK](https://github.com/modelcontextprotocol)
- Uses [twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2) library
- Inspired by the Claude AI ecosystem

---

**Made with ❤️ by [genaiwithms](https://github.com/genaiwithms)**
