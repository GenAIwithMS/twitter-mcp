import { z } from 'zod';

// Tweet posting schemas
export const PostTweetSchema = z.object({
  text: z.string().max(280),
  reply_to_tweet_id: z.string().optional(),
});

export const PostTweetWithImageSchema = z.object({
  text: z.string().max(280),
  image_path: z.string(),
  reply_to_tweet_id: z.string().optional(),
});

export const SearchTweetsSchema = z.object({
  query: z.string(),
  count: z.number().min(10).max(100),
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

// Tool schemas
export type PostTweetRequest = z.infer<typeof PostTweetSchema>;
export type PostTweetWithImageRequest = z.infer<typeof PostTweetWithImageSchema>;
export type SearchTweetsRequest = z.infer<typeof SearchTweetsSchema>;