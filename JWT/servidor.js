const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()

const segredo = 'chave-secreta-super-segura' // 🔒 Mantenha isso seguro!

// Função para gerar o token
function gerarToken(usuario) {
    return jwt.sign({ id: usuario.id, nome: usuario.nome }, segredo, { expiresIn: '1h' })
}

// Middleware para verificar o token
function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1] // Pega o token do header

    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' })
    }

    jwt.verify(token, segredo, (err, decoded) => {
        if (err) {
            return res.status(403).json({ erro: 'Token inválido' })
        }

        req.usuario = decoded // O usuário decodificado fica disponível para as próximas funções
        next()
    })
}

// Exemplo de rota para gerar o token
app.post('/login', (req, res) => {
    const usuario = { id: 1, nome: 'João' } // Exemplo de usuário
    const token = gerarToken(usuario)
    res.json({ token }) // Retorna o token gerado
})

// Rota protegida
app.get('/rota-protegida', verificarToken, (req, res) => {
    res.json({ mensagem: 'Acesso permitido', usuario: req.usuario })
})

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))
