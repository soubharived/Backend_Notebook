const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();
BASE_URL= process.env.BASE_URL;

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Mynotebook app listening on port http://localhost:${port}`)
  // console.log(`Mynotebook app listening on port ${BASE_URL}`)

})