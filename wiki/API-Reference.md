# API Reference

This MCP exposes the following tools for use by Claude:

## Tools

### `post_tweet`
- Description: Post a text tweet.
- Parameters:
  - `text` (string)
  - `reply_to_tweet_id` (string, optional)

### `post_tweet_with_image`
- Description: Post a tweet with a local image.
- Parameters:
  - `text` (string)
  - `image_path` (string) — local path to image (absolute or relative)
  - `reply_to_tweet_id` (string, optional)

### `search_tweets`
- Description: Search for tweets by query.
- Parameters:
  - `query` (string)
  - `count` (number, 10-100)
- Backend:
  - Uses Hermes Tweet/Xquik when `XQUIK_API_KEY` or `HERMES_TWEET_API_KEY` is set.
  - Uses GetXAPI when `GETXAPI_API_KEY` is set.
  - Falls back to the configured Twitter API credentials otherwise.

Responses are returned as MCP-formatted content objects. See the code in `src/` for exact shapes and types.
