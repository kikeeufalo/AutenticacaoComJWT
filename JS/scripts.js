const x = document.querySelector('#input-entrar')

x.addEventListener('click', function() {
    async function login() {
        const resposta = await fetch('http://localhost:3000/login', {
            method: 'POST'
        })
        const dados = await resposta.json()
        const token = dados.token
        console.log('Token:', token) // Guarde o token para usar nas próximas requisições
        acessarRotaProtegida(token) // Chama a função para acessar a rota protegida após obter o token
    }

    async function acessarRotaProtegida(token) {
        const resposta = await fetch('http://localhost:3000/rota-protegida', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Envia o token no cabeçalho Authorization
            }
        })

        const dados = await resposta.json()
        console.log(dados) // Exibe a resposta da rota protegida
    }

    login() // Chama a função de login ao clicar no botão
})
