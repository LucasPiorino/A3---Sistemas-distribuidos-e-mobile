    document.querySelector('form[action="/login"]').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Lógica de login vai aqui (exemplo: redirecionar ou exibir mensagem)
        console.log("Login", { username, password });
    });

    document.querySelector('form[action="/register"]').addEventListener('submit', function(event) {
        event.preventDefault();
        const fullname = document.getElementById('register-fullname').value;
        const age = document.getElementById('register-age').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        // Lógica de registro vai aqui (exemplo: redirecionar ou exibir mensagem)
        console.log("Register", { fullname, age, email, password });
    });

