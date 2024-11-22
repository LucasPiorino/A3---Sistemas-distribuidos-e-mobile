// Função para mostrar uma mensagem de erro e estilizar o campo com erro
function showError(input, message) {
    input.style.borderColor = "red";
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains("error-message")) {
        errorElement = document.createElement("div");
        errorElement.classList.add("error-message");
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    errorElement.innerText = message;
    updateSubmitButtonState();
}

// Função para remover a mensagem de erro quando o campo é válido
function clearError(input) {
    input.style.borderColor = "";
    let errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
        errorElement.innerText = "";
    }
    updateSubmitButtonState();
}

// Função para validar o email
function isValidEmail(email) {
    return email.includes("@") && (email.endsWith(".com") || email.endsWith(".com.br"));
}

// Validação de campos individuais
document.getElementById("login-username").addEventListener("blur", function () {
    if (!this.value) showError(this, "O campo de usuário é obrigatório.");
    else clearError(this);
});

document.getElementById("login-password").addEventListener("blur", function () {
    if (!this.value) showError(this, "O campo de senha é obrigatório.");
    else clearError(this);
});

// Função para habilitar ou desabilitar o botão de login com base na validade dos campos
function updateSubmitButtonState() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const isFormValid = username && password;

    document.querySelector(".submit-button").disabled = !isFormValid;
}

// Função para fazer o login
function loginUser(data) {
    fetch("/api/login", { // Altere para o endpoint correto
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert("Login realizado com sucesso!");
            window.location.href = "/"; // Redireciona para a página principal
        } else {
            alert("Erro ao fazer login: " + result.message);
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao tentar fazer login. Tente novamente.");
    });
}

// Evento de clique para a submissão do formulário de login
document.querySelector(".submit-button").addEventListener("click", function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const data = {
        username: document.getElementById("login-username").value,
        password: document.getElementById("login-password").value,
    };

    loginUser(data);
});