document.addEventListener("DOMContentLoaded", function() {
    // Função para adicionar borda vermelha e mensagem de erro
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

    // Função para remover o erro quando válido
    function clearError(input) {
        input.style.borderColor = "";
        let errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains("error-message")) {
            errorElement.innerText = "";
        }
        updateSubmitButtonState();
    }

    // Função para validar o CPF
    function testaCPF(strCPF) {
        var Soma;
        var Resto;
        Soma = 0;
        if (strCPF == "00000000000") return false;
        for (let i = 1; i <= 9; i++) Soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto === 10) || (Resto === 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10))) return false;
        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto === 10) || (Resto === 11)) Resto = 0;
        return Resto == parseInt(strCPF.substring(10, 11));
    }

    // Validação de campos individuais
    document.getElementById("register-username").addEventListener("blur", function () {
        if (!this.value) showError(this, "Nome de usuário é obrigatório.");
        else clearError(this);
    });

    document.getElementById("register-birthdate").addEventListener("blur", function () {
        if (!this.value) showError(this, "Data de nascimento é obrigatória.");
        else clearError(this);
    });

    document.getElementById("register-email").addEventListener("blur", function () {
        if (!this.value.includes("@") || (!this.value.endsWith(".com") && !this.value.endsWith(".com.br"))) {
            showError(this, "Endereço de email inválido.");
        } else {
            clearError(this);
        }
    });

    document.getElementById("register-password").addEventListener("blur", function () {
        if (this.value.length < 8) showError(this, "A senha deve conter no mínimo 8 caracteres.");
        else clearError(this);
    });

    document.getElementById("cpf").addEventListener("blur", function () {
        const cpf = this.value.replace(/\D/g, '');
        if (!testaCPF(cpf)) showError(this, "CPF inválido.");
        else clearError(this);
    });

    // Função para verificar se todos os campos são válidos
    function updateSubmitButtonState() {
        const username = document.getElementById("register-username").value;
        const birthdate = document.getElementById("register-birthdate").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const cpf = document.getElementById("cpf").value.replace(/\D/g, '');

        const isFormValid = username && birthdate && email.includes("@") && 
                            (email.endsWith(".com") || email.endsWith(".com.br")) &&
                            password.length >= 8 && testaCPF(cpf);

        document.querySelector(".submit-button").disabled = !isFormValid;
    }

    // Função para enviar os dados do formulário ao backend
    function registerUser(data) {
        fetch("/api/register", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Registrado com sucesso!");
                window.location.href = "/"; // Redireciona para a página principal
            } else {
                alert("Erro ao registrar: " + result.message);
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Ocorreu um erro ao tentar registrar. Tente novamente.");
        });
    }

    // Evento de clique para a submissão do formulário
    document.querySelector(".submit-button").addEventListener("click", function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const data = {
            username: document.getElementById("register-username").value,
            birthdate: document.getElementById("register-birthdate").value,
            email: document.getElementById("register-email").value,
            password: document.getElementById("register-password").value,
            cpf: document.getElementById("cpf").value.replace(/\D/g, '')
        };

        registerUser(data);
    });

    // Inicializa o estado do botão de registro
    updateSubmitButtonState();
});
