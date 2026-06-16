import { TwitterApi } from 'twitter-api-v2';
import { PostTweetRequest, PostTweetWithImageRequest, SearchTweetsRequest, GetUserProfileRequest, FetchThreadHistoryRequest, SearchRecentMentionsRequest, PublishSmartThreadRequest, Tweet } from './types.js';
import { hasXquikConfig, searchTweetsWithXquik } from './xquik-client.js';
import { hasGetXAPIConfig, searchTweetsWithGetXAPI } from './getxapi-client.js';
import * as fs from 'fs';
import * as path from 'path';

export class TwitterClient {
  private client?: TwitterApi;

  constructor() {
    const apiKey = process.env.API_KEY;
    const apiSecretKey = process.env.API_SECRET_KEY;
    const accessToken = process.env.ACCESS_TOKEN;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (apiKey && apiSecretKey && accessToken && accessTokenSecret) {
      this.client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecretKey,
        accessToken: accessToken,
        accessSecret: accessTokenSecret,
      });
    }
  }

  async postTweet(request: PostTweetRequest): Promise<Tweet> {
    const { text, reply_to_tweet_id } = request;
    
    const tweet = await this.getTwitterClient().v2.tweet({
      text,
      reply: reply_to_tweet_id ? { in_reply_to_tweet_id: reply_to_tweet_id } : undefined,
    });

    return {
      id: tweet.data.id,
      text: tweet.data.text,
      author_id: 'self', // We're always the author of tweets we post
      created_at: new Date().toISOString(),
    };
  }

  async postTweetWithImage(request: PostTweetWithImageRequest): Promise<Tweet> {
    const { text, image_path, reply_to_tweet_id } = request;

    if (!fs.existsSync(image_path)) {
      throw new Error(`Image file not found: ${image_path}`);
    }

    const mediaId = await this.uploadMedia(image_path);

    const tweet = await this.getTwitterClient().v2.tweet({
      text,
      media: { media_ids: [mediaId] },
      reply: reply_to_tweet_id ? { in_reply_to_tweet_id: reply_to_tweet_id } : undefined,
    });

    return {
      id: tweet.data.id,
      text: tweet.data.text,
      author_id: 'self', // We're always the author of tweets we post
      created_at: new Date().toISOString(),
    };
  }

  private async uploadMedia(filePath: string): Promise<string> {
    const mimeType = this.getMimeType(filePath);
    const data = fs.readFileSync(filePath);
    
    const uploadClient = this.getTwitterClient().v1;
    const mediaId = await uploadClient.uploadMedia(data, { mimeType });
    
    return mediaId;
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const mimeType = mimeTypes[ext];
    if (!mimeType) {
      throw new Error(`Unsupported image format: ${ext}`);
    }

    return mimeType;
  }

  async searchTweets(request: SearchTweetsRequest) {
    if (hasXquikConfig()) {
      return await searchTweetsWithXquik(request);
    }

    if (hasGetXAPIConfig()) {
      return await searchTweetsWithGetXAPI(request);
    }

    const { query, count } = request;
    
    const result = await this.getTwitterClient().v2.search({
      query,
      max_results: count,
      'tweet.fields': ['author_id', 'created_at'],
    });

    return {
      tweets: result.data.data.map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        author_id: tweet.author_id,
        created_at: tweet.created_at,
      })),
      meta: {
        result_count: result.data.meta.result_count,
        next_token: result.data.meta.next_token,
      },
    };
  }

  async getUserProfile(request: GetUserProfileRequest) {
    const { username } = request;

    const userResult = await this.getTwitterClient().v2.userByUsername(username, {
      expansions: ['pinned_tweet_id'],
      'user.fields': [
        'description',
        'profile_image_url',
        'public_metrics',
        'verified',
        'protected',
        'location',
        'url',
        'created_at',
        'name',
      ],
      'tweet.fields': ['created_at', 'text', 'public_metrics'],
    });

    const user = userResult.data;
    const includes = userResult.includes;

    let pinnedTweet: { id: string; text: string; created_at: string } | undefined;

    if (includes?.tweets?.[0]) {
      const pt = includes.tweets[0];
      pinnedTweet = {
        id: pt.id,
        text: pt.text,
        created_at: pt.created_at || '',
      };
    }

    const timelineResult = await this.getTwitterClient().v2.userTimeline(user.id, {
      max_results: 5,
      'tweet.fields': ['created_at', 'text', 'public_metrics'],
      exclude: ['replies', 'retweets'],
    });

    const recentTweets = (timelineResult.data.data || []).map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at || '',
      like_count: tweet.public_metrics?.like_count,
      retweet_count: tweet.public_metrics?.retweet_count,
      reply_count: tweet.public_metrics?.reply_count,
    }));

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      description: user.description,
      profile_image_url: user.profile_image_url,
      verified: user.verified,
      protected: user.protected,
      location: user.location,
      url: user.url,
      created_at: user.created_at,
      public_metrics: user.public_metrics,
      pinned_tweet: pinnedTweet,
      recent_tweets: recentTweets,
    };
  }

  async searchRecentMentions(request: SearchRecentMentionsRequest) {
    const { query, max_results } = request;

    if (query) {
      const result = await this.getTwitterClient().v2.search({
        query,
        max_results,
        'tweet.fields': ['created_at', 'author_id', 'text', 'public_metrics'],
        expansions: ['author_id'],
        'user.fields': ['username'],
      });

      const users = result.includes?.users || [];
      const userMap = new Map(users.map(u => [u.id, u.username]));

      return {
        tweets: result.data.data.map(tweet => ({
          id: tweet.id,
          text: tweet.text,
          author_id: tweet.author_id || '',
          author_username: tweet.author_id ? userMap.get(tweet.author_id) : undefined,
          created_at: tweet.created_at || '',
          like_count: tweet.public_metrics?.like_count,
          retweet_count: tweet.public_metrics?.retweet_count,
          reply_count: tweet.public_metrics?.reply_count,
        })),
        meta: {
          result_count: result.data.meta.result_count,
          next_token: result.data.meta.next_token,
        },
      };
    }

    const currentUser = await this.getTwitterClient().v1.verifyCredentials();
    const userId = currentUser.id_str;

    const mentionsResult = await this.getTwitterClient().v2.userMentionTimeline(userId, {
      max_results,
      'tweet.fields': ['created_at', 'author_id', 'text', 'public_metrics'],
      expansions: ['author_id'],
      'user.fields': ['username'],
    });

    const users = mentionsResult.includes?.users || [];
    const userMap = new Map(users.map(u => [u.id, u.username]));

    return {
      tweets: mentionsResult.data.data.map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        author_id: tweet.author_id || '',
        author_username: tweet.author_id ? userMap.get(tweet.author_id) : undefined,
        created_at: tweet.created_at || '',
        like_count: tweet.public_metrics?.like_count,
        retweet_count: tweet.public_metrics?.retweet_count,
        reply_count: tweet.public_metrics?.reply_count,
      })),
      meta: {
        result_count: mentionsResult.data.meta.result_count,
        next_token: mentionsResult.data.meta.next_token,
      },
    };
  }

  async fetchThreadHistory(request: FetchThreadHistoryRequest) {
    const { tweet_id } = request;

    const tweetResult = await this.getTwitterClient().v2.singleTweet(tweet_id, {
      'tweet.fields': ['conversation_id', 'created_at', 'author_id', 'text', 'public_metrics', 'referenced_tweets'],
    });

    const conversationId = tweetResult.data.conversation_id;
    if (!conversationId) {
      throw new Error('Tweet does not belong to a conversation thread.');
    }

    const searchResult = await this.getTwitterClient().v2.search({
      query: `conversation_id:${conversationId}`,
      max_results: 100,
      'tweet.fields': ['created_at', 'author_id', 'text', 'public_metrics', 'referenced_tweets'],
    });

    const thread = (searchResult.data.data || [])
      .map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        author_id: tweet.author_id,
        created_at: tweet.created_at || '',
        like_count: tweet.public_metrics?.like_count,
        retweet_count: tweet.public_metrics?.retweet_count,
        reply_count: tweet.public_metrics?.reply_count,
        in_reply_to_tweet_id: tweet.referenced_tweets?.find(
          rt => rt.type === 'replied_to'
        )?.id,
      }))
      .sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

    return {
      conversation_id: conversationId,
      thread,
    };
  }

  async publishSmartThread(request: PublishSmartThreadRequest) {
    const { content } = request;
    const chunks = this.chunkText(content, 280);

    if (chunks.length === 0) {
      throw new Error('No content to post after splitting.');
    }

    const postedTweets: { position: number; id: string; text: string; created_at: string }[] = [];
    let previousTweetId: string | undefined;

    for (let i = 0; i < chunks.length; i++) {
      const tweet = await this.getTwitterClient().v2.tweet({
        text: chunks[i],
        reply: previousTweetId
          ? { in_reply_to_tweet_id: previousTweetId }
          : undefined,
      });

      const tweetData = {
        position: i + 1,
        id: tweet.data.id,
        text: tweet.data.text,
        created_at: new Date().toISOString(),
      };

      postedTweets.push(tweetData);
      previousTweetId = tweet.data.id;
    }

    const firstTweetId = postedTweets[0].id;
    const firstTweetUrl = `https://x.com/i/status/${firstTweetId}`;

    return {
      thread: postedTweets,
      total_tweets: postedTweets.length,
      first_tweet_url: firstTweetUrl,
    };
  }

  private chunkText(text: string, maxLength: number): string[] {
    const paragraphs = text.split(/\n\n+/);
    const chunks: string[] = [];

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      if (trimmed.length <= maxLength) {
        chunks.push(trimmed);
        continue;
      }

      const sentences = trimmed.match(/[^.!?\n]+[.!?]*\s*/g) || [trimmed];
      let current = '';

      for (const sentence of sentences) {
        const s = sentence.trim();
        if (!s) continue;

        if (current.length + s.length + 1 <= maxLength) {
          current = current ? `${current} ${s}` : s;
        } else {
          if (current) chunks.push(current);
          if (s.length > maxLength) {
            for (let i = 0; i < s.length; i += maxLength) {
              chunks.push(s.slice(i, i + maxLength).trim());
            }
          } else {
            current = s;
          }
        }
      }

      if (current) chunks.push(current);
    }

    return chunks;
  }

  private getTwitterClient(): TwitterApi {
    if (!this.client) {
      throw new Error('Missing Twitter API credentials');
    }

    return this.client;
  }
}
