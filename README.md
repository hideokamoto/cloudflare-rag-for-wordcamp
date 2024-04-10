## Get started

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
```

|Sercet name|Value|example|
|:--|:--|:--|
|CLOUDFLARE_ACCOUNT_ID|[Read official document](https://developers.cloudflare.com/workers-ai/get-started/rest-api/)||
|CLOUDFLARE_API_TOKEN|[Read official document](https://developers.cloudflare.com/workers-ai/get-started/rest-api/)||
|WORDCAMP_NAME|Target event name|WordCamp Asia 2024 -> `asia`|
|EVENT_YEAR|Target event year|WordCamp Asia 2024 -> `2024`|


### Run this app remoty or deploy it

```bash
% npm run dev

or

% npm run deploy
```
