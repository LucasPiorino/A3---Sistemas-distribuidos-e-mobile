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
    resultsContainer.innerHTML = ''; // Limpar resultados anteriores

    if (!animeList || animeList.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum anime encontrado.</p>';
        return;
    }

    animeList.forEach(anime => {
        const animeCard = `
            <div class="anime-card">
                <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                <div class="anime-info">
                    <h3>${anime.title.romaji}</h3>
                    <p>Status: ${anime.status}</p>
                </div>
            </div>
        `;
        resultsContainer.innerHTML += animeCard;
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
