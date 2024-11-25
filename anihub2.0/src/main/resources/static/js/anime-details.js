document.addEventListener("DOMContentLoaded", async () => {
    const animeId = new URLSearchParams(window.location.search).get("id");
    if (animeId) {
        const animeDetails = await fetchAnimeDetails(animeId);
        renderAnimeDetails(animeDetails);
        initializeCharacterCarousel();
        initializeFavoriteButton(animeId);
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
                            title { romaji }
                            coverImage { large }
                            bannerImage
                            description
                            episodes
                            status
                            season
                            startDate { year month day }
                            averageScore
                            rankings { rank context }
                            externalLinks { url site }
                            trailer { id site }
                            characters { nodes { name { full } image { large } } }
                            studios { nodes { name } }
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

function renderAnimeDetails(anime) {
    if (anime.bannerImage) {
        document.querySelector('.anime-banner img').src = anime.bannerImage;
    }
    document.querySelector('.anime-cover-image img').src = anime.coverImage.large;
    document.querySelector('.anime-description h1').textContent = anime.title.romaji;
    document.querySelector('.anime-description p').innerHTML = anime.description;

    const infoList = document.querySelector('.anime-info-list');
    infoList.innerHTML = `
        <li><strong>Status:</strong> ${anime.status}</li>
        <li><strong>Temporada:</strong> ${anime.season}</li>
        <li><strong>Data de Início:</strong> ${anime.startDate.year}-${anime.startDate.month}-${anime.startDate.day}</li>
        <li><strong>Episódios:</strong> ${anime.episodes}</li>
        <li><strong>Estúdio:</strong> ${anime.studios.nodes.map(studio => studio.name).join(', ')}</li>
    `;

    const charactersCarousel = document.querySelector('.characters-carousel');
    charactersCarousel.innerHTML = anime.characters.nodes.map(character => `
        <div class="character-card">
            <img src="${character.image.large}" alt="${character.name.full}">
            <p>${character.name.full}</p>
        </div>
    `).join('');

    // Renderizar o ranking
    const rankingElement = document.getElementById("anime-ranking");
    if (anime.rankings.length > 0) {
        rankingElement.innerHTML = `
            <strong>Ranking:</strong> ${anime.rankings[0].rank} (${anime.rankings[0].context})
        `;
    }

    // Renderizar links externos
    const linksContainer = document.getElementById("anime-external-links");
    if (anime.externalLinks.length > 0) {
        linksContainer.innerHTML = anime.externalLinks
            .map(link => `<a href="${link.url}" target="_blank">${link.site}</a>`)
            .join('');
    }

    // Renderizar trailer
    const trailerContainer = document.getElementById("anime-trailer");
    if (anime.trailer) {
        const trailerUrl = anime.trailer.site === "youtube"
            ? `https://www.youtube.com/embed/${anime.trailer.id}`
            : anime.trailer.site === "dailymotion"
                ? `https://www.dailymotion.com/embed/video/${anime.trailer.id}`
                : null;

        if (trailerUrl) {
            trailerContainer.innerHTML = `<iframe src="${trailerUrl}" allowfullscreen></iframe>`;
        }
    }
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
        if (currentIndex < carousel.children.length - 4) {
            currentIndex++;
            updateCarousel();
        }
    });

    function updateCarousel() {
        const offset = currentIndex * 110;
        carousel.style.transform = `translateX(-${offset}px)`;
    }
}

// Função para inicializar o botão de favoritos
async function initializeFavoriteButton(animeId) {
    const favoriteBtn = document.getElementById("favorite-btn");

    // Obtém o ID do usuário
    const userId = await getUserId();
    if (!userId) {
        console.error("Usuário não está logado.");
        return;
    }

    // Checa se o anime está favoritado ao carregar a página
    const isFavorited = await checkIfFavorite(userId, animeId);
    updateFavoriteButton(isFavorited);

    // Adiciona o evento de clique para alternar entre adicionar e remover dos favoritos
    favoriteBtn.addEventListener("click", async () => {
        const action = favoriteBtn.classList.contains("favorited") ? "remove" : "add";
        const success = await toggleFavorite(action, userId, animeId);
        if (success) updateFavoriteButton(action === "add");
    });
}

function updateFavoriteButton(isFavorited) {
    const favoriteText = document.getElementById("favorite-btn-text");
    const favoriteBtn = document.getElementById("favorite-btn");
    if (isFavorited) {
        favoriteText.innerText = "Remover dos Favoritos";
        favoriteBtn.classList.add("favorited", "remove-from-favorites");
        favoriteBtn.classList.remove("add-to-favorites");
    } else {
        favoriteText.innerText = "Adicionar aos Favoritos";
        favoriteBtn.classList.remove("favorited", "remove-from-favorites");
        favoriteBtn.classList.add("add-to-favorites");
    }
}
async function toggleFavorite(action, userId, animeId) {
    const response = await fetch(`/api/favorites/${action}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, animeId: animeId })
    });
    const result = await response.json();
    return result.success;
}

async function checkIfFavorite(userId, animeId) {
    const response = await fetch(`/api/favorites?userId=${userId}&animeId=${animeId}`);
    return response.json();
}

async function getUserId() {
    const response = await fetch("/api/getUserId");
    if (response.ok) {
        const data = await response.json();
        return data.userId;
    } else {
        console.error("Erro ao obter o ID do usuário");
        return null;
    }
}
