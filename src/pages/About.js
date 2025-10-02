function About() {
  return (
    <section className="section">
      <h2>About VenSport U-13 League</h2>
      
      <div className="about-content">
        <div className="about-section">
          <h3>Our Mission</h3>
          <p>To provide a competitive and nurturing environment for young football players to develop their skills, build character, and foster a lifelong love for the beautiful game.</p>
        </div>
        
        <div className="about-section">
          <h3>League History</h3>
          <p>Established in 2010, VenSport U-13 League has grown from 8 teams to 20 teams, becoming the premier youth football competition in the region. We pride ourselves on fair play, skill development, and community spirit.</p>
        </div>
        
        <div className="about-section">
          <h3>Our Values</h3>
          <ul className="values-list">
            <li><strong>Fair Play:</strong> Promoting respect and sportsmanship</li>
            <li><strong>Development:</strong> Focusing on player growth and learning</li>
            <li><strong>Community:</strong> Building lasting friendships and connections</li>
            <li><strong>Excellence:</strong> Striving for the highest standards</li>
          </ul>
        </div>
        
        <div className="stats-section">
          <h3>League Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">20</span>
              <span className="stat-label">Teams</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">400+</span>
              <span className="stat-label">Players</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">380</span>
              <span className="stat-label">Matches per Season</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">14</span>
              <span className="stat-label">Years Running</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;