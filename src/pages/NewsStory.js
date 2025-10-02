function NewsStory({ storyId, onNavigate }) {
  const newsArticles = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('newsStories') || '[]') : [];
  const story = newsArticles.find(article => article.story === storyId);

  if (!story) {
    return (
      <section className="section">
        <h2>Story Not Found</h2>
        <button onClick={() => onNavigate && onNavigate('home')} className="back-btn">
          ← Back to Home
        </button>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="story-container">
        <button onClick={() => onNavigate && onNavigate('home')} className="back-btn">
          ← Back to Home
        </button>
        
        <article className="story-article">
          {story.image && (
            <div className="story-image">
              <img src={story.image} alt={story.title || 'News story'} />
            </div>
          )}
          
          <div className="story-content">
            <div className="story-date">{story.date || 'Date not available'}</div>
            <h1 className="story-title">{story.title || 'Untitled'}</h1>
            <div className="story-text">
              {(story.content || '').split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default NewsStory;