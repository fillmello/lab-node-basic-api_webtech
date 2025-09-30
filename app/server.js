require('dotenv').config()

const express = require ('express')
const cors = require('cors');
const path = require ('path')
const app = express ()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/app', express.static (path.join (__dirname, 'public')))

// Mover rotas antes de iniciar o servidor
const apiRouter = require('../api/routes/apiRouter.js')
app.use('/api', apiRouter)

// Iniciar servidor após montar middlewares/rotas
let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})