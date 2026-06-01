import { SearchTweetsRequest, SearchResponse, Tweet } from './types.js';

const DEFAULT_GETXAPI_BASE_URL = 'https://api.getxapi.com';

type GetXAPITweet = {
  id?: string;
  id_str?: string;
  tweetId?: string;
  text?: string;
  full_text?: string;
  author_id?: string;
  authorId?: string;
  user?: {
    id?: string;
    id_str?: string;
    username?: string;
    screen_name?: string;
  };
  author?: {
    id?: string;
    id_str?: string;
    username?: string;
    screen_name?: string;
  };
  created_at?: string;
  createdAt?: string;
};

type GetXAPISearchPayload = {
  success?: boolean;
  error?: string;
  message?: string;
  data?: unknown;
  tweets?: unknown;
  results?: unknown;
  meta?: {
    result_count?: number;
    next_token?: string;
    nextToken?: string;
  };
  next_token?: string;
  nextToken?: string;
};

export function hasGetXAPIConfig(): boolean {
  return Boolean(process.env.GETXAPI_API_KEY);
}

export async function searchTweetsWithGetXAPI(
  request: SearchTweetsRequest,
  fetchImpl: typeof fetch = fetch
): Promise<SearchResponse> {
  const apiKey = process.env.GETXAPI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GETXAPI_API_KEY');
  }

  const baseUrl = (process.env.GETXAPI_BASE_URL || DEFAULT_GETXAPI_BASE_URL).replace(/\/+$/, '');
  const url = new URL('/twitter/tweet/advanced_search', `${baseUrl}/`);
  url.searchParams.set('q', request.query);
  url.searchParams.set('limit', String(request.count));

  const response = await fetchImpl(url, {
    method: 'GET',
    headers: { authorization: `Bearer ${apiKey}` },
  });
  const text = await response.text();
  const payload = parsePayload(text);

  if (!response.ok || payload.success === false) {
    throw new Error(buildErrorMessage(response.status, payload, text));
  }

  const tweets = extractTweets(payload).map(normalizeTweet).filter((tweet): tweet is Tweet => tweet !== null);
  return {
    tweets,
    meta: {
      result_count: readResultCount(payload, tweets.length),
      next_token: payload.meta?.next_token || payload.meta?.nextToken || payload.next_token || payload.nextToken,
    },
  };
}

function parsePayload(text: string): GetXAPISearchPayload {
  if (!text) return {};

  try {
    return JSON.parse(text) as GetXAPISearchPayload;
  } catch {
    throw new Error('GetXAPI returned a non-JSON search response');
  }
}

function extractTweets(payload: GetXAPISearchPayload): GetXAPITweet[] {
  const candidates = [
    payload.tweets,
    payload.results,
    payload.data,
    readObject(payload.data)?.tweets,
    readObject(payload.data)?.results,
    readObject(readObject(payload.data)?.data)?.tweets,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as GetXAPITweet[];
  }

  return [];
}

function normalizeTweet(tweet: GetXAPITweet): Tweet | null {
  const id = firstString(tweet.id, tweet.id_str, tweet.tweetId);
  if (!id) return null;

  return {
    id,
    text: firstString(tweet.text, tweet.full_text),
    author_id: firstString(
      tweet.author_id,
      tweet.authorId,
      tweet.author?.id,
      tweet.author?.id_str,
      tweet.author?.username,
      tweet.author?.screen_name,
      tweet.user?.id,
      tweet.user?.id_str,
      tweet.user?.username,
      tweet.user?.screen_name
    ),
    created_at: firstString(tweet.created_at, tweet.createdAt),
  };
}

function readResultCount(payload: GetXAPISearchPayload, fallback: number): number {
  if (typeof payload.meta?.result_count === 'number') return payload.meta.result_count;
  return fallback;
}

function buildErrorMessage(status: number, payload: GetXAPISearchPayload, text: string): string {
  const detail = firstString(payload.error, payload.message, text.slice(0, 180));
  return `GetXAPI search failed with ${status}: ${detail}`;
}

function readObject(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }

  return '';
}
