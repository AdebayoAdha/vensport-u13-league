import { useState, useEffect } from "react";
import { authService } from "../utils/auth";

function Results() {
  const [fixtures, setFixtures] = useState([]);
  const [selectedRound, setSelectedRound] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [defaultRound, setDefaultRound] = useState('all');

  useEffect(() => {
    const storedFixtures = JSON.parse(localStorage.getItem('fixtures') || '[]');
    setFixtures(storedFixtures);
    
    const currentUser = authService.getCurrentUser();
    const isAdminUser = currentUser?.role === 'admin';
    setIsAdmin(isAdminUser);
    
    const storedDefaultRound = localStorage.getItem('defaultRound') || 'all';
    setDefaultRound(storedDefaultRound);
    
    if (isAdminUser) {
      setSelectedRound(storedDefaultRound);
    } else {
      const availableRounds = [...new Set(storedFixtures.map(f => f.round))].sort((a, b) => a - b);
      setSelectedRound(availableRounds[0] || '1');
    }
  }, []);

  const filteredFixtures = selectedRound === 'all' 
    ? fixtures 
    : fixtures.filter(f => f.round === parseInt(selectedRound));

  const rounds = [...new Set(fixtures.map(f => f.round))].sort((a, b) => a - b);

  const handleSetDefaultRound = () => {
    localStorage.setItem('defaultRound', selectedRound);
    setDefaultRound(selectedRound);
    alert('Default round updated successfully!');
  };

  return (
    <section className="section">
      <h2>Fixtures & Results</h2>
      
      <div className="round-filter">
        {isAdmin ? (
          <>
            <select 
              value={selectedRound} 
              onChange={(e) => setSelectedRound(e.target.value)}
            >
              <option value="all">All Rounds</option>
              {rounds.map(round => (
                <option key={round} value={round}>Round {round}</option>
              ))}
            </select>
            <button 
              className="set-default-btn" 
              onClick={handleSetDefaultRound}
              title="Set this round as default for all users"
            >
              Set as Default
            </button>
          </>
        ) : (
          <select 
            value={selectedRound} 
            onChange={(e) => setSelectedRound(e.target.value)}
          >
            {rounds.map(round => (
              <option key={round} value={round}>Round {round}</option>
            ))}
          </select>
        )}
      </div>

      {isAdmin && (
        <div className="admin-info">
          <p><strong>Current default round:</strong> {defaultRound === 'all' ? 'All Rounds' : `Round ${defaultRound}`}</p>
        </div>
      )}
      
      {filteredFixtures.length === 0 ? (
        <p>No fixtures available yet.</p>
      ) : (
        <div className="fixtures-list">
          {Object.entries(
            filteredFixtures.reduce((rounds, fixture) => {
              const roundKey = fixture.round || 'Manual';
              if (!rounds[roundKey]) rounds[roundKey] = [];
              rounds[roundKey].push(fixture);
              return rounds;
            }, {})
          ).sort(([a], [b]) => {
            if (a === 'Manual') return 1;
            if (b === 'Manual') return -1;
            return parseInt(a) - parseInt(b);
          }).map(([roundName, roundFixtures]) => (
            <div key={roundName} className="round-section">
              <h3 className="round-title">Round {roundName}</h3>
              <div className="round-fixtures">
                {roundFixtures.map((fixture, index) => (
                  <div key={index} className="fixture-card">
                    <div className="fixture-teams">
                      <span className="home-team">{fixture.homeTeam}</span>
                      <span className="vs">vs</span>
                      <span className="away-team">{fixture.awayTeam}</span>
                    </div>
                    <div className="fixture-details">
                      <p><strong>Date:</strong> {fixture.date || 'TBD'}</p>
                      <p><strong>Time:</strong> {fixture.time || 'TBD'}</p>
                      <p><strong>Venue:</strong> {fixture.venue || 'TBD'}</p>
                    </div>
                    {fixture.homeScore !== undefined ? (
                      <div className="fixture-result">
                        <span className="result">{fixture.homeScore} - {fixture.awayScore}</span>
                        <span className="status">{fixture.forfeit ? 'Forfeit' : 'Final'}</span>
                        {fixture.forfeit && <div className="cancel-reason">{fixture.cancelReason}</div>}
                        {(fixture.homeGoals?.length > 0 || fixture.awayGoals?.length > 0) && (
                          <div className="match-details">
                            {fixture.homeGoals?.map((goal, i) => (
                              <div key={i} className="goal-detail">
                                <strong>{fixture.homeTeam}:</strong> {goal.scorer} {goal.time}
                                {goal.assist && <span className="assist"> (Assist: {goal.assist})</span>}
                              </div>
                            ))}
                            {fixture.awayGoals?.map((goal, i) => (
                              <div key={i} className="goal-detail">
                                <strong>{fixture.awayTeam}:</strong> {goal.scorer} {goal.time}
                                {goal.assist && <span className="assist"> (Assist: {goal.assist})</span>}
                              </div>
                            ))}
                            {(fixture.homeCleanSheet || fixture.awayCleanSheet) && (
                              <div className="cleansheet-details">
                                {fixture.homeCleanSheet && (
                                  <div className="cleansheet">🥅 {fixture.homeTeam}: {fixture.homeCleanSheet}</div>
                                )}
                                {fixture.awayCleanSheet && (
                                  <div className="cleansheet">🥅 {fixture.awayTeam}: {fixture.awayCleanSheet}</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="fixture-status">
                        <span className="status scheduled">Scheduled</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Results;