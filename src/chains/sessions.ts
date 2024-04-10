import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableMap, RunnableSequence } from 'langchain/runnables';
import { ChatPromptTemplate } from 'langchain/prompts';
import { HydeRetriever } from 'langchain/retrievers/hyde';
import { Document } from "langchain/document";
import { Bindings } from "../lib/hono";
import { initModels } from "../lib/llm";

function distinctDocuments(documents: Array<Document>): Array<Document> {
    const uniqueArticles: Array<Document> = [];
    const seenIds = new Set();
  
    for (const article of documents) {
      if (!seenIds.has(article.metadata.id)) {
        uniqueArticles.push(article);
        seenIds.add(article.metadata.id);
      }
    }
  
    return uniqueArticles;
}


export const createSessionChain = (bindings: Bindings) => {
    const {
        vectorStore,
        llm,
        chat
    } = initModels(bindings, 'VECTORIZE_SESSIONS_INDEX')
    const retriever = new HydeRetriever({
      vectorStore,
      llm,
      k: 10,
    });
    const generateAnswerChain = RunnableSequence.from([
      {
        context: async input => {
            const relevantDocuments = await retriever.getRelevantDocuments(input.question)
            return relevantDocuments
        },
        question: input => input.question,
      },
      RunnableMap.from({
        sessions: input => {
          const sessions = distinctDocuments(input.context)
          return sessions.map((session: Document) => {
                return session.metadata
          })
        },
        answer: RunnableSequence.from([{
                context: input => input.context.map((sesison: Document) => sesison.pageContent).join('\n'),
                question: input => input.question,
            },
            ChatPromptTemplate.fromMessages([
            [
                "system",
                `Imagine you are helping someone gather detailed information about specific sessions at an event. 
    Answer the question based on only the following context:
    
    {context}
    
    The context provided includes detailed information for multiple sessions of an event, such as titles, scheduled dates and times, speakers' names, and in-depth descriptions of the sessions. This information aims to assist in identifying sessions that are closely related to each other or to specific topics of interest. Based on the detailed session information provided, you are to offer comprehensive responses that highlight not only individual sessions but also how they might relate or complement each other. This will help the user to make informed decisions about which sessions to attend, enabling them to maximize the relevance and benefit of their attendance based on their specific interests and the content's relevance.`,
            ],
            ["human", "{question}"],
            ]),
            chat,
            new StringOutputParser()
        ])
      }),
    ])
    return generateAnswerChain
}
