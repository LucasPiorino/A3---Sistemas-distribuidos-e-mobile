// Tornando as funções globais
window.changePage = changePage;
window.searchAnime = searchAnime;
window.applyFilters = applyFilters;

let currentPage = 1;
let totalPages = 1;

// Função para buscar animes pelo nome ou filtros aplicados
async function searchAnime() {
    try {
        const animeName = document.getElementById('home-search-input').value.trim();
        
        if (animeName) {
            await searchAnimeByName(animeName, currentPage);
        } else {
            await applyFilters(currentPage);  // Chama applyFilters se o nome estiver vazio
        }
    } catch (error) {
        console.error('Erro ao buscar animes:', error);
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
                media(search: $search, type: ANIME, genre_in: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Slice of Life"]) {
                    id
                    title {
                        romaji
                    }
                    coverImage {
                        large
                    }
                    status
                    genres
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
// Função para aplicar filtros automaticamente
async function applyFilters(page) {
    const genre = document.getElementById('genre-select').value;
    const season = document.getElementById('season-select').value;
    const year = document.getElementById('year-select').value;
    const status = document.getElementById('status-select').value;

    // Criação da consulta, considerando os filtros
    const query = `
        query ($page: Int, $perPage: Int, $genre: [String], $season: MediaSeason, $seasonYear: Int, $status: MediaStatus) {
            Page(page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                }
                media(genre_in: $genre, season: $season, seasonYear: $seasonYear, status: $status, type: ANIME) {
                    id
                    title {
                        romaji
                    }
                    coverImage {
                        large
                    }
                    status
                    genres
                }
            }
        }
    `;

    // Garantir que os parâmetros sejam válidos
    const variables = {
        page: page,
        perPage: 30,
        genre: genre ? [genre] : undefined, // Gênero só é passado se não for vazio
        season: season && ['winter', 'spring', 'summer', 'fall'].includes(season.toLowerCase()) ? season.toUpperCase() : undefined, // Garantir que a estação esteja correta
        seasonYear: year ? parseInt(year) : undefined, // Garantir que o ano seja um número válido
        status: status ? status : undefined, // Status só é passado se não for vazio
    };

    // Remover filtros nulos ou inválidos
    for (let key in variables) {
        if (variables[key] === undefined || variables[key] === null) {
            delete variables[key];
        }
    }

    // Chamar a API com os parâmetros corrigidos
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
        // filtro animes com conteúdo indesejado
        if (anime.genres.includes('Hentai') || anime.genres.includes('Ecchi') || anime.genres.includes('Yaoi') || anime.genres.includes('Yuri')) {
            return;  // Ignora animes com conteúdo indesejado
        }

        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');
        animeCard.innerHTML = `
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
            <div class="anime-info">
                <h3>${anime.title.romaji}</h3>
                <p>Status: ${anime.status}</p>
            </div>
        `;

        // Adiciona o evento de clique para redirecionar para a página de detalhes do anime
        animeCard.addEventListener('click', () => {
            window.location.href = `anime-details?id=${anime.id}`;
        });

        resultsContainer.appendChild(animeCard);
    });
}

// Função para criar a barra de paginação
function createPagination(pageInfo) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Limpar a paginação

    if (totalPages <= 1) return;  // Se houver apenas uma página, não cria a paginação

    const pagination = document.createElement('div');
    pagination.classList.add('pagination');

    // Botão de página anterior
    if (pageInfo.currentPage > 1) {
        pagination.innerHTML += `<button onclick="changePage(${pageInfo.currentPage - 1})">&lt;</button>`;
    }

    // Calcular as páginas de início e fim da páginação
    const startPage = Math.max(1, pageInfo.currentPage - 2);  
    const endPage = Math.min(totalPages, pageInfo.currentPage + 2);  

    // Mostrar os botões de página
    for (let i = startPage; i <= endPage; i++) {
        if (i === pageInfo.currentPage) {
            pagination.innerHTML += `<button class="active">${i}</button>`;  // Página ativa
        } else {
            pagination.innerHTML += `<button onclick="changePage(${i})">${i}</button>`;
        }
    }

    if (startPage > 1) {
        pagination.innerHTML = `<span>...</span>` + pagination.innerHTML;  // Adicionar '...' antes
    }
    if (endPage < totalPages) {
        pagination.innerHTML += `<span>...</span>`;  // Adicionar '...' depois
    }

    // Botão de próxima página
    if (pageInfo.currentPage < totalPages) {
        pagination.innerHTML += `<button onclick="changePage(${pageInfo.currentPage + 1})">&gt;</button>`;
    }

    paginationContainer.appendChild(pagination);
}

// Função para mudar de página
function changePage(page) {
    if (page < 1 || page > totalPages) return;  // Evitar mudança para páginas fora do intervalo
    currentPage = page;
    searchAnime();
}
