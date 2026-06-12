import { z } from 'zod';

// Tweet posting schemas
export const PostTweetSchema = z.object({
  text: z
    .string()
    .max(280)
    .describe(
      'The main body text of the tweet. Maximum 280 characters. Supports Unicode, emoji, hashtags (#), mentions (@), and URLs. The text will be posted verbatim to Twitter as a new status update.'
    ),
  reply_to_tweet_id: z
    .string()
    .optional()
    .describe(
      'The unique numeric ID of an existing tweet to reply to. When provided, the new tweet will be posted as a threaded reply directly beneath the specified parent tweet. Omit this field to post a top-level (non-reply) tweet.'
    ),
});

export const PostTweetWithImageSchema = z.object({
  text: z
    .string()
    .max(280)
    .describe(
      'The main body text of the tweet. Maximum 280 characters. This text accompanies the uploaded image in the tweet post.'
    ),
  image_path: z
    .string()
    .describe(
      'Absolute or relative filesystem path to the image file to upload and attach to the tweet. Supported formats: JPEG, PNG, GIF, WebP. The file must exist and be readable at the time of invocation.'
    ),
  reply_to_tweet_id: z
    .string()
    .optional()
    .describe(
      'The unique numeric ID of an existing tweet to reply to. When provided, the new tweet-with-image will be posted as a threaded reply. Omit for a standalone tweet.'
    ),
});

export const SearchTweetsSchema = z.object({
  query: z
    .string()
    .describe(
      'The Twitter search query string. Supports the full Twitter advanced search syntax, including keywords (separated by spaces), exact phrases (in double quotes), from:username, to:username, #hashtag, @mention, lang:XX (ISO language code), until:YYYY-MM-DD, since:YYYY-MM-DD, min_retweets:N, min_faves:N, and filter:media / filter:links / filter:images. The query is URL-encoded and sent directly to the Twitter search API.'
    ),
  count: z
    .number()
    .min(10)
    .max(100)
    .describe(
      'Number of search results to return per request. Must be between 10 and 100 (inclusive). Higher values return more tweets per invocation but increase response latency and API quota consumption.'
    ),
});

export const PostTweetOutputSchema = z.object({
  status: z
    .string()
    .describe('Indicates the outcome of the operation: "success" or "error".'),
  message: z
    .string()
    .describe(
      'A human-readable summary of the result, e.g. "Tweet posted successfully".'
    ),
  data: z
    .object({
      id: z.string().describe('The unique numeric string ID assigned by Twitter.'),
      text: z
        .string()
        .describe('The full text content of the posted tweet (may be truncated).'),
      author_id: z
        .string()
        .describe(
          'The Twitter user ID of the account that posted the tweet (always "self" for the authenticated user).'
        ),
      created_at: z
        .string()
        .describe('ISO-8601 timestamp of when the tweet was created.'),
    })
    .describe('Container holding the created tweet details.'),
});

export const SearchTweetsOutputSchema = z.object({
  status: z
    .string()
    .describe('Indicates the outcome of the operation: "success" or "error".'),
  message: z
    .string()
    .describe(
      'A human-readable summary of the search result, e.g. "Search completed successfully".'
    ),
  data: z
    .object({
      tweets: z
        .array(
          z.object({
            id: z.string().describe('The unique numeric string ID of the tweet.'),
            text: z
              .string()
              .describe('The full text content of the tweet (may be truncated).'),
            author_id: z
              .string()
              .describe('The Twitter user ID of the tweet author.'),
            created_at: z
              .string()
              .describe('ISO-8601 timestamp of tweet creation.'),
          })
        )
        .describe('Array of tweet objects matching the search query.'),
      meta: z
        .object({
          result_count: z
            .number()
            .describe(
              'The number of tweets returned in this result set (matches the requested count at most).'
            ),
          next_token: z
            .string()
            .optional()
            .describe(
              'A pagination token for fetching the next page of results. Pass this value as the next_token parameter in a follow-up search call to retrieve more tweets.'
            ),
        })
        .describe('Metadata about the search result, including result count and optional pagination cursor.'),
    })
    .describe('Container holding the array of matched tweets and search metadata.'),
});

// Response schemas
export type Tweet = {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
};

export type SearchResponse = {
  tweets: Tweet[];
  meta: {
    result_count: number;
    next_token?: string;
  };
};

// User profile schema
export const GetUserProfileSchema = z.object({
  username: z
    .string()
    .describe(
      'The Twitter/X username (handle) to look up. Do NOT include the @ symbol. Example: "elonmusk", "twitter". The username is case-insensitive and will be resolved to the canonical Twitter user profile.'
    ),
});

export const GetUserProfileOutputSchema = z.object({
  status: z.string().describe('Indicates the outcome of the operation: "success" or "error".'),
  message: z.string().describe('A human-readable summary of the result.'),
  data: z.object({
    id: z.string().describe('The unique numeric string ID assigned by Twitter to the user.'),
    name: z.string().describe('The display name of the user as shown on their profile.'),
    username: z.string().describe('The @handle username of the user.'),
    description: z.string().optional().describe('The bio/description text from the user\'s profile.'),
    profile_image_url: z.string().optional().describe('URL to the user\'s profile avatar image.'),
    verified: z.boolean().optional().describe('Whether the user has a verified account.'),
    protected: z.boolean().optional().describe('Whether the user has a protected (private) account.'),
    location: z.string().optional().describe('The location listed on the user\'s profile.'),
    url: z.string().optional().describe('The URL listed on the user\'s profile.'),
    created_at: z.string().optional().describe('ISO-8601 timestamp of when the user joined Twitter.'),
    public_metrics: z.object({
      followers_count: z.number().describe('Number of followers the user has.'),
      following_count: z.number().describe('Number of accounts the user follows.'),
      tweet_count: z.number().describe('Total number of tweets posted by the user.'),
      listed_count: z.number().describe('Number of lists the user is on.'),
    }).optional().describe('Public engagement metrics for the user.'),
    pinned_tweet: z.object({
      id: z.string(),
      text: z.string(),
      created_at: z.string(),
    }).optional().describe('The user\'s pinned tweet, if one is set.'),
    recent_tweets: z.array(z.object({
      id: z.string().describe('The unique numeric string ID of the tweet.'),
      text: z.string().describe('The full text content of the tweet.'),
      created_at: z.string().describe('ISO-8601 timestamp of tweet creation.'),
      like_count: z.number().optional().describe('Number of likes on the tweet.'),
      retweet_count: z.number().optional().describe('Number of retweets of the tweet.'),
      reply_count: z.number().optional().describe('Number of replies to the tweet.'),
    })).describe('The 5 most recent tweets from the user.'),
  }).describe('Container holding the user profile data, bio, metrics, pinned tweet, and recent tweets.'),
});

export type GetUserProfileRequest = z.infer<typeof GetUserProfileSchema>;

// Tool schemas
export type PostTweetRequest = z.infer<typeof PostTweetSchema>;
export type PostTweetWithImageRequest = z.infer<typeof PostTweetWithImageSchema>;
export type SearchTweetsRequest = z.infer<typeof SearchTweetsSchema>;
