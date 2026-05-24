import test from 'node:test';
import assert from 'node:assert/strict';
import { searchTweetsWithXquik } from '../build/xquik-client.js';

test('searchTweetsWithXquik maps search responses and x-api-key auth', async () => {
  const previousKey = process.env.XQUIK_API_KEY;
  const previousBaseUrl = process.env.XQUIK_BASE_URL;
  process.env.XQUIK_API_KEY = 'xq_test';
  process.env.XQUIK_BASE_URL = 'https://xquik.example';

  try {
    const calls = [];
    const fetchImpl = async (url, options) => {
      calls.push({ url: new URL(url), options });
      return jsonResponse({
        data: {
          tweets: [
            {
              id: '123',
              text: 'Hermes Tweet search result',
              author: { username: 'xquik' },
              createdAt: '2026-05-24T14:00:00Z',
            },
          ],
        },
        meta: { result_count: 1, next_token: 'cursor-1' },
      });
    };

    const result = await searchTweetsWithXquik({ query: 'Hermes Tweet', count: 10 }, fetchImpl);

    assert.equal(calls[0].url.origin, 'https://xquik.example');
    assert.equal(calls[0].url.pathname, '/api/v1/x/tweets/search');
    assert.equal(calls[0].url.searchParams.get('q'), 'Hermes Tweet');
    assert.equal(calls[0].url.searchParams.get('limit'), '10');
    assert.equal(calls[0].options.headers['x-api-key'], 'xq_test');
    assert.deepEqual(result, {
      tweets: [
        {
          id: '123',
          text: 'Hermes Tweet search result',
          author_id: 'xquik',
          created_at: '2026-05-24T14:00:00Z',
        },
      ],
      meta: { result_count: 1, next_token: 'cursor-1' },
    });
  } finally {
    restoreEnv('XQUIK_API_KEY', previousKey);
    restoreEnv('XQUIK_BASE_URL', previousBaseUrl);
  }
});

test('searchTweetsWithXquik supports bearer auth aliases and API errors', async () => {
  const previousXquikKey = process.env.XQUIK_API_KEY;
  const previousHermesKey = process.env.HERMES_TWEET_API_KEY;
  delete process.env.XQUIK_API_KEY;
  process.env.HERMES_TWEET_API_KEY = 'bearer_test';

  try {
    await assert.rejects(
      () => searchTweetsWithXquik({ query: 'agents', count: 10 }, async (url, options) => {
        assert.equal(options.headers.authorization, 'Bearer bearer_test');
        return jsonResponse({ success: false, error: 'quota exceeded' });
      }),
      /quota exceeded/
    );
  } finally {
    restoreEnv('XQUIK_API_KEY', previousXquikKey);
    restoreEnv('HERMES_TWEET_API_KEY', previousHermesKey);
  }
});

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}
