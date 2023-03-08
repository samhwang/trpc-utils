import { HandlerContext, HandlerEvent } from '@netlify/functions';

interface MockEventOptions extends Partial<HandlerEvent> {
  body: string;
  path: string;
  httpMethod: string;
  headers: Record<string, string>;
  queryStringParameters: Record<string, string>;
  isBase64Encoded?: boolean;
}

export function mockHandlerEvent({
  body,
  path,
  httpMethod,
  headers,
  queryStringParameters,
  isBase64Encoded,
}: MockEventOptions): HandlerEvent {
  return {
    body,
    path,
    httpMethod,
    headers,
    queryStringParameters,
    isBase64Encoded: isBase64Encoded ?? false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    netlifyGraphToken: undefined,
    rawQuery: '',
    rawUrl: '',
  };
}

export function mockHandlerContext(): HandlerContext {
  return {
    awsRequestId: 'asdfasdf1234',
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'fake',
    functionVersion: 'fake',
    invokedFunctionArn: 'fake',
    logGroupName: 'fake',
    logStreamName: 'fake',
    memoryLimitInMB: 'fake',
    done(_error?: Error, result?: any): void {},
    fail(_error: Error | string): void {},
    getRemainingTimeInMillis(): number {
      return 10000;
    },
    succeed(_messageOrObject: any, _object?: any): void {},
  };
}
