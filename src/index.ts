import { createServer } from '@modelcontextprotocol/sdk';
import { formatSuccessResponse, formatErrorResponse } from './formatter.js';
import { TwitterClient } from './twitter-api.js';
import { 
  PostTweetSchema, 
  PostTweetWithImageSchema, 
  SearchTweetsSchema,
  PostTweetRequest,
  PostTweetWithImageRequest,
  SearchTweetsRequest
} from './types.js';

const twitterClient = new TwitterClient();

const server = createServer({
  tools: [
    {
      name: 'post_tweet',
      description: 'Post a tweet to Twitter',
      parameters: PostTweetSchema,
      handler: async (request: PostTweetRequest) => {
        try {
          const tweet = await twitterClient.postTweet(request);
          return formatSuccessResponse('Tweet posted successfully', tweet);
        } catch (error) {
          return formatErrorResponse('Failed to post tweet', error);
        }
      },
    },
    {
      name: 'post_tweet_with_image',
      description: 'Post a tweet with an image to Twitter',
      parameters: PostTweetWithImageSchema,
      handler: async (request: PostTweetWithImageRequest) => {
        try {
          const tweet = await twitterClient.postTweetWithImage(request);
          return formatSuccessResponse('Tweet with image posted successfully', tweet);
        } catch (error) {
          return formatErrorResponse('Failed to post tweet with image', error);
        }
      },
    },
    {
      name: 'search_tweets',
      description: 'Search for tweets on Twitter',
      parameters: SearchTweetsSchema,
      handler: async (request: SearchTweetsRequest) => {
        try {
          const results = await twitterClient.searchTweets(request);
          return formatSuccessResponse('Search completed successfully', results);
        } catch (error) {
          return formatErrorResponse('Failed to search tweets', error);
        }
      },
    },
  ],
});

server.start();