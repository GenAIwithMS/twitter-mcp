import { TwitterApi } from 'twitter-api-v2';
import { PostTweetRequest, PostTweetWithImageRequest, SearchTweetsRequest, GetUserProfileRequest, FetchThreadHistoryRequest, Tweet } from './types.js';
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

  private getTwitterClient(): TwitterApi {
    if (!this.client) {
      throw new Error('Missing Twitter API credentials');
    }

    return this.client;
  }
}
