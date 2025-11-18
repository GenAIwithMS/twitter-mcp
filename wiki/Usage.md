# Usage

## Posting Tweets

Simple text tweet:
```
Post a tweet: "Hello world!"
```

Reply to a tweet:
```
Reply to tweet 1234567890 with: "Nice point"
```

## Posting with Images

1. Ensure filesystem MCP is available (built-in or external).
2. Use absolute or relative file paths.
3. Example:
```
Post this image with caption: "Check out this view!"
Image path: C:\Users\Photos\sunset.jpg
```

Supported formats: JPEG/JPG, PNG, GIF, WEBP.

Image requirements:
- Max size: 5MB (images), 15MB (GIFs)
- File must exist and be readable by the filesystem MCP

## Searching Tweets

Basic search:
```
Search for tweets about "artificial intelligence"
```

Advanced search:
```
Search for 50 tweets about "climate change" from the past week
```