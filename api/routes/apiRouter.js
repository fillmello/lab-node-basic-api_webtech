const knex = require('knex')({
  client: 'pg',
  debug: true,
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }
});


const express = require ('express')
let apiRouter = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const endpoint = '/'

// (Auth middleware e endpoints extras removidos conforme solicitado)

// GET /api/produtos -> lista todos os produtos (tabela: produto)
apiRouter.get(endpoint + 'produtos', (req, res) => {
  knex.select('*').from('produto')
    .then(produtos => res.status(200).json(produtos))
    .catch(err => {
      res.status(500).json({
        message: 'Erro ao recuperar produtos - ' + err.message
      })
    })
})

// GET /api/produtos/:id -> busca um produto pelo id
apiRouter.get(endpoint + 'produtos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'ID inválido' })
  }
  knex('produto').where({ id }).first()
    .then(produto => {
      if (!produto) return res.status(404).json({ message: 'Produto não encontrado' })
      res.status(200).json(produto)
    })
    .catch(err => {
      res.status(500).json({ message: 'Erro ao recuperar produto - ' + err.message })
    })
})

// POST /api/produtos -> cria um novo produto
apiRouter.post(endpoint + 'produtos', (req, res) => {
  const { descricao, valor, marca } = req.body || {}
  if (!descricao || !marca || typeof valor === 'undefined') {
    return res.status(400).json({ message: 'descricao, valor e marca são obrigatórios' })
  }
  const novo = { descricao, valor, marca }
  knex('produto')
    .insert(novo)
    .returning('*')
    .then(rows => {
      const created = Array.isArray(rows) ? rows[0] : rows
      res.status(201).json(created)
    })
    .catch(err => {
      res.status(500).json({ message: 'Erro ao criar produto - ' + err.message })
    })
})

// PUT /api/produtos/:id -> atualiza um produto
apiRouter.put(endpoint + 'produtos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'ID inválido' })
  }
  const { descricao, valor, marca } = req.body || {}
  const patch = {}
  if (typeof descricao !== 'undefined') patch.descricao = descricao
  if (typeof valor !== 'undefined') patch.valor = valor
  if (typeof marca !== 'undefined') patch.marca = marca
  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ message: 'Nenhum campo para atualizar' })
  }
  knex('produto')
    .where({ id })
    .update(patch)
    .returning('*')
    .then(rows => {
      if (!rows || rows.length === 0) return res.status(404).json({ message: 'Produto não encontrado' })
      const updated = Array.isArray(rows) ? rows[0] : rows
      res.status(200).json(updated)
    })
    .catch(err => {
      res.status(500).json({ message: 'Erro ao atualizar produto - ' + err.message })
    })
})

// DELETE /api/produtos/:id -> remove um produto
apiRouter.delete(endpoint + 'produtos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'ID inválido' })
  }
  knex('produto')
    .where({ id })
    .del()
    .then(count => {
      if (count === 0) return res.status(404).json({ message: 'Produto não encontrado' })
      res.status(204).send()
    })
    .catch(err => {
      res.status(500).json({ message: 'Erro ao remover produto - ' + err.message })
    })
})

// POST /api/seguranca/login -> autentica e retorna JWT (apenas o solicitado)
apiRouter.post(endpoint + 'seguranca/login', (req, res) => {
  knex
    .select('*').from('usuario').where({ login: req.body.login })
    .then(usuarios => {
      if (usuarios.length) {
        let usuario = usuarios[0]
        let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha)
        if (checkSenha) {
          var tokenJWT = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, { expiresIn: 3600 })
          res.status(200).json({
            id: usuario.id,
            login: usuario.login,
            nome: usuario.nome,
            roles: usuario.roles,
            token: tokenJWT
          })
          return
        }
      }
      res.status(200).json({ message: 'Login ou senha incorretos' })
    })
    .catch(err => {
      res.status(500).json({ message: 'Erro ao verificar login - ' + err.message })
    })
})

module.exports = apiRouter;