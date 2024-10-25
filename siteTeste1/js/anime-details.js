document.addEventListener("DOMContentLoaded", async () => {
    const animeId = new URLSearchParams(window.location.search).get("id");
    if (animeId) {
        const animeDetails = await fetchAnimeDetails(animeId);
        renderAnimeDetails(animeDetails);
    }
});

async function fetchAnimeDetails(id) {
    try {
        const response = await fetch(`https://graphql.anilist.co/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query ($id: Int) {
                        Media(id: $id) {
                            title {
                                romaji
                            }
                            coverImage {
                                large
                            }
                            bannerImage
                            description
                            episodes
                            status
                            season
                            startDate {
                                year
                                month
                                day
                            }
                            characters {
                                nodes {
                                    name {
                                        full
                                    }
                                    image {
                                        large
                                    }
                                }
                            }
                            studios {
                                nodes {
                                    name
                                }
                            }
                        }
                    }
                `,
                variables: { id: parseInt(id) },
            }),
        });
        const data = await response.json();
        return data.data.Media;
    } catch (error) {
        console.error("Erro ao buscar detalhes do anime:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const animeId = new URLSearchParams(window.location.search).get("id");
    if (animeId) {
        const animeDetails = await fetchAnimeDetails(animeId);
        renderAnimeDetails(animeDetails);
        initializeCharacterCarousel();
    }
});

function renderAnimeDetails(anime) {
    // Atualiza o banner
    if (anime.bannerImage) {
        document.querySelector('.anime-banner img').src = anime.bannerImage;
    }

    // Atualiza a capa e descrição
    document.querySelector('.anime-cover-image img').src = anime.coverImage.large;
    document.querySelector('.anime-description h1').textContent = anime.title.romaji;
    document.querySelector('.anime-description p').innerHTML = anime.description;

    // Atualiza informações triviais
    const infoList = document.querySelector('.anime-info-list');
    infoList.innerHTML = `
        <li><strong>Status:</strong> ${anime.status}</li>
        <li><strong>Temporada:</strong> ${anime.season}</li>
        <li><strong>Data de Início:</strong> ${anime.startDate.year}-${anime.startDate.month}-${anime.startDate.day}</li>
        <li><strong>Episódios:</strong> ${anime.episodes}</li>
        <li><strong>Estúdio:</strong> ${anime.studios.nodes.map(studio => studio.name).join(', ')}</li>
    `;

    // Renderiza personagens no carrossel
    const charactersCarousel = document.querySelector('.characters-carousel');
    charactersCarousel.innerHTML = anime.characters.nodes.map(character => `
        <div class="character-card">
            <img src="${character.image.large}" alt="${character.name.full}">
            <p>${character.name.full}</p>
        </div>
    `).join('');
}

function initializeCharacterCarousel() {
    const carousel = document.querySelector('.characters-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < carousel.children.length - 4) { // Ajuste para quantos personagens são visíveis ao mesmo tempo
            currentIndex++;
            updateCarousel();
        }
    });

    function updateCarousel() {
        const offset = currentIndex * 110; // Ajuste a largura (100px) + margin (10px)
        carousel.style.transform = `translateX(-${offset}px)`;
    }
}