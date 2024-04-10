import { Document } from "langchain/document";

export type Session = {
    content: {
        protected: boolean;
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    id: number;
    title: {
        rendered: string;
    }
    meta: {
        _wcpt_session_type: string;
    };
    session_date_time: {
        date: string;
        time: string;
    }
    session_speakers: Array<{
        name: string;
    }>
    link: string;
}
export type SessionIndexRequestInput = {
    documents: Document[];
    indexes: string[];
}