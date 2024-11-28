// Arquivo: js/auth.js

// Função para verificar se o usuário está logado e redirecionar, se necessário
function checkLoginStatus() {
    fetch("/api/isLoggedIn")
        .then(response => response.json())
        .then(data => {
            if (data.isLoggedIn) {
                updateHeaderForLoggedInUser(); // Chama função para estado logado
            } else {
                updateHeaderForLoggedOutUser(); // Chama função para estado deslogado
            }

            // Redireciona se o usuário estiver logado e estiver nas páginas de login ou registro
            const path = window.location.pathname;
            if (data.isLoggedIn && (path.includes("login") || path.includes("register"))) {
                window.location.href = "index.html";
            }
        });
}

// Função para atualizar o header quando o usuário está logado
function updateHeaderForLoggedInUser() {
    const loginButton = document.querySelector(".login-button");
    loginButton.classList.add("logout-button"); // Adiciona a classe de estilo
    loginButton.innerHTML = '<span>Sair</span>';
    loginButton.addEventListener("click", handleLogout);
}

function updateHeaderForLoggedOutUser() {
    const loginButton = document.querySelector(".login-button");
    loginButton.classList.remove("logout-button"); // Remove a classe de estilo para o estado de login
    loginButton.innerHTML = '<a href="login.html"><i class="fas fa-user"></i> Entrar</a>';
    loginButton.removeEventListener("click", handleLogout);
}

// Função para fazer logout
function handleLogout(event) {
    event.preventDefault(); // Impede a navegação padrão do link
    fetch("/api/logout", { method: "POST" })
        .then(() => {
            window.location.reload();
        });
}

// Executa a verificação do estado de login ao carregar o conteúdo da página
document.addEventListener("DOMContentLoaded", checkLoginStatus);




