import { ChatCloudflareWorkersAI, CloudflareWorkersAI, CloudflareWorkersAIEmbeddings, CloudflareVectorizeStore } from "@langchain/cloudflare";
import { Bindings } from "../lib/hono";

export const initModels = (bindings: Bindings, indexName: keyof Pick<Bindings, 'VECTORIZE_SESSIONS_INDEX'> = 'VECTORIZE_SESSIONS_INDEX') => {
    const embeddings = new CloudflareWorkersAIEmbeddings({
      binding: bindings.AI,
      modelName: "@cf/baai/bge-large-en-v1.5",
    });
    const vectorStore = new CloudflareVectorizeStore(embeddings, {
      index: bindings[indexName]
    });
    const llmCloudflare = new CloudflareWorkersAI({
      model: "@cf/meta/llama-2-7b-chat-int8",
      cloudflareAccountId: bindings.CLOUDFLARE_ACCOUNT_ID,
      cloudflareApiToken: bindings.CLOUDFLARE_API_TOKEN,
    });
    const chatCloudflare = new ChatCloudflareWorkersAI({
      model: "@hf/thebloke/neural-chat-7b-v3-1-awq",
      cloudflareAccountId: bindings.CLOUDFLARE_ACCOUNT_ID,
      cloudflareApiToken: bindings.CLOUDFLARE_API_TOKEN,
      cache: false,
    });

    return {
        embeddings,
        vectorStore,
        llm: llmCloudflare,
        chat: chatCloudflare,
    }
}