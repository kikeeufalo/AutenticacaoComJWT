const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const cors = require("cors")
const app = express()
app.use(express.json())

const users = [] // Simulando um banco de dados

// Configuração do CORS
app.use(cors({
    origin: '*', // Permite qualquer origem (para testes ou desenvolvimento)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite os métodos necessários
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}))

// Rota para criar uma conta
app.post("/registro", async (req, res) => {
    const { nome, email, password } = req.body

    // Verifica se o usuário já existe
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: "E-mail já cadastrado" })
    }

    // Criptografando a senha antes de salvar
    const senhaCriptografada = await bcrypt.hash(password, 10)

    // Salvando o usuário com um ID gerado automaticamente
    const novoUsuario = { id: users.length + 1, nome, email, password: senhaCriptografada }
    users.push(novoUsuario)

    res.status(201).json({ message: "Usuário registrado com sucesso" })
})

// Rota de login
app.post("/login", async (req, res) => {
    const { email, password } = req.body

    console.log('Requisição de login recebida:')
    console.log('Email ou Nome:', email)
    console.log('Senha:', password)

    // Encontra o usuário pelo email ou nome
    const user = users.find(u => u.email === email || u.nome === email)

    console.log('Usuário encontrado:', user)

    // Verifica se o usuário existe
    if (!user) {
        console.log('Usuário não encontrado', users)
        return res.status(401).json({ message: "Credenciais inválidas" })
    }

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciais inválidas" })
    }

    // Criando o token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })

    // Respondendo com o token
    res.json({ token })
})
 

// Middleware de autenticação
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    console.log(token)
    if (!token) return res.status(401).json({ message: "Token não fornecido" })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({ message: "Token inválido" })
    }
} 

// Rota protegida
app.get("/perfil", verifyToken, (req, res) => {
    res.json({ message: "Perfil do usuário", user: req.user })
})

app.listen(3000, () => console.log("Servidor rodando na porta 3000"))
