import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

function Clubs() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem("teams") || "[]");
    setTeams(storedTeams);
  }, []);

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    calculateTeamStats(team);
    loadTeamMatches(team);
  };

  const calculateTeamStats = (team) => {
    const fixtures = JSON.parse(localStorage.getItem('fixtures') || '[]');
    const teamFixtures = fixtures.filter(f => 
      (f.homeTeam === team.teamName || f.awayTeam === team.teamName) && 
      f.homeScore !== undefined
    );
    
    let stats = { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 };
    
    teamFixtures.forEach(fixture => {
      stats.played++;
      if (fixture.homeTeam === team.teamName) {
        stats.goalsFor += fixture.homeScore;
        stats.goalsAgainst += fixture.awayScore;
        if (fixture.homeScore > fixture.awayScore) stats.won++;
        else if (fixture.homeScore < fixture.awayScore) stats.lost++;
        else stats.drawn++;
      } else {
        stats.goalsFor += fixture.awayScore;
        stats.goalsAgainst += fixture.homeScore;
        if (fixture.awayScore > fixture.homeScore) stats.won++;
        else if (fixture.awayScore < fixture.homeScore) stats.lost++;
        else stats.drawn++;
      }
    });
    
    stats.points = stats.won * 3 + stats.drawn;
    stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
    setTeamStats(stats);
  };

  const loadTeamMatches = (team) => {
    const fixtures = JSON.parse(localStorage.getItem('fixtures') || '[]');
    const teamFixtures = fixtures.filter(f => 
      f.homeTeam === team.teamName || f.awayTeam === team.teamName
    );
    
    const completed = teamFixtures.filter(f => f.homeScore !== undefined)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    const upcoming = teamFixtures.filter(f => f.homeScore === undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
    
    setRecentMatches(completed);
    setUpcomingMatches(upcoming);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (selectedTeam) {
    const registeredPlayers = selectedTeam.players?.filter(player => player.fullName?.trim()) || [];
    
    return (
      <section className="section">
        <div className="team-detail-header">
          <button className="back-btn" onClick={() => setSelectedTeam(null)}>
            <FaArrowLeft /> Back to Clubs
          </button>
          <h2>{selectedTeam.teamName}</h2>
        </div>
        
        <div className="team-detail-content">
          <div className="team-info-section">
            <div className="team-logo-placeholder">
              <img
                src={selectedTeam.teamLogo || "/u-13.png"}
                alt="Team Logo"
                className="team-logo"
              />
            </div>
            <div className="team-details">
              <p><strong>Coach:</strong> {selectedTeam.teamCoach}</p>
              <p><strong>Email:</strong> {selectedTeam.teamEmail}</p>
              <p><strong>Phone:</strong> {selectedTeam.coachNumber}</p>
            </div>
          </div>
          
          {teamStats && (
            <div className="team-stats-card">
              <h3>Team Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item"><span>Played:</span> <strong>{teamStats.played}</strong></div>
                <div className="stat-item"><span>Won:</span> <strong>{teamStats.won}</strong></div>
                <div className="stat-item"><span>Drawn:</span> <strong>{teamStats.drawn}</strong></div>
                <div className="stat-item"><span>Lost:</span> <strong>{teamStats.lost}</strong></div>
                <div className="stat-item"><span>Goals For:</span> <strong>{teamStats.goalsFor}</strong></div>
                <div className="stat-item"><span>Goals Against:</span> <strong>{teamStats.goalsAgainst}</strong></div>
                <div className="stat-item"><span>Goal Difference:</span> <strong>{teamStats.goalDifference}</strong></div>
                <div className="stat-item"><span>Points:</span> <strong>{teamStats.points}</strong></div>
              </div>
            </div>
          )}
          
          <div className="roster-section">
            <h3>Team Roster</h3>
            <div className="roster-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>No.</th>
                    <th>Position</th>
                    <th>Goals</th>
                    <th>Assists</th>
                    <th>Clean Sheets</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredPlayers.map((player, index) => (
                    <tr key={index}>
                      <td>{player.fullName}</td>
                      <td>{calculateAge(player.dateOfBirth)}</td>
                      <td>{player.playerNumber}</td>
                      <td>{player.position}</td>
                      <td>{player.stats?.goals || 0}</td>
                      <td>{player.stats?.assists || 0}</td>
                      <td>{player.stats?.cleanSheets || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="matches-section">
            <div className="recent-matches">
              <h3>Last 5 Games</h3>
              {recentMatches.length > 0 ? (
                recentMatches.map((match, index) => (
                  <div key={index} className="match-item">
                    <span className="match-teams">
                      {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
                    </span>
                    <span className="match-date">{match.date}</span>
                  </div>
                ))
              ) : (
                <p>No recent matches</p>
              )}
            </div>
            
            <div className="upcoming-matches">
              <h3>Next 5 Games</h3>
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match, index) => (
                  <div key={index} className="match-item">
                    <span className="match-teams">
                      {match.homeTeam} vs {match.awayTeam}
                    </span>
                    <span className="match-date">{match.date}</span>
                  </div>
                ))
              ) : (
                <p>No upcoming matches</p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h2>Clubs</h2>
      <p>Meet the participating clubs in our league.</p>
      <div className="clubs-grid">
        {teams.map((team, index) => (
          <div 
            key={index} 
            className={`club-card ${team.disqualified ? 'disqualified' : ''}`}
            onClick={() => handleTeamClick(team)}
          >
            <div className="club-logo">
              <img
                src={team.teamLogo || "/u-13.png"}
                alt={`${team.teamName} Logo`}
                className="club-logo-img"
              />
            </div>
            <h3>{team.teamName}</h3>
            <p><strong>Coach:</strong> {team.teamCoach}</p>
            <p><strong>Email:</strong> {team.teamEmail}</p>
            <p><strong>Phone:</strong> {team.coachNumber}</p>
            {team.disqualified && <span className="club-disqualified-badge">Disqualified</span>}
          </div>
        ))}
      </div>
      {teams.length === 0 && (
        <p>No clubs registered yet.</p>
      )}
    </section>
  );
}

export default Clubs;