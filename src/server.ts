import express, { type Application } from 'express'
const app: Application = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello devPulse!')
})

app.listen(port, () => {
  console.log(`devPulse app listening on port ${port}`)
})