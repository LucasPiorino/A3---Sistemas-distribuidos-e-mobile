document.addEventListener("click", function (event) {
    const searchInput = document.getElementById("search-input");
    const suggestionsBox = document.getElementById("suggestions-box");

    if (searchInput && suggestionsBox && !searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
        hideSuggestionsBox();
    }
});

function showSuggestionsBox() {
    const suggestionsBox = document.getElementById("suggestions-box");
    if (suggestionsBox) {
        suggestionsBox.classList.remove("hidden");
    }
}

function hideSuggestionsBox() {
    const suggestionsBox = document.getElementById("suggestions-box");
    if (suggestionsBox) {
        suggestionsBox.classList.add("hidden");
    }
}

async function autocompleteAnimeSearch() {
    const searchInput = document.getElementById("search-input");
    const suggestionsBox = document.getElementById("suggestions-box");

    if (!searchInput || !suggestionsBox) {
        console.error("Elementos de entrada ou sugestões não foram encontrados.");
        return;
    }

    const query = searchInput.value.trim();

    if (query.length === 0) {
        suggestionsBox.innerHTML = '<p id="placeholder-text">Digite o nome do anime</p>';
        return;
    }

    try {
        const response = await fetch(`https://graphql.anilist.co`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query: `
                query ($search: String) {
                    Media(search: $search, type: ANIME) {
                        id
                        title {
                            romaji
                        }
                        coverImage {
                            large
                        }
                    }
                }`,
                variables: { search: query },
            }),
        });

        const data = await response.json();

        if (data && data.data && data.data.Media) {
            const anime = data.data.Media;
            const suggestionsHTML = `
            <div class="suggestion-item" onclick="selectAnime('${anime.id}')">
                <img class="suggestion-img" src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                <div class="suggestion-info">
                    <p class="suggestion-title">${anime.title.romaji}</p>
                </div>
            </div>`;

            suggestionsBox.innerHTML = suggestionsHTML;
        } else {
            suggestionsBox.innerHTML = '<p class="empty-message">Nenhuma sugestão encontrada</p>';
        }
    } catch (error) {
        console.error("Erro ao buscar sugestões de animes:", error);
        suggestionsBox.innerHTML = '<p class="empty-message">Erro ao buscar sugestões</p>';
    }
}

    // Garante que a caixa de sugestões está visível
    suggestionsBox.classList.remove('hidden');


async function fetchAnimeSuggestions(searchTerm) {
    const query = `
    query ($search: String) {
        Page(page: 1, perPage: 5) {
            media(search: $search, type: ANIME) {
                id
                title {
                    romaji
                }
                coverImage {
                    large
                }
            }
        }
    }`;

    const variables = {
        search: searchTerm
    };

    const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    });

    const data = await response.json();

    if (!data || !data.data || !data.data.Page || !data.data.Page.media) {
        throw new Error('Nenhum dado encontrado para sugestões');
    }

    return data.data.Page.media;
}

function displayAutocompleteSuggestions(animeSuggestions) {
    const suggestionsBox = document.getElementById('suggestions-box');
    suggestionsBox.innerHTML = ''; // Limpar sugestões anteriores

    // Caso não haja sugestões, exibe uma mensagem
    if (!animeSuggestions || animeSuggestions.length === 0) {
        suggestionsBox.innerHTML = '<p id="placeholder-text">Nenhuma sugestão encontrada</p>';
        return;
    }

    // Adicionar cada sugestão ao container
    animeSuggestions.forEach(anime => {
        const suggestionElement = document.createElement('div');
        suggestionElement.classList.add('suggestion-item');

        suggestionElement.innerHTML = `
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji}" class="suggestion-image">
            <span class="suggestion-title">${anime.title.romaji}</span>
        `;

        suggestionElement.addEventListener('click', () => {
            document.getElementById('search-input').value = anime.title.romaji;
            suggestionsBox.classList.add('hidden'); // Esconder a caixa de sugestões
        });

        suggestionsBox.appendChild(suggestionElement);
    });
}

// Adicionando eventos para mostrar e esconder a caixa de sugestões
const searchInput = document.getElementById('search-input');
const suggestionsBox = document.getElementById('suggestions-box');

searchInput.addEventListener('focus', () => {
    suggestionsBox.classList.remove('hidden');
    if (searchInput.value.trim() === '') {
        suggestionsBox.innerHTML = '<p id="placeholder-text">Digite o nome do anime</p>';
    }
});

searchInput.addEventListener('blur', () => {
    setTimeout(() => {
        suggestionsBox.classList.add('hidden');
    }, 200); // Adiciona um pequeno atraso para permitir o clique em uma sugestão
});