import { useState } from 'react';

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const demoImages = [
    { id: 1, src: '/u-13.png', category: 'matches', title: 'Championship Final', date: '2024-01-15' },
    { id: 2, src: '/u-13.png', category: 'training', title: 'Training Session', date: '2024-01-10' },
    { id: 3, src: '/u-13.png', category: 'awards', title: 'Player of the Month', date: '2024-01-05' },
    { id: 4, src: '/u-13.png', category: 'matches', title: 'Derby Match', date: '2024-01-20' },
    { id: 5, src: '/u-13.png', category: 'training', title: 'Youth Development', date: '2024-01-12' },
    { id: 6, src: '/u-13.png', category: 'awards', title: 'Team of the Year', date: '2024-01-25' }
  ];
  
  const filteredImages = selectedCategory === 'all' 
    ? demoImages 
    : demoImages.filter(img => img.category === selectedCategory);
  
  return (
    <section className="section">
      <h2>Gallery</h2>
      <p>Photos and highlights from recent matches and events.</p>
      
      <div className="gallery-filters">
        <button 
          className={selectedCategory === 'all' ? 'active' : ''}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        <button 
          className={selectedCategory === 'matches' ? 'active' : ''}
          onClick={() => setSelectedCategory('matches')}
        >
          Matches
        </button>
        <button 
          className={selectedCategory === 'training' ? 'active' : ''}
          onClick={() => setSelectedCategory('training')}
        >
          Training
        </button>
        <button 
          className={selectedCategory === 'awards' ? 'active' : ''}
          onClick={() => setSelectedCategory('awards')}
        >
          Awards
        </button>
      </div>
      
      <div className="gallery-grid">
        {filteredImages.map(image => (
          <div key={image.id} className="gallery-item">
            <img src={image.src} alt={image.title} />
            <div className="gallery-overlay">
              <h4>{image.title}</h4>
              <p>{image.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;