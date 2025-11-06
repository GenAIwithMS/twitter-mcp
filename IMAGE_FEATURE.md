# Image Posting Feature

This fork adds image posting capability to the Twitter MCP server.

## What's New

- **New Tool**: `post_tweet_with_image` - Post tweets with images attached
- Supports common image formats: JPG, PNG, GIF, WEBP
- Uses Twitter API v1.1 media upload endpoint

## Changes Made

### 1. `src/types.ts`
- Added `PostTweetWithImageSchema` for validating image tweet parameters
- Added `PostTweetWithImageArgs` type

### 2. `src/twitter-api.ts`
- Added `uploadMedia()` method to handle image uploads
- Added `postTweetWithImage()` method to post tweets with images
- Added `getMimeType()` helper to detect image MIME types

### 3. `src/index.ts`
- Added `post_tweet_with_image` tool to the available tools list
- Added `handlePostTweetWithImage()` handler

### 4. `package.json`
- Updated package name to `@muham/twitter-mcp-extended`
- Updated version to `0.3.0`

## Usage

### Configuration

Update your MCP settings to use the extended version:

```json
"twitter-mcp": {
  "command": "C:\\Program Files\\nodejs\\npx",
  "args": [
    "-y",
    "@muham/twitter-mcp-extended"
  ],
  "env": {
    "API_KEY": "your_api_key",
    "API_SECRET_KEY": "your_api_secret",
    "ACCESS_TOKEN": "your_access_token",
    "ACCESS_TOKEN_SECRET": "your_access_token_secret"
  },
  "transport": "stdio"
}
```

### Posting a Tweet with Image

```javascript
// The tool expects:
{
  "text": "Your tweet text here",
  "image_path": "C:\\path\\to\\your\\image.jpg",
  "reply_to_tweet_id": "optional_tweet_id"  // Optional
}
```

## Building and Testing

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Test locally (update your MCP config to point to local build):
```json
"twitter-mcp": {
  "command": "node",
  "args": ["C:\\Users\\muham\\Desktop\\twitter-mcp\\build\\index.js"],
  "env": { ... }
}
```

## Publishing to npm

1. Create an npm account at https://www.npmjs.com
2. Login via terminal:
```bash
npm login
```

3. Publish the package:
```bash
npm publish --access public
```

4. Update your MCP config to use the published package:
```json
"args": ["-y", "@muham/twitter-mcp-extended"]
```

## Credits

Original package by Enes Cinar (@enescinar/twitter-mcp)
Image posting feature added by Muhammad
