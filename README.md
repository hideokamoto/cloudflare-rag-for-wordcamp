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