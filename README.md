# AI powered session recommendation application for WordCamp

It's a simple demo RAG application for the WordCamp organizers.
We can easy to create a new RAG application to get a recommendation about the session on the WordCamp that you're getting involved in.

<img width="841" alt="スクリーンショット 2024-04-10 23 25 17" src="https://github.com/hideokamoto/cloudflare-rag-for-wordcamp/assets/6883571/2a665576-6bdf-49b6-b4dc-d192c6b5ee62">



## Get started

### Requirement

You must have a active Cloudflare account.
And please subscribe the `Workers Paid` plan before delpoy this.

https://www.cloudflare.com/plans/developer-platform/#overview

### Download source code

```bash
% git clone git@github.com:hideokamoto/cloudflare-rag-for-wordcamp.git
% cd cloudflare-rag-for-wordcamp
% npm install
```

### Setup Cloudflare AI resources

```bash
% npx wrangler vectorize create wordcamp-sessions --dimensions=1024 --metric=cosine
```

### Put environment variable

```bash
% npx wrangler secret put CLOUDFLARE_ACCOUNT_ID
% npx wrangler secret put CLOUDFLARE_API_TOKEN
% npx wrangler secret put WORDCAMP_NAME
% npx wrangler secret put EVENT_YEAR
% npx wrangler secret put ADMIN_USERNAME
% npx wrangler secret put ADMIN_PASSWORD
```

|Sercet name|Value|example|
|:--|:--|:--|
|CLOUDFLARE_ACCOUNT_ID|[Read official document](https://developers.cloudflare.com/workers-ai/get-started/rest-api/)||
|CLOUDFLARE_API_TOKEN|[Read official document](https://developers.cloudflare.com/workers-ai/get-started/rest-api/)||
|WORDCAMP_NAME|Target event name|WordCamp Asia 2024 -> `asia`|
|EVENT_YEAR|Target event year|WordCamp Asia 2024 -> `2024`|
|ADMIN_USERNAME|Basic Authentication for indexing API|`admin`|
|ADMIN_PASSWORD|Basic Authentication for indexing API|`password`|


### Run this app remoty or deploy it

```bash
% npm run dev

or

% npm run deploy
```

## Craete the 1st index

### Make sure the application URL

On the following example, the application URL is `http://localhost:49705``.
```bash
% wrangler dev src/index.tsx --remote
 ⛅️ wrangler 3.48.0
-------------------
Using vars defined in .dev.vars
Your worker has access to the following bindings:
[wrangler:inf] Ready on http://localhost:49705
```

### Visit the force indexing page

Please visit the `{YOUR_APPLICATION_URL}/api/indexes`.
For example, if the application URL is `http://localhost:49705`, you should visit to `http://localhost:49705/api/indexes`.

The page is proctected by the BASIC Authentication. Please put the username and password that you set before.
