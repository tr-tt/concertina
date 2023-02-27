import fsp from 'node:fs/promises'
import express from 'express'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173

const templateHtml = isProduction
    ? await fsp.readFile('./dist/client/index.html', 'utf-8')
    : ''
const ssrManifest = isProduction
    ? await fsp.readFile('./dist/client/ssr-manifest.json', 'utf-8')
    : undefined

const app = express()
let vite

if(!isProduction)
{
    const {createServer} = await import('vite')

    vite = await createServer(
        {
            server: {middlewareMode: true},
            appType: 'custom'
        }
    )
  
    app.use(vite.middlewares)
}
else
{
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default

    app.use(compression())
    app.use('/', sirv('./dist/client', {extensions: []}))
}

const routes = (await import('./src/backend/routes/video.routes.js')).default

routes(app)

app.use(
    '*',
    async (req, res) =>
    {
        try
        {
            const url = req.originalUrl

            let template
            let render

            if(!isProduction)
            {
                template = await fsp.readFile('./index.html', 'utf-8')
                template = await vite.transformIndexHtml(url, template)
                render = (await vite.ssrLoadModule('/src/backend/entry.server.jsx')).render
            }
            else
            {
                template = templateHtml
                render = (await import('./dist/server/entry.server.js')).render
            }

            const rendered = await render(url, ssrManifest)

            const html = template
                .replace(`<!--app-head-->`, rendered.head ?? '')
                .replace(`<!--app-html-->`, rendered.html ?? '')

            res.status(200).set({'Content-Type': 'text/html'}).end(html)
        }
        catch (e)
        {
            vite?.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    }
)

app.listen(
    port,
    () =>
    {
        console.log(`Server started at http://localhost:${port}`)
    }
)