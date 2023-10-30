import { Config, Context } from '@netlify/functions';

async function test(request: Request, context: Context) {
  console.log('REQUEST');
  console.log(request);
  return new Response('Hello World!');
}

export default test;

export const config: Config = {
  path: '/api/v2-with-config/*',
};
