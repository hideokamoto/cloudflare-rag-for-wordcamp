import { CloudflareVectorizeStore } from "@langchain/cloudflare";
import { Bindings } from "./hono";
import { Document } from "langchain/document";
import { Embeddings } from "langchain/embeddings/base";


export class WordCampVectorStore {
    private readonly vectorStore: CloudflareVectorizeStore;
    constructor(
        private readonly context: Pick<Bindings, "VECTORIZE_SESSIONS_INDEX">,
        embeddings: Embeddings,
    ) {
        this.vectorStore = new CloudflareVectorizeStore(embeddings, {
            index: this.context.VECTORIZE_SESSIONS_INDEX
          })
    }
    public async putDocuments( documents: Document[], indexes: string[]): Promise<void> {
        await this.vectorStore.addDocuments(documents, { ids: indexes });
    }
    public async addNewDocuments( documents: Document[], indexes: string[]): Promise<void> {
        const vectors = await this.context.VECTORIZE_SESSIONS_INDEX.getByIds(indexes)
        const newDocuments = documents.filter(doc => {
            const documentIfExist = vectors.find(vector => vector.metadata?.id === doc.metadata.id)
            return !documentIfExist
        })
        await this.vectorStore.addDocuments(newDocuments, { ids: indexes });
    }
}