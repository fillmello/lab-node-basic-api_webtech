const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// serve /app/public
app.use('/app', express.static(path.join(__dirname, '..', 'app', 'public')))

// usa as rotas existentes do projeto
const apiRouter = require('./routes/api_routes.js')
app.use('/api', apiRouter)

// handler da Serverless Function
module.exports = (req, res) => app(req, res)
