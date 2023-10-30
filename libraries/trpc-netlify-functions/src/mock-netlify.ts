import { faker } from '@faker-js/faker';
import { Context, HandlerContext, HandlerEvent } from '@netlify/functions';
import { vi } from 'vitest';

interface MockHandlerEventOptions extends Partial<HandlerEvent> {
  body: string;
  path: string;
  httpMethod: string;
  headers: Record<string, string>;
  queryStringParameters: Record<string, string>;
  isBase64Encoded?: boolean;
}

export function getMockHandlerEvent({ body, path, httpMethod, headers, queryStringParameters, isBase64Encoded }: MockHandlerEventOptions): HandlerEvent {
  return {
    body,
    path,
    httpMethod,
    headers,
    queryStringParameters,
    isBase64Encoded: isBase64Encoded ?? false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    rawQuery: '',
    rawUrl: '',
  };
}

export function getMockHandlerContext(): HandlerContext {
  return {
    awsRequestId: 'asdfasdf1234',
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'fake',
    functionVersion: 'fake',
    invokedFunctionArn: 'fake',
    logGroupName: 'fake',
    logStreamName: 'fake',
    memoryLimitInMB: 'fake',
    done: vi.fn(),
    fail: vi.fn(),
    succeed(_messageOrObject: unknown, _object?: unknown): void {},
    getRemainingTimeInMillis(): number {
      return 10000;
    },
  };
}

interface MockRequestOptions extends Partial<Request> {}

export function getMockRequest(options: MockRequestOptions): Request {
  throw new Error('Not implemented')
}

export function getMockContext(): Context {
  return {
    account: { id: 'fke' },
    cookies: {
      delete: vi.fn(),
      get: vi.fn(),
      set: vi.fn()
    },
    deploy: { id: 'fake' },
    geo: {
      city: 'fake',
      country: {},
      subdivision: {},
    },
    ip: '127.0.0.1',
    json: vi.fn(),
    log: vi.fn(),
    next: vi.fn(),
    params: {},
    requestId: 'fake',
    rewrite: vi.fn(),
    server: { region: 'local' },
    site: { id: undefined, name: undefined, url: 'http://localhost:8888' }
  }
}
