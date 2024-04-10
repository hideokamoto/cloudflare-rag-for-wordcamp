import { html } from 'hono/html'
import { renderer } from './renderer'
import { Bindings, createHonoApp } from './lib/hono'
import { createSessionChain } from './chains/sessions'
import { streamText } from 'hono/streaming'
import { cors } from 'hono/cors'
import { updateSessionIndex } from './indexes/session'
import { basicAuth } from 'hono/basic-auth'

const app = createHonoApp()

app.use(renderer)

app.use('/api/indexes', cors())
app.all(
  '/api/indexes', 
  async (c, next) => {
    const auth = basicAuth({
      username: c.env.ADMIN_USERNAME,
      password: c.env.ADMIN_PASSWORD,
    })
    return auth(c, next)
  }
)
app.get('/api/indexes', async c => {
  await updateSessionIndex(c.env, {
    fourceUpdate: true,
  })
  return c.text("Put all session content")
})
app.get('/', (c) => {
  return c.render(
    <main>
      <section>
        <h2>You</h2>
        <form id="input-form" autocomplete="off" method="post">
          <input
            type="text"
            name="query"
            style={{
              width: '100%'
            }}
          />
          <button type="submit">Send</button>
        </form>
        <h2>AI</h2>
        <pre
          id="ai-content"
          style={{
            'white-space': 'pre-wrap'
          }}
        ></pre>
        <ul id="ai-resources"></ul>
      </section>
      <section>
        <h2>About</h2>
        <p>This is a demo application of RAG(Retrieval Augmented Generation) for WordCamp {c.env.WORDCAMP_NAME} {c.env.EVENT_YEAR}.</p>
        <p>You can ask about this AI about the session in WordCamp {c.env.WORDCAMP_NAME} {c.env.EVENT_YEAR}</p>
        <p>Since the search accuracy is only <strong>60-70%</strong>, which is <strong>not very high</strong>, please use the answers provided as a reference only.。</p>
      </section>
            {html`
          <script>
          document.addEventListener('DOMContentLoaded', function () {
            document.getElementById('input-form').addEventListener('submit', function (event) {
              event.preventDefault()
              const formData = new FormData(event.target)
              const query = formData.get('query')
              fetchChunked(query)
            })
          })
          async function fetchChunked(query) {
            const target = document.getElementById('ai-content')
            const resource = document.getElementById("ai-resources")
            resource.innerHTML = ''
            target.innerHTML = 'loading...'

            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: {
                  'content-type': 'application/json'
                },
                body: JSON.stringify({ query })
            })
            const reader = response.body.getReader()
            let decoder = new TextDecoder()
            reader.read().then(function processText({ done, value }) {
              if (done) {
                return
              }
              if (target.innerHTML === 'loading...') {
                target.innerHTML = ''
              }
              const data = decoder.decode(value)
              const jsonArray = JSON.parse("[" + data.replace(/}{/g, "},{") +"]")

              jsonArray.forEach(data => {
                if (data.answer) {
                  target.innerHTML += data.answer
                } else if (data.sessions) {
                  data.sessions.forEach(session => {
                    resource.innerHTML += '<li><a href="' + session.url + '" target="_blanck" rel="noopener noreferrer">' + session.title + "</a></li>"
                  })
                }      
              })


              return reader.read().then(processText)
            })


          }
          </script>
        `}
    </main>,
    {
      title: `WordCamp ${c.env.WORDCAMP_NAME} ${c.env.EVENT_YEAR} Sessions AI (Beta)`
    }
  )
})

app.post('/api/ask', async c => {
  const {query:question} = await c.req.json<{
      query: string
  }>()
  const chain = createSessionChain(c.env)
  const answerStream = await chain.stream({question})
  return streamText(c, async (stream) => {
      for await (const s of answerStream) {
          await stream.write(JSON.stringify(s))
          await stream.sleep(10)
      }
  })
})

const scheduled: ExportedHandlerScheduledHandler<Bindings> = async (event, env, ctx) => {
  await updateSessionIndex(env, {
    fourceUpdate: false,
  })
}
export default {
  fetch: app.fetch,
  scheduled
}