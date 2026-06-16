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

// Thread history schema
export const FetchThreadHistorySchema = z.object({
  tweet_id: z.string().describe(
    'The unique numeric string ID of the tweet to retrieve the conversation thread for. The tool will look up the tweet, find its conversation_id, and return all tweets in that conversation thread chronologically.',
  ),
});

export const FetchThreadHistoryOutputSchema = z.object({
  status: z.string().describe('Indicates the outcome of the operation: "success" or "error".'),
  message: z.string().describe('A human-readable summary of the result.'),
  data: z.object({
    conversation_id: z.string().describe('The ID of the conversation thread this tweet belongs to.'),
    thread: z.array(z.object({
      id: z.string().describe('The unique numeric string ID of the tweet.'),
      text: z.string().describe('The full text content of the tweet.'),
      author_id: z.string().describe('The Twitter user ID of the tweet author.'),
      created_at: z.string().describe('ISO-8601 timestamp of tweet creation.'),
      like_count: z.number().optional().describe('Number of likes on the tweet.'),
      retweet_count: z.number().optional().describe('Number of retweets of the tweet.'),
      reply_count: z.number().optional().describe('Number of replies to the tweet.'),
      in_reply_to_tweet_id: z.string().optional().describe('The tweet ID this tweet is replying to, if any.'),
    })).describe('Array of tweets in the conversation, ordered chronologically (oldest first).'),
  }).describe('Container holding the conversation ID and ordered thread array.'),
});

export type FetchThreadHistoryRequest = z.infer<typeof FetchThreadHistorySchema>;

// Search recent mentions schema
export const SearchRecentMentionsSchema = z.object({
  query: z
    .string()
    .optional()
    .describe(
      'Optional search query string. When provided, uses the Twitter recent search endpoint to find tweets matching the query. Supports the full Twitter advanced search syntax. When omitted, fetches tweets that mention the authenticated user\'s account.',
    ),
  max_results: z
    .number()
    .min(5)
    .max(100)
    .default(10)
    .describe(
      'Maximum number of mention/search results to return. Must be between 5 and 100. Defaults to 10.',
    ),
});

export const SearchRecentMentionsOutputSchema = z.object({
  status: z.string().describe('Indicates the outcome of the operation: "success" or "error".'),
  message: z.string().describe('A human-readable summary of the result.'),
  data: z.object({
    tweets: z.array(z.object({
      id: z.string().describe('The unique numeric string ID of the tweet.'),
      text: z.string().describe('The full text content of the tweet.'),
      author_id: z.string().describe('The Twitter user ID of the tweet author.'),
      author_username: z.string().optional().describe('The @handle of the tweet author.'),
      created_at: z.string().describe('ISO-8601 timestamp of tweet creation.'),
      like_count: z.number().optional().describe('Number of likes on the tweet.'),
      retweet_count: z.number().optional().describe('Number of retweets of the tweet.'),
      reply_count: z.number().optional().describe('Number of replies to the tweet.'),
    })).describe('Array of tweets matching the mention/search query.'),
    meta: z.object({
      result_count: z.number().describe('The number of tweets returned in this result set.'),
      next_token: z.string().optional().describe('A pagination token for fetching the next page of results.'),
    }).describe('Metadata about the search result.'),
  }).describe('Container holding the matched tweets and metadata.'),
});

export type SearchRecentMentionsRequest = z.infer<typeof SearchRecentMentionsSchema>;

// Smart thread schema
export const PublishSmartThreadSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(10000)
    .describe(
      'The full text content to publish as a thread. Can be thousands of characters long. The tool automatically splits the content into individual tweets (each ≤280 characters) by paragraph breaks (double newlines) and posts them as a threaded reply chain. Use double newlines to indicate where you want tweet breaks to occur. Supports Unicode, emoji, hashtags, mentions, and URLs.',
    ),
});

export const PublishSmartThreadOutputSchema = z.object({
  status: z.string().describe('Indicates the outcome of the operation: "success" or "error".'),
  message: z.string().describe('A human-readable summary of the result.'),
  data: z.object({
    thread: z.array(z.object({
      position: z.number().describe('The 1-based position of this tweet in the thread.'),
      id: z.string().describe('The unique numeric string ID assigned by Twitter to the tweet.'),
      text: z.string().describe('The text content of this tweet in the thread.'),
      created_at: z.string().describe('ISO-8601 timestamp of when the tweet was created.'),
    })).describe('Array of all posted tweets in the thread, in order.'),
    total_tweets: z.number().describe('Total number of tweets posted in the thread.'),
    first_tweet_url: z.string().describe('URL to the first tweet in the thread on X/Twitter.'),
  }).describe('Container holding the posted thread details.'),
});

export type PublishSmartThreadRequest = z.infer<typeof PublishSmartThreadSchema>;

// Quote tweet schema
export const DraftQuoteTweetSchema = z.object({
  target_tweet_id: z
    .string()
    .describe(
      'The unique numeric string ID of the existing tweet to quote. The quoted tweet will appear embedded below the commentary in the new tweet.',
    ),
  commentary: z
    .string()
    .max(280)
    .describe(
      'The text commentary to accompany the quoted tweet. This becomes the text of the new quote tweet, displayed above the quoted content. Maximum 280 characters.',
    ),
});

export const DraftQuoteTweetOutputSchema = z.object({
  status: z.string().describe('Indicates the outcome of the operation: "success" or "error".'),
  message: z.string().describe('A human-readable summary of the result.'),
  data: z.object({
    id: z.string().describe('The unique numeric string ID assigned by Twitter to the quote tweet.'),
    text: z.string().describe('The full text content of the posted quote tweet.'),
    author_id: z.string().describe('The Twitter user ID of the account that posted the quote tweet.'),
    created_at: z.string().describe('ISO-8601 timestamp of when the quote tweet was created.'),
    quoted_tweet_id: z.string().describe('The ID of the tweet that was quoted.'),
    tweet_url: z.string().describe('URL to the quote tweet on X/Twitter.'),
  }).describe('Container holding the created quote tweet details.'),
});

export type DraftQuoteTweetRequest = z.infer<typeof DraftQuoteTweetSchema>;

// Tool schemas
export type PostTweetRequest = z.infer<typeof PostTweetSchema>;
export type PostTweetWithImageRequest = z.infer<typeof PostTweetWithImageSchema>;
export type SearchTweetsRequest = z.infer<typeof SearchTweetsSchema>;
