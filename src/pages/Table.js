import { useState, useEffect } from 'react';

function Table() {
  const [teams, setTeams] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [topAssists, setTopAssists] = useState([]);
  const [topCleanSheets, setTopCleanSheets] = useState([]);

  useEffect(() => {
    const calculateLeagueTable = () => {
      const storedTeams = JSON.parse(localStorage.getItem('teams') || '[]');
      const fixtures = JSON.parse(localStorage.getItem('fixtures') || '[]');
      const teamStats = {};
      
      // Initialize stats
      storedTeams.forEach(team => {
        teamStats[team.teamName] = {
          teamName: team.teamName,
          teamLogo: team.teamLogo,
          played: 0, won: 0, drawn: 0, lost: 0,
          goalsFor: 0, goalsAgainst: 0, points: 0
        };
      });
      
      // Calculate from fixtures (exclude cancelled)
      fixtures.forEach(fixture => {
        if (fixture.homeScore !== undefined && fixture.awayScore !== undefined && !fixture.cancelled) {
          const homeTeam = fixture.homeTeam;
          const awayTeam = fixture.awayTeam;
          const homeScore = fixture.homeScore;
          const awayScore = fixture.awayScore;
          
          if (teamStats[homeTeam] && teamStats[awayTeam]) {
            teamStats[homeTeam].played++;
            teamStats[awayTeam].played++;
            teamStats[homeTeam].goalsFor += homeScore;
            teamStats[homeTeam].goalsAgainst += awayScore;
            teamStats[awayTeam].goalsFor += awayScore;
            teamStats[awayTeam].goalsAgainst += homeScore;
            
            if (homeScore > awayScore) {
              teamStats[homeTeam].won++;
              teamStats[homeTeam].points += 3;
              teamStats[awayTeam].lost++;
            } else if (homeScore < awayScore) {
              teamStats[awayTeam].won++;
              teamStats[awayTeam].points += 3;
              teamStats[homeTeam].lost++;
            } else {
              teamStats[homeTeam].drawn++;
              teamStats[awayTeam].drawn++;
              teamStats[homeTeam].points += 1;
              teamStats[awayTeam].points += 1;
            }
          }
        }
      });
      
      // Sort and add positions
      const table = Object.values(teamStats)
        .map(team => ({
          ...team,
          goalDifference: team.goalsFor - team.goalsAgainst
        }))
        .sort((a, b) => {
          const aTeam = storedTeams.find(t => t.teamName === a.teamName);
          const bTeam = storedTeams.find(t => t.teamName === b.teamName);
          if (aTeam?.disqualified && !bTeam?.disqualified) return 1;
          if (!aTeam?.disqualified && bTeam?.disqualified) return -1;
          if (a.points !== b.points) return b.points - a.points;
          if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
          return b.goalsFor - a.goalsFor;
        })
        .map((team, index) => ({ ...team, position: index + 1 }));
      
      setTeams(table);
      
      // Calculate top scorer
      const goalScorers = {};
      fixtures.forEach(fixture => {
        if (fixture.homeGoals) {
          fixture.homeGoals.forEach(goal => {
            if (goal.scorer) {
              goalScorers[goal.scorer] = (goalScorers[goal.scorer] || 0) + 1;
            }
          });
        }
        if (fixture.awayGoals) {
          fixture.awayGoals.forEach(goal => {
            if (goal.scorer) {
              goalScorers[goal.scorer] = (goalScorers[goal.scorer] || 0) + 1;
            }
          });
        }
      });
      
      const topScorersList = Object.entries(goalScorers)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, goals]) => ({ name, goals }));
      
      setTopScorers(topScorersList);
      
      // Calculate top assists
      const assistProviders = {};
      fixtures.forEach(fixture => {
        if (fixture.homeGoals) {
          fixture.homeGoals.forEach(goal => {
            if (goal.assist) {
              assistProviders[goal.assist] = (assistProviders[goal.assist] || 0) + 1;
            }
          });
        }
        if (fixture.awayGoals) {
          fixture.awayGoals.forEach(goal => {
            if (goal.assist) {
              assistProviders[goal.assist] = (assistProviders[goal.assist] || 0) + 1;
            }
          });
        }
      });
      
      const topAssistsList = Object.entries(assistProviders)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, assists]) => ({ name, assists }));
      
      setTopAssists(topAssistsList);
      
      // Calculate clean sheets
      const cleanSheetKeepers = {};
      fixtures.forEach(fixture => {
        if (fixture.homeCleanSheet) {
          cleanSheetKeepers[fixture.homeCleanSheet] = (cleanSheetKeepers[fixture.homeCleanSheet] || 0) + 1;
        }
        if (fixture.awayCleanSheet) {
          cleanSheetKeepers[fixture.awayCleanSheet] = (cleanSheetKeepers[fixture.awayCleanSheet] || 0) + 1;
        }
      });
      
      const topCleanSheetsList = Object.entries(cleanSheetKeepers)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, cleanSheets]) => ({ name, cleanSheets }));
      
      setTopCleanSheets(topCleanSheetsList);
    };
    
    calculateLeagueTable();
    
    // Listen for storage changes
    const handleStorageChange = () => calculateLeagueTable();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <section className="section">
      <h2>VenSport U-13 League Table</h2>
      <div className="table-layout">
        <div className="league-table-container">
          <table className="league-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => {
                const storedTeams = JSON.parse(localStorage.getItem('teams') || '[]');
                const teamData = storedTeams.find(t => t.teamName === team.teamName);
                return (
                  <tr key={team.position} className={teamData?.disqualified ? 'disqualified-row' : ''}>
                    <td>{team.position}</td>
                    <td className="team-cell">
                      <img 
                        src={team.teamLogo || '/u-13.png'} 
                        alt="Team Logo" 
                        className="table-team-logo" 
                      />
                      {team.teamName}
                      {teamData?.disqualified && <span className="table-disqualified-badge">Disqualified</span>}
                    </td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.drawn}</td>
                    <td>{team.lost}</td>
                    <td>{team.goalsFor}</td>
                    <td>{team.goalsAgainst}</td>
                    <td>{team.goalDifference}</td>
                    <td><strong>{team.points}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="stats-sidebar">
          <div className="stat-section">
            <h3>Top Scorers</h3>
            {topScorers.length > 0 ? (
              topScorers.map((scorer, index) => (
                <div key={index} className="scorer-item">
                  <span className="scorer-name">{scorer.name}</span>
                  <span className="scorer-goals">{scorer.goals} goals</span>
                </div>
              ))
            ) : (
              <div className="stat-item">
                <span className="player-name">No data available</span>
                <span className="stat-value">0 goals</span>
              </div>
            )}
          </div>
          <div className="stat-section">
            <h3>Top Assists</h3>
            {topAssists.length > 0 ? (
              topAssists.map((assister, index) => (
                <div key={index} className="scorer-item">
                  <span className="scorer-name">{assister.name}</span>
                  <span className="scorer-goals">{assister.assists} assists</span>
                </div>
              ))
            ) : (
              <div className="stat-item">
                <span className="player-name">No data available</span>
                <span className="stat-value">0 assists</span>
              </div>
            )}
          </div>
          <div className="stat-section">
            <h3>Clean Sheets</h3>
            {topCleanSheets.length > 0 ? (
              topCleanSheets.map((keeper, index) => (
                <div key={index} className="scorer-item">
                  <span className="scorer-name">{keeper.name}</span>
                  <span className="scorer-goals">{keeper.cleanSheets} clean sheets</span>
                </div>
              ))
            ) : (
              <div className="stat-item">
                <span className="player-name">No data available</span>
                <span className="stat-value">0 clean sheets</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Table;