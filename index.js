const connectToMongo=require('./db')
const dotenv = require('dotenv')
dotenv.config()
connectToMongo()
var cors = require('cors')
const express = require('express')
const app = express()
 


const port = process.env.PORT 
app.use(express.json())

app.use(cors())
//Availabel Routes
app.use('/api/auth', require('./routes/auth') )
app.use('/api/notes', require('./routes/notes') )

app.listen(port, () => {
  console.log(`iNotebook backend is running at http://localhost:${port}`)
})