// Tornando as funções globais
window.searchAnime = searchAnime;
window.applyFilters = applyFilters;

let currentPage = 1;
let totalPages = 1;

// Função para buscar animes pelo nome ou filtros aplicados
async function searchAnime() {
    const animeName = document.getElementById('anime-name-input').value.trim();
    
    if (animeName) {
        searchAnimeByName(animeName, currentPage);
    } else {
        applyFilters(currentPage);
    }
}

// Função para buscar animes pelo nome digitado
async function searchAnimeByName(animeName, page) {
    const query = `
        query ($page: Int, $perPage: Int, $search: String) {
            Page(page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                }
                media(search: $search, type: ANIME) {
                    id
                    title {
                        romaji
                    }
                    coverImage {
                        large
                    }
                    status
                }
            }
        }
    `;

    const variables = {
        page: page,
        perPage: 30,
        search: animeName
    };

    await fetchAnime(query, variables);
}

// Função para aplicar filtros automaticamente
async function applyFilters(page) {
    const genre = document.getElementById('genre-select').value;
    const season = document.getElementById('season-select').value;
    const year = document.getElementById('year-select').value;
    const status = document.getElementById('status-select').value;

    const query = `
        query ($page: Int, $perPage: Int, $genre: String, $season: MediaSeason, $seasonYear: Int, $status: MediaStatus) {
            Page(page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                }
                media(genre: $genre, season: $season, seasonYear: $seasonYear, status: $status, type: ANIME) {
                    id
                    title {
                        romaji
                    }
                    coverImage {
                        large
                    }
                    status
                }
            }
        }
    `;

    const variables = {
        page: page,
        perPage: 30,
        genre: genre ? genre : undefined,
        season: season ? season.toUpperCase() : undefined,
        seasonYear: year ? parseInt(year) : undefined,
        status: status ? status : undefined,
    };

    await fetchAnime(query, variables);
}

// Função para buscar animes usando a query e variáveis fornecidas
async function fetchAnime(query, variables) {
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
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.data || !data.data.Page || !data.data.Page.media) {
            throw new Error("Nenhum dado encontrado na resposta da API.");
        }

        const pageInfo = data.data.Page.pageInfo;
        currentPage = pageInfo.currentPage;
        totalPages = pageInfo.lastPage;

        displayResults(data.data.Page.media);
        createPagination(pageInfo);
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        alert("Erro ao buscar animes. Verifique sua conexão ou tente novamente mais tarde.");
    }
}

// Função para exibir os resultados da pesquisa
function displayResults(animeList) {
    const resultsContainer = document.getElementById('anime-results-container');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!animeList || animeList.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum anime encontrado.</p>';
        return;
    }

    animeList.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');
        animeCard.innerHTML = `
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
            <div class="anime-info">
                <h3>${anime.title.romaji}</h3>
                <p>Status: ${anime.status}</p>
            </div>
        `;

        // Add click event listener to redirect to anime-details.html with anime ID
        animeCard.addEventListener('click', () => {
            window.location.href = `anime-details.html?id=${anime.id}`;
        });

        resultsContainer.appendChild(animeCard);
    });
}

// Função para criar a barra de paginação
function createPagination(pageInfo) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Limpar paginação anterior

    if (totalPages <= 1) return;

    const pagination = document.createElement('div');
    pagination.classList.add('pagination');

    if (pageInfo.currentPage > 1) {
        pagination.innerHTML += `<button onclick="changePage(${pageInfo.currentPage - 1})">&lt;</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === pageInfo.currentPage) {
            pagination.innerHTML += `<button class="active">${i}</button>`;
        } else if (i <= 3 || i > totalPages - 3 || (i >= pageInfo.currentPage - 1 && i <= pageInfo.currentPage + 1)) {
            pagination.innerHTML += `<button onclick="changePage(${i})">${i}</button>`;
        } else if (i === 4 || i === totalPages - 3) {
            pagination.innerHTML += `<span>...</span>`;
        }
    }

    if (pageInfo.hasNextPage) {
        pagination.innerHTML += `<button onclick="changePage(${pageInfo.currentPage + 1})">&gt;</button>`;
    }

    paginationContainer.appendChild(pagination);
}

// Função para mudar de página
function changePage(page) {
    currentPage = page;
    searchAnime();
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchAndPopulateGenres();
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        document.getElementById('home-search-input').value = query;
        performSearch(query);
    }
});

async function fetchAndPopulateGenres() {
    const genreSelect = document.getElementById('genre-select');

    if (!genreSelect) {
        console.warn("O elemento 'genre-select' não foi encontrado na página.");
        return; // Interrompe a execução se o elemento não existir
    }

    const query = `
        query {
            GenreCollection
        }
    `;

    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar gêneros: ${response.status}`);
        }

        const data = await response.json();
        if (!data || !data.data || !data.data.GenreCollection) {
            throw new Error("Nenhum gênero encontrado na resposta da API.");
        }

        const genres = data.data.GenreCollection;

        genreSelect.innerHTML = '<option value="">Todos</option>';
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao buscar gêneros da API:", error);
        alert("Erro ao carregar gêneros. Verifique sua conexão ou tente novamente mais tarde.");
    }
}