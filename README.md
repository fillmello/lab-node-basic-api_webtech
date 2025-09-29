#   

> **API RESTful com BD, Segurança e Docker**

Uma API RESTful completa para operações CRUD com segurança integrada baseada em tokens JWT (JSON Web Token), banco de dados PostgreSQL e suporte ao Docker.

![JavaScript](https://img.shields.io/badge/javascript-91.6%25-yellow)
![HTML](https://img.shields.io/badge/html-4.5%25-orange)
![Dockerfile](https://img.shields.io/badge/dockerfile-3.5%25-blue)
![CSS](https://img.shields.io/badge/css-0.4%25-purple)

---

## 📋 Sobre o Projeto

Este projeto implementa uma API RESTful completa com as seguintes características:

- **CRUD de Produtos**: Operações completas de Create, Read, Update e Delete
- **Sistema de Autenticação**: Login/Register com JWT tokens
- **Controle de Acesso**: Roles de usuário (USER/ADMIN) com diferentes permissões
- **Banco de Dados**: PostgreSQL com Knex.js para queries
- **Segurança**: Senhas criptografadas com bcrypt
- **Interface Web**: Cliente estático para consumo da API
- **Deploy Ready**: Preparado para Heroku com Docker support

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Knex.js** - Query builder SQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Variáveis de ambiente

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização
- **JavaScript** - Interatividade

### DevOps
- **Docker** - Containerização
- **Heroku** - Deploy em nuvem
- **Git** - Controle de versão

---

## 📁 Estrutura do Projeto

```
├── api/
│   └── routes/
│       └── apiRouter.js      # Rotas da API
├── public/                   # Arquivos estáticos
│   ├── index.html           # Página principal
│   ├── app.js              # JavaScript do cliente
│   └── style.css           # Estilos CSS
├── server.js               # Servidor Express
├── package.json           # Dependências do projeto
├── .gitignore            # Arquivos ignorados pelo Git
├── .env                  # Variáveis de ambiente (local)
├── Dockerfile           # Configuração Docker
└── README.md           # Documentação
```

---

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- PostgreSQL
- Git

### Passo 1: Clone o repositório
```bash
git clone https://github.com/seu-usuario/node-basic-api.git
cd node-basic-api
```

### Passo 2: Instalar dependências
```bash
npm install
# ou
yarn install
```

**Dependências principais:**
```bash
npm install express dotenv knex pg bcryptjs jsonwebtoken cors --save
```

### Passo 3: Configurar banco de dados
1. Crie um banco PostgreSQL
2. Configure as variáveis de ambiente no arquivo `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
SECRET_KEY=sua_chave_secreta_jwt
```

### Passo 4: Executar scripts SQL
Execute os scripts de criação das tabelas:

**Tabela de Produtos:**
```sql
CREATE SEQUENCE produto_id_seq;
CREATE TABLE produto (
    id int4 NOT NULL DEFAULT nextval('produto_id_seq'),
    descricao varchar(200) NOT NULL,
    valor numeric NOT NULL DEFAULT 0,
    marca varchar(100) NULL,
    CONSTRAINT produto_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX produto_id_idx ON public.produto USING btree (id);
```

**Tabela de Usuários:**
```sql
CREATE SEQUENCE usuario_id_seq;
CREATE TABLE public.usuario (
    id int NOT NULL DEFAULT nextval('usuario_id_seq'),
    nome varchar(200) NOT NULL,
    email varchar(100) NOT NULL,
    login varchar(100) NOT NULL,
    senha varchar(100) NOT NULL,
    roles varchar (200) NOT NULL DEFAULT 'USER',
    CONSTRAINT usuario_pk PRIMARY KEY (id)
);
```

### Passo 5: Executar a aplicação
```bash
npm start
# ou para desenvolvimento
nodemon server.js
```

A aplicação estará disponível em: `http://localhost:3000/app/`

---

## � Endpoints da API

### Produtos
| Método | URL | Descrição | Autenticação |
|--------|-----|-----------|--------------|
| GET | `/api/produtos` | Listar todos os produtos | JWT Token |
| GET | `/api/produtos/:id` | Obter produto específico | JWT Token |
| POST | `/api/produtos` | Criar novo produto | JWT Token + ADMIN |
| PUT | `/api/produtos/:id` | Atualizar produto | JWT Token + ADMIN |
| DELETE | `/api/produtos/:id` | Excluir produto | JWT Token + ADMIN |

### Segurança
| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/api/seguranca/register` | Registrar novo usuário |
| POST | `/api/seguranca/login` | Fazer login |

---

## 🔐 Autenticação e Autorização

### Sistema de Roles
- **USER**: Pode consultar produtos (GET)
- **ADMIN**: Pode realizar todas as operações (GET, POST, PUT, DELETE)

### Uso da API com Token
1. Faça login para obter o token:
```bash
curl -X POST http://localhost:3000/api/seguranca/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"1234"}'
```

2. Use o token nas requisições:
```bash
curl -X GET http://localhost:3000/api/produtos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🐳 Docker

### Executar com Docker
```bash
# Build da imagem
docker build -t node-basic-api .

# Executar container
docker run -p 3000:3000 --env-file .env node-basic-api
```

### Docker Compose (exemplo)
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/apidb
      - SECRET_KEY=minha_chave_secreta
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: apidb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
```

---

## 🚀 Deploy no Heroku

### Passo 1: Criar aplicação no Heroku
```bash
heroku apps:create seu-app-nome
```

### Passo 2: Adicionar PostgreSQL
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### Passo 3: Configurar variáveis de ambiente
```bash
heroku config:set SECRET_KEY=sua_chave_secreta
```

### Passo 4: Deploy
```bash
git add .
git commit -m "Deploy inicial"
git push heroku main
```

---

## 🧪 Testes

### Testando os endpoints manualmente

**Login:**
```bash
curl -X POST https://seu-app.herokuapp.com/api/seguranca/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"1234"}'
```

**Listar produtos:**
```bash
curl -X GET https://seu-app.herokuapp.com/api/produtos \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Criar produto (apenas ADMIN):**
```bash
curl -X POST https://seu-app.herokuapp.com/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"descricao":"Novo Produto","valor":10.50,"marca":"Marca X"}'
```

---

## 🔧 Desenvolvimento

### Instalação do Nodemon (recomendado)
```bash
npm install -g nodemon
```

### Executar em modo de desenvolvimento
```bash
nodemon server.js
```

### Estrutura de desenvolvimento recomendada
```
├── api/
│   ├── controllers/     # Lógica de negócio
│   ├── middleware/      # Middlewares customizados
│   ├── models/         # Modelos de dados
│   └── routes/         # Definição de rotas
├── config/             # Configurações
├── database/           # Migrations e seeds
├── public/            # Arquivos estáticos
├── tests/             # Testes automáticos
└── utils/             # Utilitários
```

---

## 📋 Dados Iniciais

### Usuários padrão
- **Admin**: login=`admin`, senha=`1234`
- **User**: login=`user`, senha=`1234`

### Produtos de exemplo
- Arroz parboilizado 5Kg - R$ 25,00 - Tio João
- Maionese 250gr - R$ 7,20 - Helmanns
- Iogurte Natural 200ml - R$ 2,50 - Itambé
- Nescau 400gr - R$ 8,00 - Nestlé
- Batata Palha 180gr - R$ 5,20 - Chipps

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## � Contato

Seu Nome - [@seu_twitter](https://twitter.com/seu_twitter) - email@exemplo.com

Link do Projeto: [https://github.com/seu-usuario/node-basic-api](https://github.com/seu-usuario/node-basic-api)

---

## 🙏 Agradecimentos

- [Express.js](https://expressjs.com/) - Framework web
- [Knex.js](https://knexjs.org/) - Query builder
- [JWT.io](https://jwt.io/) - Tokens JWT
- [Heroku](https://heroku.com/) - Plataforma de deploy
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados

---

**⭐ Não se esqueça de dar uma estrela no projeto se ele foi útil para você!**

