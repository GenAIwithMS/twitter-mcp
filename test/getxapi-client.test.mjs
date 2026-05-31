import test from 'node:test';
import assert from 'node:assert/strict';
import { searchTweetsWithGetXAPI } from '../build/getxapi-client.js';

test('searchTweetsWithGetXAPI maps search responses and bearer auth', async () => {
  const previousKey = process.env.GETXAPI_API_KEY;
  const previousBaseUrl = process.env.GETXAPI_BASE_URL;
  process.env.GETXAPI_API_KEY = 'getx_test';
  process.env.GETXAPI_BASE_URL = 'https://api.getxapi.example';

  try {
    const calls = [];
    const fetchImpl = async (url, options) => {
      calls.push({ url: new URL(url), options });
      return jsonResponse({
        data: {
          tweets: [
            {
              id: '456',
              text: 'GetXAPI search result',
              author: { username: 'getxapi' },
              createdAt: '2026-05-31T12:00:00Z',
            },
          ],
        },
        meta: { result_count: 1, next_token: 'cursor-2' },
      });
    };

    const result = await searchTweetsWithGetXAPI({ query: 'agents', count: 10 }, fetchImpl);

    assert.equal(calls[0].url.origin, 'https://api.getxapi.example');
    assert.equal(calls[0].url.pathname, '/twitter/tweet/advanced_search');
    assert.equal(calls[0].url.searchParams.get('q'), 'agents');
    assert.equal(calls[0].url.searchParams.get('limit'), '10');
    assert.equal(calls[0].options.headers.authorization, 'Bearer getx_test');
    assert.deepEqual(result, {
      tweets: [
        {
          id: '456',
          text: 'GetXAPI search result',
          author_id: 'getxapi',
          created_at: '2026-05-31T12:00:00Z',
        },
      ],
      meta: { result_count: 1, next_token: 'cursor-2' },
    });
  } finally {
    restoreEnv('GETXAPI_API_KEY', previousKey);
    restoreEnv('GETXAPI_BASE_URL', previousBaseUrl);
  }
});

test('searchTweetsWithGetXAPI surfaces API errors', async () => {
  const previousKey = process.env.GETXAPI_API_KEY;
  process.env.GETXAPI_API_KEY = 'getx_err';

  try {
    await assert.rejects(
      () => searchTweetsWithGetXAPI({ query: 'agents', count: 10 }, async () => {
        return jsonResponse({ success: false, error: 'quota exceeded' });
      }),
      /quota exceeded/
    );
  } finally {
    restoreEnv('GETXAPI_API_KEY', previousKey);
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
