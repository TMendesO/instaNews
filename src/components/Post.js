import React from "react";
import "../styles/Post.scss";

const Post = ({ article }) => {
  const { title, abstract, media, urlToImage, url } = article;

  const image = urlToImage
    ? urlToImage
    : media && media.length > 0
    ? media[0]["media-metadata"].find(
        (img) => img.format === "mediumThreeByTwo440"
      )?.url || media[0]["media-metadata"][0].url
    : "https://via.placeholder.com/440x293?text=No+Image";
  return (
    <div className="post">
      <img src={image} alt={title} className="post__image" />
      <div className="post__content">
        <h3 className="post__title">{title}</h3>
        <p className="post__description">{abstract}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="post__link"
        >
          Leia mais
        </a>
      </div>
    </div>
  );
};

export default Post;
