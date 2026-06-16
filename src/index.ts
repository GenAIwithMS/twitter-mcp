import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { formatSuccessResponse, formatErrorResponse } from './formatter.js';
import { TwitterClient } from './twitter-api.js';
import { 
  PostTweetSchema, 
  PostTweetWithImageSchema, 
  SearchTweetsSchema,
  GetUserProfileSchema,
  GetUserProfileOutputSchema,
  FetchThreadHistorySchema,
  FetchThreadHistoryOutputSchema,
  SearchRecentMentionsSchema,
  SearchRecentMentionsOutputSchema,
  PostTweetOutputSchema,
  SearchTweetsOutputSchema,
  PostTweetRequest,
  PostTweetWithImageRequest,
  SearchTweetsRequest,
  GetUserProfileRequest,
  FetchThreadHistoryRequest,
  SearchRecentMentionsRequest
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

server.registerTool(
  'get_user_profile_context',
  {
    description: 'Fetches a comprehensive Twitter/X user profile including bio, profile metadata, public metrics (followers, following, tweet count), the pinned tweet (if set), and the 5 most recent original tweets. Use this tool when the LLM needs to understand who a user is before engaging with them—for example, checking credibility, reading their bio, reviewing their recent activity, or deciding whether to reply, retweet, or quote. Input is the @username (without the @ symbol). Returns a rich combined JSON object with all profile context in one call.',
    inputSchema: GetUserProfileSchema.shape,
    outputSchema: GetUserProfileOutputSchema.shape,
  },
  async (request: GetUserProfileRequest) => {
    try {
      const profile = await twitterClient.getUserProfile(request);
      return formatSuccessResponse('User profile fetched successfully', profile);
    } catch (error) {
      return formatErrorResponse('Failed to fetch user profile', error);
    }
  },
);

server.registerTool(
  'fetch_thread_history',
  {
    description: 'Retrieves the full conversation thread for a given tweet. Use this tool when the LLM needs to understand the context of a conversation, read previous replies and the original tweet, or analyze the full discussion flow. Input is a tweet_id. The tool first looks up the tweet to find its conversation_id, then searches for all tweets in that conversation and returns them ordered chronologically (oldest first). Each tweet includes author_id, text, timestamps, engagement metrics, and the in_reply_to_tweet_id for mapping reply relationships.',
    inputSchema: FetchThreadHistorySchema.shape,
    outputSchema: FetchThreadHistoryOutputSchema.shape,
  },
  async (request: FetchThreadHistoryRequest) => {
    try {
      const result = await twitterClient.fetchThreadHistory(request);
      return formatSuccessResponse('Thread history fetched successfully', result);
    } catch (error) {
      return formatErrorResponse('Failed to fetch thread history', error);
    }
  },
);

server.registerTool(
  'search_recent_mentions',
  {
    description: 'Searches for recent tweets mentioning the authenticated user or matching a custom query. When no query is provided, fetches tweets that mention the authenticated account. When a query is provided, uses the Twitter recent search API to find matching tweets. Use this tool when the LLM needs to monitor mentions of the user, track brand/conversation mentions, or search for recent tweets on a topic. Each result includes the tweet text, author info, timestamp, and engagement metrics. Returns up to max_results tweets (default 10, max 100).',
    inputSchema: SearchRecentMentionsSchema.shape,
    outputSchema: SearchRecentMentionsOutputSchema.shape,
  },
  async (request: SearchRecentMentionsRequest) => {
    try {
      const result = await twitterClient.searchRecentMentions(request);
      return formatSuccessResponse('Recent mentions fetched successfully', result);
    } catch (error) {
      return formatErrorResponse('Failed to fetch recent mentions', error);
    }
  },
);

export async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Twitter MCP Server running on stdio');
}
