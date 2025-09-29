require('dotenv').config()

const express = require ('express')
const cors = require('cors');
const path = require ('path')
const app = require('../server')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/app', express.static (path.join (__dirname, '/public')))

//ouvir porta localmente
let port = process.env.PORT || 3000

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server rodando em http://localhost:${port}`)
  })
}

// Exporta um handler compatível com Vercel
module.exports = (req, res) => app(req, res)