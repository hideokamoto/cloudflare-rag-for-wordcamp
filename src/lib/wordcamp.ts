import { Session } from "../types";
import { Bindings } from "./hono";

export const getFromWordCampWPAPI = async (event: Pick<Bindings, 'WORDCAMP_NAME' | 'EVENT_YEAR'>, path: string) => {
    return fetch(`https://${event.WORDCAMP_NAME.toLocaleLowerCase()}.wordcamp.org/${event.EVENT_YEAR}/wp-json/${path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'cfworkers'
        }
    }).then(data => data.json())
    .catch(e => {
        console.log(e)
        throw e
    })
}

export const getSessions = async (event: Pick<Bindings, 'WORDCAMP_NAME' | 'EVENT_YEAR'>, query?: {[key: string]: string | number}): Promise<Session[]> => {
    const requestQuery = new URLSearchParams("")
    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            requestQuery.append(key, value.toString())
        })
    }
    const result = await getFromWordCampWPAPI(event, `wp/v2/sessions?_fields=id,title,meta,excerpt,content,session_date_time,session_speakers,link,.meta&${requestQuery.toString()}`)
    return result as Session[]
}
