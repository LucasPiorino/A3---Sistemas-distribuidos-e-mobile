// Show the suggestions box
function showSuggestionsBox() {
    const suggestionsContainer = document.getElementById('autocomplete-suggestions');
    const searchInput = document.getElementById('home-search-input');
    
    // Position the suggestions box relative to the search input
    const inputRect = searchInput.getBoundingClientRect();
    suggestionsContainer.style.left = `${inputRect.left}px`;
    suggestionsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
    
    suggestionsContainer.style.display = 'block';
}
// Hide the suggestions box
function hideSuggestionsBox() {
    const suggestionsContainer = document.getElementById('autocomplete-suggestions');
    suggestionsContainer.style.display = 'none';
}

async function fetchAnimeSuggestions() {
    const searchInput = document.getElementById('home-search-input').value.trim();
    
    if (!searchInput) {
        document.getElementById('autocomplete-suggestions').innerHTML = '<div class="suggestion-item">Type the name of an anime...</div>';
        showSuggestionsBox();
        return;
    }

    const query = `
        query ($search: String) {
            Page(page: 1, perPage: 5) {
                media(search: $search, type: ANIME) {
                    id
                    title {
                        romaji
                    }
                    coverImage {
                        medium
                    }
                    status
                }
            }
        }
    `;

    const variables = { search: searchInput };

    try {
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

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        displaySuggestions(data.data.Page.media);
    } catch (error) {
        console.error("Error fetching data from AniList:", error);
        document.getElementById('autocomplete-suggestions').innerHTML = '<div class="suggestion-item">Error fetching suggestions...</div>';
        showSuggestionsBox();
    }
}

// Atualização do displaySuggestions
function displaySuggestions(animeList) {
    const suggestionsContainer = document.getElementById('autocomplete-suggestions');
    suggestionsContainer.innerHTML = ''; // Limpar sugestões anteriores

    if (animeList.length === 0) {
        suggestionsContainer.innerHTML = '<div class="suggestion-item">Nenhum anime encontrado com esse nome...</div>';
    } else {
        animeList.forEach(anime => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.innerHTML = `
                <img src="${anime.coverImage.medium}" alt="${anime.title.romaji}">
                <span>${anime.title.romaji}</span>
            `;

            // Adiciona o evento de clique na sugestão
            suggestionItem.addEventListener('mousedown', () => {
                // Redireciona para a página de detalhes do anime
                window.location.href = `anime-details.html?id=${anime.id}`;
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    }
    showSuggestionsBox();
}

// Adicionando evento ao campo de input para redirecionar ao pressionar Enter
document.getElementById('home-search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchInput = document.getElementById('home-search-input').value.trim();
        if (searchInput) {
            // Redireciona para search.html com o termo de pesquisa como parâmetro da URL
            window.location.href = `search.html?query=${encodeURIComponent(searchInput)}`;
        }
    }
});

// Função para garantir que a caixa de sugestões seja exibida apenas quando o campo de input estiver ativo
document.getElementById('home-search-input').addEventListener('focus', () => {
    const suggestionsContainer = document.getElementById('autocomplete-suggestions');
    if (suggestionsContainer.innerHTML.trim() !== '') {
        showSuggestionsBox();
    }
});

document.getElementById('home-search-input').addEventListener('blur', (event) => {
    // Esconde a caixa de sugestão apenas se o clique não for em um item de sugestão
    setTimeout(() => {
        const activeElement = document.activeElement;
        if (!activeElement.classList.contains('suggestion-item')) {
            hideSuggestionsBox();
        }
    }, 200);
});

// Adicione um evento ao documento para esconder a caixa se clicar fora dela
document.addEventListener('click', (event) => {
    const searchInput = document.getElementById('home-search-input');
    const suggestionsContainer = document.getElementById('autocomplete-suggestions');
    if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        hideSuggestionsBox();
    }
});

    document.getElementById('home-search-input').addEventListener('focus', showSuggestionsBox);
    document.getElementById('home-search-input').addEventListener('blur', hideSuggestionsBox);
    document.getElementById('home-search-input').addEventListener('input', fetchAnimeSuggestions);