import test from 'node:test';
import assert from 'node:assert/strict';
import { searchTweetsWithGetXAPI } from '../build/getxapi-client.js';
import { searchTweetsWithXquik } from '../build/xquik-client.js';

function restoreEnv(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

test('searchTweetsWithGetXAPI refuses a non-https base URL before sending the key', async () => {
  const prevKey = process.env.GETXAPI_API_KEY;
  const prevUrl = process.env.GETXAPI_BASE_URL;
  process.env.GETXAPI_API_KEY = 'getx_test';
  process.env.GETXAPI_BASE_URL = 'http://evil.example';
  let fetchCalled = false;
  try {
    await assert.rejects(
      () => searchTweetsWithGetXAPI({ query: 'agents', count: 10 }, async () => {
        fetchCalled = true;
        return new Response('{}', { status: 200 });
      }),
      /https/
    );
    assert.equal(fetchCalled, false);
  } finally {
    restoreEnv('GETXAPI_API_KEY', prevKey);
    restoreEnv('GETXAPI_BASE_URL', prevUrl);
  }
});

test('searchTweetsWithXquik refuses a non-https base URL before sending the key', async () => {
  const prevKey = process.env.XQUIK_API_KEY;
  const prevUrl = process.env.XQUIK_BASE_URL;
  process.env.XQUIK_API_KEY = 'xq_test';
  process.env.XQUIK_BASE_URL = 'http://evil.example';
  let fetchCalled = false;
  try {
    await assert.rejects(
      () => searchTweetsWithXquik({ query: 'agents', count: 10 }, async () => {
        fetchCalled = true;
        return new Response('{}', { status: 200 });
      }),
      /https/
    );
    assert.equal(fetchCalled, false);
  } finally {
    restoreEnv('XQUIK_API_KEY', prevKey);
    restoreEnv('XQUIK_BASE_URL', prevUrl);
  }
});
