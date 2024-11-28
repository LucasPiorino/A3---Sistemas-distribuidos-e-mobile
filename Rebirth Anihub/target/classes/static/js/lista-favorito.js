document.addEventListener("DOMContentLoaded", function () {
    const favoritesList = document.getElementById('favorites-list');

    async function fetchUserFavorites() {
        try {
            const response = await fetch('/api/favorites/user');
            if (!response.ok) {
                throw new Error("Erro ao buscar favoritos: " + response.statusText);
            }
            const animeIds = await response.json();
            if (animeIds.length === 0) {
                favoritesList.innerHTML = "<p>Nenhum anime favorito encontrado.</p>";
                return;
            }
            renderFavorites(animeIds);
        } catch (error) {
            console.error(error);
            favoritesList.innerHTML = "<p>Erro ao carregar favoritos.</p>";
        }
    }

    async function renderFavorites(animeIds) {
        favoritesList.innerHTML = "";
        for (const animeId of animeIds) {
            try {
                const anime = await fetchAnimeDetails(animeId);
                const animeItem = document.createElement('div');
                animeItem.classList.add('favorites-list');
                animeItem.innerHTML = `
                    <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                    <div class="anime-info">
                        <h3>${anime.title.romaji}</h3>
                    </div>
                    <a href="anime-details?id=${animeId}">Ver Detalhes</a>
                `;
                favoritesList.appendChild(animeItem);
            } catch (error) {
                console.error(`Erro ao carregar anime ID ${animeId}:`, error);
            }
        }
    }

    async function fetchAnimeDetails(animeId) {
        const query = `
            query ($id: Int) {
                Media(id: $id, type: ANIME) {
                    title {
                        romaji
                    }
                    coverImage {
                        large
                    }
                }
            }
        `;

        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { id: animeId }
            })
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar detalhes do anime ID ${animeId}`);
        }

        const data = await response.json();
        return data.data.Media;
    }

    fetchUserFavorites();
});

