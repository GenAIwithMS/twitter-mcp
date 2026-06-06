import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { formatSuccessResponse, formatErrorResponse } from './formatter.js';
import { TwitterClient } from './twitter-api.js';
import { 
  PostTweetSchema, 
  PostTweetWithImageSchema, 
  SearchTweetsSchema,
  PostTweetOutputSchema,
  SearchTweetsOutputSchema,
  PostTweetRequest,
  PostTweetWithImageRequest,
  SearchTweetsRequest
} from './types.js';

const twitterClient = new TwitterClient();

const server = new McpServer(
  { name: 'twitter-mcp', version: '0.3.3' },
  { capabilities: { tools: {} } },
);

server.registerTool(
  'post_tweet',
  {
    description: 'Posts a new text-only tweet to the authenticated Twitter/X account. Use this tool when the LLM needs to publish a status update, share information, announce something, or reply to an existing tweet in a thread. The tweet text must be 280 characters or fewer. Optionally accepts a reply_to_tweet_id to post as a threaded reply. Returns the created tweet ID, full text, author identifier, and creation timestamp. Prefer this over post_tweet_with_image when no media attachment is needed.',
    inputSchema: PostTweetSchema.shape,
    outputSchema: PostTweetOutputSchema.shape,
  },
  async (request: PostTweetRequest) => {
    try {
      const tweet = await twitterClient.postTweet(request);
      return formatSuccessResponse('Tweet posted successfully', tweet);
    } catch (error) {
      return formatErrorResponse('Failed to post tweet', error);
    }
  },
);

server.registerTool(
  'post_tweet_with_image',
  {
    description: 'Posts a new tweet with an attached image file to the authenticated Twitter/X account. Use this tool when the LLM needs to publish a status update that includes a photo, graphic, screenshot, or any visual media. The image is uploaded from a local filesystem path (supports JPEG, PNG, GIF, WebP). The accompanying text must be 280 characters or fewer. Optionally accepts a reply_to_tweet_id for threaded replies. Returns the created tweet object with ID, text, author, and timestamp. Falls back to the standard Twitter API v2 media upload endpoint.',
    inputSchema: PostTweetWithImageSchema.shape,
    outputSchema: PostTweetOutputSchema.shape,
  },
  async (request: PostTweetWithImageRequest) => {
    try {
      const tweet = await twitterClient.postTweetWithImage(request);
      return formatSuccessResponse('Tweet with image posted successfully', tweet);
    } catch (error) {
      return formatErrorResponse('Failed to post tweet with image', error);
    }
  },
);

server.registerTool(
  'search_tweets',
  {
    description: 'Searches Twitter/X for recent tweets matching a query string. Use this tool when the LLM needs to find tweets by keyword, hashtag, mention, or advanced filters (date ranges, language, engagement thresholds). Supports Twitter\'s full advanced search syntax. Returns a list of matching tweets with their IDs, text, author IDs, and creation timestamps, plus pagination metadata (next_token) for retrieving additional results. Can use alternative backends (XQuik or GetXAPI) when their respective API keys are configured. The count parameter controls how many results (10-100) are returned per call.',
    inputSchema: SearchTweetsSchema.shape,
    outputSchema: SearchTweetsOutputSchema.shape,
  },
  async (request: SearchTweetsRequest) => {
    try {
      const results = await twitterClient.searchTweets(request);
      return formatSuccessResponse('Search completed successfully', results);
    } catch (error) {
      return formatErrorResponse('Failed to search tweets', error);
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Twitter MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error starting Twitter MCP Server:', error);
  process.exit(1);
});
