# tRPC Netlify Functions Adapter

An Adapter to run tRPC Server on Netlify Functions.

## The Problem

When I'm not building with a framework (like NextJS), but into 2 separate pieces of a Client side, and a Backend running
purely with Netlify Serverless Functions, I often run into cases where tRPC's Lambda Adapter cannot be fully used within
the Netlify Handler, because the event object from Netlify and APIGateway Proxy event object isn't the same.

(An example of this is my [Netlify Fullstack Template](https://github.com/samhwang/fullstack-netlify-template))

## The solution

Inspired by [tRPC SvelteKit](https://github.com/icflorescu/trpc-sveltekit) and [tRPC Lambda Adapter](https://trpc.io/docs/aws-lambda),
I have created this adapter to intercept the Netlify event and convert that into a request to a pure Node server
underneath for tRPC to resolve.

## How to use this adapter

Please see [packages/trpc-netlify-functions](./packages/trpc-netlify-functions/README.md)

## Example

A working example can be found in [examples/netlify-example](./examples/netlify-example)
