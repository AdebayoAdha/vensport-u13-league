import { useState, useEffect } from 'react';

function News({ onNavigate }) {
  const [newsArticles, setNewsArticles] = useState([]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedNews = JSON.parse(localStorage.getItem('newsStories') || '[]');
    if (storedNews.length === 0) {
      const demoNews = [
        {
          story: 'demo1',
          title: 'Championship Final Set for Next Weekend',
          date: '2024-01-25',
          content: 'Two top teams will battle for the league title in an exciting finale that promises to be the match of the season.',
          image: '/u-13.png'
        },
        {
          story: 'demo2',
          title: 'New Player Registration Opens',
          date: '2024-01-20',
          content: 'Registration for the upcoming season is now open for all eligible players. Don\'t miss your chance to join the league.',
          image: '/u-13.png'
        },
        {
          story: 'demo3',
          title: 'Coach of the Month Award',
          date: '2024-01-15',
          content: 'Outstanding coaching performance recognized in monthly awards ceremony. Congratulations to all nominees.',
          image: '/u-13.png'
        }
      ];
      setNewsArticles(demoNews);
    } else {
      setNewsArticles(storedNews);
    }
  }, []);
  
  return (
    <section className="section">
      <h2>Latest News</h2>
      <p>Stay updated with the latest happenings in VenSport U-13 League.</p>
      
      <div className="news-page-grid">
        {newsArticles.length > 0 ? newsArticles.map(article => (
          <article key={article.story} className="news-page-card" onClick={() => onNavigate && onNavigate('story', article.story)}>
            <div className="news-page-image">
              <img src={article.image} alt={article.title} />
            </div>
            <div className="news-page-content">
              <div className="news-page-date">{article.date}</div>
              <h3>{article.title}</h3>
              <p>{article.content?.substring(0, 150)}...</p>
              <button className="read-more-btn">Read More</button>
            </div>
          </article>
        )) : (
          <div style={{textAlign: 'center', gridColumn: '1 / -1', padding: '2rem'}}>
            <p>No news articles available.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default News;