import React, { useEffect, useState } from "react";
import { fetchCombinedNews, fetchNews } from "../services/newService";
import Post from "./Post";
import "../styles/Feed.scss";

const Feed = () => {
  const [articles, setArticles] = useState([]);
  const [source, setSource] = useState("all");

  useEffect(() => {
    const loadNews = async () => {
      if (source === "all") {
        const combinedNews = await fetchCombinedNews();
        setArticles(combinedNews);
      } else {
        const filteredNews = await fetchNews(source);
        setArticles(filteredNews);
      }
    };
    loadNews();

    const intervalid = setInterval(() => {
      console.log("Atualizando noticias...");
      loadNews();
    }, 1800000);

    return () => clearInterval(intervalid);
  }, [source]);

  return (
    <div className="feed">
      <div className="feed__controls">
        <button onClick={() => setSource("all")}>Todas as Fontes</button>
        <button onClick={() => setSource("nyt")}>NY Times</button>
        <button onClick={() => setSource("newsapi")}>News BR</button>
        <button onClick={() => setSource("gnews")}>Google News BR</button>
        <button onClick={() => setSource("openweathermap")}>Climatempo</button>
        <button onClick={() => setSource("awesomeapi")}>Cotações</button>
        <button onClick={() => setSource("jokes")}>Piadas</button>
      </div>
      {articles.map((article, index) => (
        <Post key={index} article={article} />
      ))}
    </div>
  );
};

export default Feed;
