import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { Session, SessionIndexRequestInput } from "../types";

const splitter = RecursiveCharacterTextSplitter.fromLanguage('html', {
    chunkSize: 400,
    chunkOverlap: 100,
    keepSeparator: true,
    separators: ['\n', '。']
});
export const createDocumentBySessions = async (sessions: Session[]): Promise<SessionIndexRequestInput> => {
    const sessionsDocuments: Array<Document> = []
    const sessiontIndexes: string[] = []
    for await (const session of sessions) {
        if (session.content.protected) continue
        if (session.meta._wcpt_session_type !== 'session') continue
        const content = session.content.rendered
            .replace(/<[^>]*>/g, '')
            .replace(/\n/g, '')
        const splittedTexts = await splitter.splitText(content)
        const sessionHeaderText = [
            `# ${session.title.rendered}\n`,
            `- Session date time: ${session.session_date_time.date} ${session.session_date_time.time}`,
            `- Session speaker: ${session.session_speakers.map(speaker => speaker.name).join(',')}`,
        ].join('\n')
        const docsMetadata = {
          id: session.id.toString(),
          title: session.title.rendered,
          url: session.link
        }
        splittedTexts.forEach((text, i) => {
            const pageContent =  `${sessionHeaderText}\n- Session Detail-${i + 1}: ${text}`
            const doc = new Document({
                pageContent,
                metadata: docsMetadata
            })
            sessionsDocuments.push(doc)
            sessiontIndexes.push(`${session.id}:${i + 1}`)
        })
    }

    return {
        documents: sessionsDocuments,
        indexes: sessiontIndexes,
    }
}
