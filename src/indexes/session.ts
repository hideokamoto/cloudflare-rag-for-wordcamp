import { createDocumentBySessions } from "../lib/documents"
import { Bindings } from "../lib/hono"
import { WordCampVectorStore } from "../lib/vectorStore"
import { getSessions } from "../lib/wordcamp"
import { initModels } from "../lib/llm"

export const updateSessionIndex = async (bindings: Bindings, options: {
    fourceUpdate: boolean
} = {
    fourceUpdate: false,
}) => {
    const { embeddings } = initModels(bindings)
    const vectorStore = new WordCampVectorStore(bindings, embeddings)
    const sessions = await getSessions(bindings)
    const {
        documents,
        indexes,
    } = await createDocumentBySessions(sessions)
    if (options.fourceUpdate) {
        await vectorStore.putDocuments(documents, indexes)
    } else {
        await vectorStore.addNewDocuments(documents, indexes)
    }
    console.log(([`create ${documents.length} documents`]))
}