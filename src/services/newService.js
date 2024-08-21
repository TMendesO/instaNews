import axios from "axios";

const generateImage = async (prompt) => {
  try {
    const response = await axios.post("http://localhost:5000/generate-image", {
      prompt: prompt,
    });

    return response.data.imageUrl;
  } catch (error) {
    if (
      error.response &&
      error.response.data.error.code === "rate_limit_exceeded"
    ) {
      console.error(
        "Limite de taxa excedido ao gerar imagem com a OpenAI. Usando imagem placeholder."
      );
    } else {
      console.error(
        "Erro ao gerar imagem com o proxy:",
        error.response?.data || error.message
      );
    }
    return "https://via.placeholder.com/1024x1024?text=No+Image";
  }
};

const API_CONFIG = {
  nyt: {
    url: "https://api.nytimes.com/svc/mostpopular/v2/shared/1/facebook.json",
    apiKey: "your-nyt-api-key",
    formatResponse: async (data) => {
      return data.results.map((article) => {
        const urlToImage =
          article.media && article.media.length > 0
            ? article.media[0]["media-metadata"].find(
                (img) => img.format === "mediumThreeByTwo440"
              )?.url
            : "https://via.placeholder.com/1024x1024?text=No+Image";

        return {
          source: "nyt",
          title: article.title,
          abstract: article.abstract,
          urlToImage: urlToImage,
          url: article.url,
        };
      });
    },
  },
  newsapi: {
    url: "https://newsapi.org/v2/top-headlines",
    apiKey: "your-newsapi-key",
    params: {
      sources: "google-news-br",
      pageSize: 5,
    },
    formatResponse: async (data) => {
      return Promise.all(
        data.articles.map(async (article) => {
          const urlToImage = article.urlToImage
            ? article.urlToImage
            : await generateImage(article.title);

          return {
            source: "newsapi",
            title: article.title,
            abstract: article.description,
            urlToImage: urlToImage,
            url: article.url,
          };
        })
      );
    },
  },
  gnews: {
    url: "https://gnews.io/api/v4/top-headlines",
    apiKey: "your-gnews-api-key",
    params: {
      category: "general",
      lang: "pt",
      country: "br",
      max: 5,
    },
    formatResponse: async (data) => {
      return Promise.all(
        data.articles.slice(0, 2).map(async (article) => {
          const urlToImage = article.urlToImage
            ? article.urlToImage
            : await generateImage(article.title);

          return {
            source: "gnews",
            title: article.title,
            abstract: article.description,
            urlToImage: urlToImage,
            url: article.url,
          };
        })
      );
    },
  },
};

export const fetchNews = async (source = "nyt") => {
  const config = API_CONFIG[source];

  try {
    let params = { ...config.params };

    if (source === "nyt") {
      params["api-key"] = config.apiKey;
    } else if (source === "gnews") {
      params["apikey"] = config.apiKey;
    } else if (source === "newsapi") {
      params["apiKey"] = config.apiKey;
    }

    const response = await axios.get(config.url, { params });
    return await config.formatResponse(response.data);
  } catch (error) {
    console.error(`Erro ao buscar notícias da API ${source}:`, error);
    return [];
  }
};

export const fetchCombinedNews = async () => {
  const nytNews = await fetchNews("nyt");
  const newsapiNews = await fetchNews("newsapi");
  const gnewsapiNews = await fetchNews("gnews");

  return shuffleArray([...nytNews, ...newsapiNews, ...gnewsapiNews]);
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
