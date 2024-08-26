const connectToMongo=require('./db')
const dotenv=require('dotenv')
dotenv.config()

connectToMongo()
var cors = require('cors')
const express = require('express')
const app = express()
 


const port = process.env.PORT || 5000;
app.use(express.json())

app.use(cors())
//Availabel Routes
app.use('/api/auth', require('./routes/auth') )
app.use('/api/notes', require('./routes/notes') )

if(process.env.NODE_ENV = "production"){
  app.use(express.static("client/build"))
}

app.listen(port, () => {
  console.log(`iNotebook backend is running at http://localhost:${port}`)
})