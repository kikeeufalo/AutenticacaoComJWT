document.getElementById("cadastro").addEventListener("submit", async function(event) {
    event.preventDefault()

    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const password = document.getElementById("senha").value

    try {
        const res = await fetch("http://localhost:3000/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, password })
        })

        const data = await res.json()

        if (res.ok) {
            alert("Cadastro realizado! Agora faça login.")
            window.location.href = "pag/entrar.html"
        } else {
            document.getElementById("mensagem").innerText = data.message
        }
    } catch (error) {
        console.log("Erro:", error)
    }
})
