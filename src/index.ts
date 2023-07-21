import express from 'express'

const app = express()
const router = express.Router()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded())

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})

type IGResponse = {
  graphql: {
    shortcode_media: {
      display_resources: {
        src: string
      }[]
    }
  }
}

// const getIGPostImgSRCs = async ({ postUrl }: { postUrl: string }) => {
//   const url = new URL(postUrl)
//   const res = await fetch(
//     url.origin + url.pathname + '?' + process.env.SECRET_QUERY_STRING,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }
//   )
//   const data = (await res.json()) as IGResponse
//   return {
//     urls:
//       data?.graphql?.shortcode_media.display_resources.map(
//         (resource) => resource.src
//       ) || [],
//     raw: data,
//   }
// }

// Handle GET requests to the root URL
router.get('/post', async (req, res) => {
  const postUrl = req.query.post_url as string
  if (!postUrl) {
    res.status(400).send('No URL specified')
  }
  // const imgUrls = await getIGPostImgSRCs({ postUrl })
  const url = new URL(postUrl)
  const imgUrls = await fetch(url.origin + url.pathname + 'media?size=l')
  const data = imgUrls.blob()
  res.send(data)
})

app.use(router)

app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})
