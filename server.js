// FILE: server.js
//
// Call examples:
/*
curl --silent --include "http://localhost:8078/api/v1/user"
curl --silent --include "http://localhost:8078/api/v1/user/query?firstName=John&lastName=Doe&city=Tampere&address=Tamperetie"
curl --silent --include --request POST --header "Content-Type: application/json" --data '{"firstName":"joe","lastName":"doe","city":"tampere","address":"tamperetie","teamName":"f","pay":60000}' "http://localhost:8078/api/v1/user"
curl --silent --include --request DELETE "http://localhost:8078/api/v1/user/6"
curl --silent --include --request PUT --header "Content-Type: application/json" --data '{"firstName":"Joan"}' "http://localhost:8078/api/v1/user/2"
curl --silent --include "http://localhost:8078/api/v1/user"
*/

require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const httpStatusCode = require('./httpStatusCode')

const app = express()
const PORT = process.env.PORT || 8079

app.use(express.json()) // json format
app.use('/api', routes) // use defined routes

app.use((req, res) => { // default respond
  res.status(httpStatusCode.HTTP_NOT_FOUND).json({ error: 'Content Not Found' })
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
