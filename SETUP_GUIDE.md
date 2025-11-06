# Twitter MCP Extended - Setup Guide

## ✅ All Changes Complete!

I've successfully modified your Twitter MCP server to add image posting functionality. Here's what was done:

### Files Modified:

1. **src/types.ts** ✅
   - Added `PostTweetWithImageSchema` validation schema
   - Added `PostTweetWithImageArgs` type

2. **src/twitter-api.ts** ✅
   - Added `uploadMedia()` - uploads images to Twitter
   - Added `postTweetWithImage()` - posts tweets with images
   - Added `getMimeType()` - detects image format (jpg, png, gif, webp)

3. **src/index.ts** ✅
   - Added new tool `post_tweet_with_image` to MCP tools list
   - Added `handlePostTweetWithImage()` request handler

4. **package.json** ✅
   - Changed package name to `@muham/twitter-mcp-extended`
   - Updated version to `0.3.0`
   - Updated description

5. **IMAGE_FEATURE.md** ✅ (New file)
   - Complete documentation of changes

## 🚀 Next Steps:

### Option A: Test Locally First (Recommended)

1. **Open terminal in the project folder:**
   ```bash
   cd C:\Users\muham\Desktop\twitter-mcp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Update your Claude MCP config** (located at `%APPDATA%\Claude\claude_desktop_config.json`):
   ```json
   "twitter-mcp": {
     "command": "node",
     "args": ["C:\\Users\\muham\\Desktop\\twitter-mcp\\build\\index.js"],
     "env": {
       "API_KEY": "your_api_key",
       "API_SECRET_KEY": "your_api_secret",
       "ACCESS_TOKEN": "your_access_token",
       "ACCESS_TOKEN_SECRET": "your_access_token_secret"
     },
     "transport": "stdio"
   }
   ```

5. **Restart Claude Desktop**

6. **Test with an image:**
   - Save an image somewhere on your computer
   - Ask Claude to: "post a tweet with image at C:\\path\\to\\image.jpg with caption 'Testing image post!'"

### Option B: Publish to npm (For Remote Use)

1. **Create npm account** at https://www.npmjs.com (if you don't have one)

2. **Login to npm:**
   ```bash
   npm login
   ```

3. **Publish the package:**
   ```bash
   npm publish --access public
   ```

4. **Update your MCP config:**
   ```json
   "twitter-mcp": {
     "command": "C:\\Program Files\\nodejs\\npx",
     "args": ["-y", "@muham/twitter-mcp-extended"],
     "env": { ... }
   }
   ```

## 📝 Using the New Feature

Once set up, you can use it like this:

**Example 1: Simple tweet with image**
```
"Post this image with caption: Welcome to the future! 🚀"
[attach/reference image path]
```

**Example 2: Programmatic use**
```javascript
{
  "text": "Check out this amazing view!",
  "image_path": "C:\\Users\\muham\\Desktop\\cool-image.jpg"
}
```

**Example 3: Reply with image**
```javascript
{
  "text": "Here's the screenshot you requested",
  "image_path": "C:\\Users\\muham\\Desktop\\screenshot.png",
  "reply_to_tweet_id": "1234567890"
}
```

## 🔍 Supported Image Formats
- JPG/JPEG
- PNG
- GIF
- WEBP

## ⚠️ Important Notes

1. **Image path must be absolute** (full path like `C:\\Users\\...`)
2. **File must exist** before posting
3. **File size limits** apply (Twitter's limits: 5MB for images, 15MB for GIFs)
4. All your existing API credentials remain the same
5. The original `post_tweet` tool still works without images

## 🆘 Troubleshooting

**Build fails?**
- Make sure you ran `npm install` first
- Check that Node.js is installed: `node --version`

**"Module not found" errors?**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**Image upload fails?**
- Verify the image path is correct
- Check file permissions
- Ensure image is under size limit

**Can't publish to npm?**
- You need to verify your npm email
- Package name might be taken (change in package.json)

## 📚 Resources

- Original repo: https://github.com/EnesCinr/twitter-mcp
- Twitter API docs: https://developer.twitter.com/en/docs
- MCP Protocol: https://modelcontextprotocol.io

---

Ready to build and test! Let me know if you need help with any step. 🎉
