import axios from "axios";

const generateImage = async (prompt) => {
  try {
    const response = await axios.post("http://localhost:5000/generate-image", {
      prompt: prompt.length > 35 ? prompt.substring(0, 35) : prompt,
    });

    return response.data.imageUrl;
  } catch (error) {
    console.error(
      "Erro ao gerar imagem com o proxy:",
      error.response?.data || error.message
    );
    return "https://via.placeholder.com/1024x1024?text=No+Image";
  }
};

const API_CONFIG = {
  nyt: {
    url: "https://api.nytimes.com/svc/mostpopular/v2/shared/1/facebook.json",
    apiKey: "key",
    params: {},
    formatResponse: async (data) => {
      return Promise.all(
        data.results.map(async (article) => {
          const urlToImage =
            article.media && article.media.length > 0
              ? article.media[0]["media-metadata"].find(
                  (img) => img.format === "mediumThreeByTwo440"
                )?.url
              : await generateImage(article.title);

          return {
            source: "nyt",
            title: article.title,
            abstract: article.abstract,
            urlToImage: urlToImage,
            url: article.url,
          };
        })
      );
    },
  },
  newsapi: {
    url: "https://newsapi.org/v2/top-headlines",
    apiKey: "key",
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
    apiKey: "key",
    params: {
      category: "general",
      lang: "pt",
      country: "br",
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
  openweathermap: {
    url: "https://api.openweathermap.org/data/2.5/weather",
    apiKey: "key",
    formatResponse: async (data) => {
      return [
        {
          source: "openweathermap",
          title: `Clima atual em ${data.name}`,
          abstract: `Temperatura: ${data.main.temp}°C, Condição: ${data.weather[0].description}`,
          urlToImage: await generateImage(
            `Clima ${data.weather[0].description}`
          ),
          url: "https://openweathermap.org/",
        },
      ];
    },
  },
  awesomeapi: {
    url: "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL",
    params: {},
    formatResponse: async (data) => {
      const currencies = await Promise.all(
        Object.values(data).map(async (currency) => ({
          source: "awesomeapi",
          title: `Cotação ${currency.code}`,
          abstract: `Valor: R$ ${currency.bid}`,
          urlToImage: await generateImage(`${currency.code} currency`),
          url: "https://economia.awesomeapi.com.br/",
        }))
      );
      return currencies;
    },
  },
  jokes: {
    url: "https://api.api-ninjas.com/v1/jokes",
    apiKey: "key",
    params: {},
    formatResponse: async (data) => {
      return [
        {
          source: "jokes",
          title: "Piada do Dia",
          abstract: data[0].joke,
          urlToImage: await generateImage(data[0].joke),
          url: "https://api-ninjas.com/",
        },
      ];
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
    } else if (source === "jokes") {
      params["X-Api-Key"] = config.apiKey;
    } else if (source === "openweathermap") {
      params["q"] = "Praia Grande,BR";
      params["units"] = "metric";
      params["appid"] = config.apiKey;
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
  const openWeatherMapNews = await fetchNews("openweathermap");
  const awesomeapiNews = await fetchNews("awesomeapi");
  const jokesNews = await fetchNews("jokes");

  return shuffleArray([
    ...nytNews,
    ...newsapiNews,
    ...gnewsapiNews,
    ...openWeatherMapNews,
    ...awesomeapiNews,
    ...jokesNews,
  ]);
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
