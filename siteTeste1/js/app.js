import { fetchAnimeData } from './anilist.js';

// Função para renderizar os animes no carrossel
function renderAnimes(animeList, sectionId) {
    const section = document.getElementById(sectionId);
    section.innerHTML = ''; // Limpar a seção

    animeList.forEach(anime => {
        if (anime.nextAiringEpisode && anime.nextAiringEpisode.airingAt) {
            const currentTime = new Date().getTime() / 1000; // Tempo atual em segundos
            const airingTime = anime.nextAiringEpisode.airingAt; // Tempo de lançamento do episódio em segundos

            let statusMessage = "";

            // Verificar se o episódio já foi lançado
            if (currentTime >= airingTime) {
                statusMessage = "Episódio já lançado";
            } else {
                const timeUntilAiring = airingTime - currentTime;
                const hours = Math.floor(timeUntilAiring / 3600);
                const minutes = Math.floor((timeUntilAiring % 3600) / 60);
                statusMessage = `Ep. ${anime.nextAiringEpisode.episode} em ${hours}h ${minutes}m restantes`;
            }

            const animeCard = `
                <div class="anime-card">
                    <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                    <div class="anime-info">
                        <h3>${anime.title.romaji}</h3>
                        <p>${statusMessage}</p>
                    </div>
                </div>
            `;
            section.innerHTML += animeCard;
        }
    });
}

// Função para atualizar os carrosséis
async function updateCarouselSections() {
    try {
        const animeList = await fetchAnimeData();  // Chama a função que busca os dados
        const launchedYesterday = [];
        const launchingToday = [];
        const launchingTomorrow = [];

        const today = new Date();
        const todayDayOfWeek = today.getDay(); // Dia da semana atual (0 = Domingo, 1 = Segunda, etc.)

        // Dividir os animes entre ontem, hoje e amanhã com base no dia da semana
        animeList.forEach(anime => {
            if (anime.nextAiringEpisode && anime.nextAiringEpisode.airingAt) {
                const airingDate = new Date(anime.nextAiringEpisode.airingAt * 1000);
                const airingDayOfWeek = airingDate.getDay(); // Dia da semana do próximo episódio

                // Calcular a diferença de dias da semana
                let dayDiff = airingDayOfWeek - todayDayOfWeek;

                if (dayDiff === -1 || (todayDayOfWeek === 0 && airingDayOfWeek === 6)) { // Ontem
                    launchedYesterday.push(anime);
                } else if (dayDiff === 0) { // Hoje
                    launchingToday.push(anime);
                } else if (dayDiff === 1 || (todayDayOfWeek === 6 && airingDayOfWeek === 0)) { // Amanhã
                    launchingTomorrow.push(anime);
                }
            }
        });

        // Renderizar os animes nas diferentes seções
        renderAnimes(animeList, 'current-season');
        renderAnimes(launchedYesterday, 'launched-yesterday');
        renderAnimes(launchingToday, 'launching-today');
        renderAnimes(launchingTomorrow, 'launching-tomorrow');
    } catch (error) {
        console.error("Erro ao atualizar carrosséis:", error);
    }
}

// Função para rolar o carrossel
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const scrollAmount = 300; // Define a quantidade de rolagem para cada clique de seta

    if (direction === 1) {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
}

// Tornar a função global para ser acessível no HTML
window.scrollCarousel = scrollCarousel;

// Chamar a função quando a página carregar
window.addEventListener('DOMContentLoaded', updateCarouselSections);
