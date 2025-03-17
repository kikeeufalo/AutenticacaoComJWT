document.getElementById('login').addEventListener('submit', async function (event) {
    event.preventDefault() // evita o carregamento da pagina

    const email = document.getElementById('nome-email').value
    const password = document.getElementById('senha').value

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()
        if (res.ok) {
            localStorage.setItem("token", data.token) // Salvando o token
            window.location.href = '../pag/perfil.html'
        } else {
            alert("Erro: " + data.message)
        }
    } catch (error) {
        console.log('Erro:', error)
    }


})