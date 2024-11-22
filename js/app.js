// Arquivo: js/app.js

document.addEventListener("DOMContentLoaded", async () => {
    const currentSeasonSection = document.getElementById('current-season');
    const launchingTodaySection = document.getElementById('launching-today');
    const launchedYesterdaySection = document.getElementById('launched-yesterday');
    const launchingTomorrowSection = document.getElementById('launching-tomorrow');

    const weekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const today = new Date().getDay();
    const yesterday = today === 0 ? 6 : today - 1;
    const tomorrow = today === 6 ? 0 : today + 1;

    // Função para buscar animes da API
    async function fetchAnimes(query, variables) {
        try {
            const response = await fetch('https://graphql.anilist.co/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, variables }),
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.data && data.data.Page) {
                return data.data.Page.media;
            } else {
                throw new Error("Dados inválidos recebidos da API.");
            }
        } catch (error) {
            console.error("Erro ao buscar animes:", error);
            return []; // Retorna um array vazio em caso de erro
        }
    }

    // Função para renderizar animes em um carrossel
    function renderAnimeCarousel(section, animes) {
        if (!animes || animes.length === 0) {
            section.innerHTML = '<p>Nenhum anime encontrado.</p>';
            return;
        }

        section.innerHTML = animes.map(anime => `
            <div class="anime-card" onclick="window.location.href='anime-details.html?id=${anime.id}';">
                <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                <div class="anime-info">
                    <h3>${anime.title.romaji}</h3>
                    <p>${anime.nextAiringEpisode ? `Lança: ${weekDays[new Date(anime.nextAiringEpisode.airingAt * 1000).getDay()]}` : 'Sem informações'}</p>
                </div>
            </div>
        `).join('');
    }

    // Consulta GraphQL para obter os animes da temporada atual e de acordo com o dia
    const query = `
        query ($season: MediaSeason, $year: Int) {
            Page(perPage: 50) {
                media(season: $season, seasonYear: $year, format_in: [TV, TV_SHORT], genre_not_in: ["Hentai"], sort: [POPULARITY_DESC]) {
                    id
                    title {
                        romaji
                    }
                    coverImage {
                        large
                    }
                    nextAiringEpisode {
                        airingAt
                        timeUntilAiring
                    }
                    airingSchedule {
                        nodes {
                            airingAt
                        }
                    }
                }
            }
        }
    `;

    const seasonYear = new Date().getFullYear();
    const season = getCurrentSeason();
    const variables = { season, year: seasonYear };

    // Função para determinar a estação atual
    function getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        if (month >= 1 && month <= 3) return "WINTER";
        if (month >= 4 && month <= 6) return "SPRING";
        if (month >= 7 && month <= 9) return "SUMMER";
        return "FALL";
    }

    // Carregar animes e renderizar as seções
    const animes = await fetchAnimes(query, variables);

    // Filtrando e renderizando animes para cada seção
    renderAnimeCarousel(currentSeasonSection, animes);

    // Animes lançando hoje
    const launchingToday = animes.filter(anime => {
        return anime.nextAiringEpisode && new Date(anime.nextAiringEpisode.airingAt * 1000).getDay() === today;
    });
    renderAnimeCarousel(launchingTodaySection, launchingToday);

    // Animes lançados ontem
    const launchedYesterday = animes.filter(anime => {
        return anime.nextAiringEpisode && new Date(anime.nextAiringEpisode.airingAt * 1000).getDay() === yesterday;
    });
    renderAnimeCarousel(launchedYesterdaySection, launchedYesterday);

    // Animes lançando amanhã
    const launchingTomorrow = animes.filter(anime => {
        return anime.nextAiringEpisode && new Date(anime.nextAiringEpisode.airingAt * 1000).getDay() === tomorrow;
    });
    renderAnimeCarousel(launchingTomorrowSection, launchingTomorrow);
});

window.scrollCarousel = function(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const scrollAmount = carousel.offsetWidth * 0.8 * direction; // Adjust scroll distance as needed
    carousel.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
};