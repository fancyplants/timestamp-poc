import * as express from 'express'
import * as bodyParser from 'body-parser'

interface BasicSession {
  endStamp: string;
  startStamp: string;
}

let globalSesh: BasicSession = {
  endStamp: '0',
  startStamp: '0'
}

async function main() {
  const app = express()
  app.use(bodyParser.json())

  app.get('/session', (req, res) => {
    res.send(globalSesh)
  });

  app.post('/session', (req, res) => {
    globalSesh = req.body
    res.end('hello')
    console.log(`Saved value: ${JSON.stringify(globalSesh, null, 4)}`)
  })

  app.listen(3001)
}

main()
