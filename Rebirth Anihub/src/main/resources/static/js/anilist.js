// Função para buscar todos os animes em lançamento
export async function fetchAnimeData() {
  const query = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(status_in: [RELEASING], format: TV) {
        id
        title {
          romaji
        }
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        coverImage {
          large
        }
      }
    }
  }`;

  const variables = {
    page: 1,
    perPage: 200
};

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

    const data = await response.json();

    // log para inspecionar a resposta da API
    console.log("Resposta da API AniList:", data);

    
    if (!data || !data.data || !data.data.Page || !data.data.Page.media) {
      throw new Error('Dados da API não encontrados');
    }

    return data.data.Page.media; // Retorna os dados dos animes

  } catch (error) {
    console.error("Erro ao buscar dados da API:", error);
    return []; // Retorna uma lista vazia em caso de erro para evitar falhas
  }
}
