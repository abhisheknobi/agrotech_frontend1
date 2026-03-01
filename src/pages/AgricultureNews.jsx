import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AgricultureNews.css";

const AgriculturalNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://newsdata.io/api/1/news", {
          params: {
            apikey: "pub_6271090024135525898c5879f00f20d3e3659",
            q: "agriculture OR farmer OR crop OR farm OR agricultural  ",
            country: "in",
            language: "en",
          },
        });
        console.log(response.data); // Log the API response
        setNews(response.data.results); // Update based on API format
        setLoading(false);
      } catch (err) {
        console.error(err); // Log the error
        setError(err.response?.data?.message || "Failed to fetch news"); // Handle error response
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading latest agricultural news...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="news-container">
      <div className="news-wrapper">
        <h2 className="news-head">Latest Agricultural News</h2>
        {news.length > 0 ? (
          <ul className="news-ul">
            {news.map((article, index) => (
              <li className="news-li" key={index}>
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                  <h3>{article.title}</h3>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No news available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default AgriculturalNews;
