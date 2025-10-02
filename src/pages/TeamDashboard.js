import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import TeamRegistration from '../components/TeamRegistration';
import PlayerRegistration from '../components/PlayerRegistration';

function TeamDashboard() {
  const [hasTeam, setHasTeam] = useState(false);
  const [hasPlayers, setHasPlayers] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const [showLeagueTable, setShowLeagueTable] = useState(false);
  const [showTeamStats, setShowTeamStats] = useState(false);
  const [showUpcomingMatches, setShowUpcomingMatches] = useState(false);
  const [showMatchResults, setShowMatchResults] = useState(false);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [teamData, setTeamData] = useState(null);
  const [leagueTable, setLeagueTable] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editData, setEditData] = useState({});
  const [showPlayerRegistration, setShowPlayerRegistration] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [editDetailsData, setEditDetailsData] = useState({});
  const [positionCounts, setPositionCounts] = useState({ goalkeepers: 0, defenders: 0, midfielders: 0, attackers: 0 });
  const [averageAge, setAverageAge] = useState(0);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let team = null;
    
    if (currentUser?.teamData) {
      // Use linked team data from user
      team = currentUser.teamData;
    } else if (currentUser?.teamName) {
      // Find team by team name for admin-created users
      const teams = JSON.parse(localStorage.getItem('teams') || '[]');
      team = teams.find(t => t.teamName === currentUser.teamName);
    } else {
      // Fallback to finding team by email
      const teams = JSON.parse(localStorage.getItem('teams') || '[]');
      team = teams.find(t => t.teamEmail === currentUser?.email);
    }
    
    const registeredPlayers = team?.players?.filter(player => player.fullName?.trim()) || [];
    
    setHasTeam(!!team);
    setHasPlayers(registeredPlayers.length > 0);
    setTeamData(team);
    
    if (team) {
      updatePositionCounts(registeredPlayers);
    }
    
    // If user has a team, automatically show My Team view
    if (team) {
      setShowPlayers(true);
    }
    
    // Calculate league table from fixtures
    const calculateLeagueTable = () => {
      const allTeams = JSON.parse(localStorage.getItem('teams') || '[]');
      const fixtures = JSON.parse(localStorage.getItem('fixtures') || '[]');
      const teamStats = {};
      
      // Initialize stats
      allTeams.forEach(team => {
        teamStats[team.teamName] = {
          teamName: team.teamName,
          teamLogo: team.teamLogo,
          played: 0, won: 0, drawn: 0, lost: 0,
          goalsFor: 0, goalsAgainst: 0, points: 0
        };
      });
      
      // Calculate from fixtures
      fixtures.forEach(fixture => {
        if (fixture.homeScore !== undefined && fixture.awayScore !== undefined) {
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
      
      // Sort and add positions (disqualified teams at bottom)
      const table = Object.values(teamStats)
        .map(team => {
          const teamData = allTeams.find(t => t.teamName === team.teamName);
          return {
            ...team,
            goalDifference: team.goalsFor - team.goalsAgainst,
            disqualified: teamData?.disqualified || false
          };
        })
        .sort((a, b) => {
          if (a.disqualified && !b.disqualified) return 1;
          if (!a.disqualified && b.disqualified) return -1;
          if (a.points !== b.points) return b.points - a.points;
          if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
          return b.goalsFor - a.goalsFor;
        })
        .map((team, index) => ({ ...team, position: index + 1 }));
      
      setLeagueTable(table);
    };
    
    calculateLeagueTable();
    
    // Load team fixtures
    if (team) {
      const fixtures = JSON.parse(localStorage.getItem('fixtures') || '[]');
      const teamFixtures = fixtures.filter(f => 
        f.homeTeam === team.teamName || f.awayTeam === team.teamName
      );
      
      const upcoming = teamFixtures.filter(f => f.homeScore === undefined);
      const completed = teamFixtures.filter(f => f.homeScore !== undefined);
      
      setUpcomingMatches(upcoming);
      setCompletedMatches(completed);
    }
  }, []);

  const handleTeamRegistered = () => {
    // Refresh team data after registration
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    const team = teams.find(t => t.teamEmail === currentUser?.email);
    
    setHasTeam(!!team);
    setTeamData(team);
  };

  const handlePlayersRegistered = () => {
    setShowPlayerRegistration(false);
    // Refresh team data and check for registered players
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    let team = null;
    
    if (currentUser?.teamData) {
      team = teams.find(t => t.teamName === currentUser.teamData.teamName);
    } else if (currentUser?.teamName) {
      team = teams.find(t => t.teamName === currentUser.teamName);
    } else {
      team = teams.find(t => t.teamEmail === currentUser?.email || t.coachEmail === currentUser?.email);
    }
    
    const registeredPlayers = team?.players?.filter(player => player.fullName?.trim()) || [];
    
    setHasPlayers(registeredPlayers.length > 0);
    setTeamData(team);
    setShowPlayers(true);
    
    if (team) {
      updatePositionCounts(registeredPlayers);
    }
  };

  const handleMyTeamClick = () => {
    // Refresh team data from localStorage first
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    let team = null;
    
    if (currentUser?.teamData) {
      team = teams.find(t => t.teamName === currentUser.teamData.teamName);
    } else if (currentUser?.teamName) {
      team = teams.find(t => t.teamName === currentUser.teamName);
    } else {
      team = teams.find(t => t.teamEmail === currentUser?.email || t.coachEmail === currentUser?.email);
    }
    
    if (team) {
      setTeamData(team);
      const registeredPlayers = team?.players?.filter(player => player.fullName?.trim()) || [];
      updatePositionCounts(registeredPlayers);
      
      if (registeredPlayers.length === 0) {
        setShowPlayerRegistration(true);
      } else {
        setShowPlayers(true);
        setShowLeagueTable(false);
        setShowTeamStats(false);
        setShowEditDetails(false);
        setShowUpcomingMatches(false);
        setShowMatchResults(false);
      }
    }
  };

  const handleEditPlayer = (index) => {
    setEditingPlayer(index);
    setEditData(teamData.players[index]);
  };

  const updatePositionCounts = (players) => {
    const goalkeepers = players.filter(p => p.position?.toLowerCase().includes('goalkeeper') || p.position?.toLowerCase().includes('gk')).length;
    const defenders = players.filter(p => p.position?.toLowerCase().includes('defender') || p.position?.toLowerCase().includes('defence')).length;
    const midfielders = players.filter(p => p.position?.toLowerCase().includes('midfielder') || p.position?.toLowerCase().includes('midfield')).length;
    const attackers = players.filter(p => p.position?.toLowerCase().includes('attacker') || p.position?.toLowerCase().includes('forward') || p.position?.toLowerCase().includes('striker')).length;
    setPositionCounts({ goalkeepers, defenders, midfielders, attackers });
    
    const avgAge = players.length > 0 ? 
      Math.round(players.reduce((sum, p) => {
        if (p.dateOfBirth) {
          const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
          return sum + age;
        }
        return sum;
      }, 0) / players.length) : 0;
    setAverageAge(avgAge);
  };

  const handleSavePlayer = (index) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    let teamIndex = -1;
    
    if (currentUser?.teamData) {
      teamIndex = teams.findIndex(t => t.teamName === currentUser.teamData.teamName);
    } else if (currentUser?.teamName) {
      teamIndex = teams.findIndex(t => t.teamName === currentUser.teamName);
    } else {
      teamIndex = teams.findIndex(t => t.teamEmail === currentUser?.email || t.coachEmail === currentUser?.email);
    }
    
    if (teamIndex !== -1) {
      if (!teams[teamIndex].players) {
        teams[teamIndex].players = Array(20).fill().map(() => ({
          fullName: '', dateOfBirth: '', position: '', playerNumber: '', guardianName: '', guardianNumber: ''
        }));
      }
      teams[teamIndex].players[index] = editData;
      localStorage.setItem('teams', JSON.stringify(teams));
      setTeamData(teams[teamIndex]);
      const activePlayers = teams[teamIndex].players.filter(p => p.fullName?.trim());
      updatePositionCounts(activePlayers);
    }
    
    setEditingPlayer(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setEditData({});
  };

  const handleInputChange = (field, value) => {
    if (field === 'playerImage' && value) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData({ ...editData, [field]: e.target.result });
      };
      reader.readAsDataURL(value);
    } else {
      setEditData({ ...editData, [field]: value });
    }
  };

  const handleRemovePlayer = (index) => {
    const registeredPlayers = teamData.players.filter(p => p.fullName?.trim());
    if (registeredPlayers.length <= 15) {
      alert('Cannot remove player. Minimum 15 players required.');
      return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    let teamIndex = -1;
    
    if (currentUser?.teamData) {
      teamIndex = teams.findIndex(t => t.teamName === currentUser.teamData.teamName);
    } else if (currentUser?.teamName) {
      teamIndex = teams.findIndex(t => t.teamName === currentUser.teamName);
    } else {
      teamIndex = teams.findIndex(t => t.teamEmail === currentUser?.email || t.coachEmail === currentUser?.email);
    }
    
    if (teamIndex !== -1) {
      teams[teamIndex].players[index] = { fullName: '', dateOfBirth: '', position: '', playerNumber: '', guardianName: '', guardianNumber: '' };
      localStorage.setItem('teams', JSON.stringify(teams));
      setTeamData(teams[teamIndex]);
      const activePlayers = teams[teamIndex].players.filter(p => p.fullName?.trim());
      updatePositionCounts(activePlayers);
    }
  };

  const handleAddPlayer = () => {
    const registeredPlayers = teamData.players.filter(p => p.fullName?.trim());
    if (registeredPlayers.length >= 20) {
      alert('Cannot add more players. Maximum 20 players allowed.');
      return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    let teamIndex = -1;
    
    if (currentUser?.teamData) {
      teamIndex = teams.findIndex(t => t.teamName === currentUser.teamData.teamName);
    } else if (currentUser?.teamName) {
      teamIndex = teams.findIndex(t => t.teamName === currentUser.teamName);
    } else {
      teamIndex = teams.findIndex(t => t.teamEmail === currentUser?.email || t.coachEmail === currentUser?.email);
    }
    
    if (teamIndex !== -1) {
      if (!teams[teamIndex].players) {
        teams[teamIndex].players = Array(20).fill().map(() => ({
          fullName: '', dateOfBirth: '', position: '', playerNumber: '', guardianName: '', guardianNumber: ''
        }));
      }
      const emptySlotIndex = teams[teamIndex].players.findIndex(p => !p.fullName?.trim());
      if (emptySlotIndex !== -1) {
        setEditingPlayer(emptySlotIndex);
        setEditData({ fullName: '', dateOfBirth: '', position: '', playerNumber: '', guardianName: '', guardianNumber: '' });
      }
    }
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    const teamIndex = teams.findIndex(t => t.teamEmail === currentUser.email || t.coachEmail === currentUser.email);
    
    if (teamIndex !== -1) {
      teams[teamIndex] = { ...teams[teamIndex], ...editDetailsData };
      localStorage.setItem('teams', JSON.stringify(teams));
      
      // Update user data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          fullName: editDetailsData.teamCoach,
          email: editDetailsData.coachEmail,
          coachImage: editDetailsData.coachImage
        };
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      setTeamData(teams[teamIndex]);
      setShowEditDetails(false);
      alert('Details updated successfully!');
    }
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditDetailsData({...editDetailsData, [field]: event.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  if (!hasTeam && !teamData) {
    return <TeamRegistration onTeamRegistered={handleTeamRegistered} />;
  }

  if (teamData && !hasPlayers) {
    return <PlayerRegistration onPlayersRegistered={handlePlayersRegistered} />;
  }

  return (
    <section className="section">
      <h2>Team Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={handleMyTeamClick}>
          <h3>My Team</h3>
          <p>View and manage your team roster</p>
        </div>
        <div className="dashboard-card" onClick={() => {
          setShowUpcomingMatches(true);
          setShowMatchResults(false);
          setShowLeagueTable(false);
          setShowTeamStats(false);
          setShowPlayers(false);
          setShowEditDetails(false);
        }}>
          <h3>Upcoming Matches</h3>
          <p>View scheduled fixtures for your team</p>
        </div>
        <div className="dashboard-card" onClick={() => {
          setShowMatchResults(true);
          setShowUpcomingMatches(false);
          setShowLeagueTable(false);
          setShowTeamStats(false);
          setShowPlayers(false);
          setShowEditDetails(false);
        }}>
          <h3>Match Results</h3>
          <p>View past match results and statistics</p>
        </div>
        <div className="dashboard-card" onClick={() => {
          setShowLeagueTable(true);
          setShowTeamStats(false);
          setShowPlayers(false);
          setShowEditDetails(false);
          setShowUpcomingMatches(false);
          setShowMatchResults(false);
        }}>
          <h3>League Table</h3>
          <p>View current league standings</p>
        </div>
        <div className="dashboard-card" onClick={() => {
          setShowTeamStats(true);
          setShowLeagueTable(false);
          setShowPlayers(false);
          setShowEditDetails(false);
          setShowUpcomingMatches(false);
          setShowMatchResults(false);
        }}>
          <h3>Team Statistics</h3>
          <p>View team performance and player stats</p>
        </div>
        <div className="dashboard-card" onClick={() => {
          setShowEditDetails(true);
          setShowTeamStats(false);
          setShowLeagueTable(false);
          setShowPlayers(false);
          setShowUpcomingMatches(false);
          setShowMatchResults(false);
          if (teamData) {
            setEditDetailsData({
              teamName: teamData.teamName,
              teamCoach: teamData.teamCoach,
              coachEmail: teamData.teamEmail,
              teamEmail: teamData.teamEmail,
              coachNumber: teamData.coachNumber,
              coachImage: teamData.coachImage,
              teamLogo: teamData.teamLogo
            });
          }
        }}>
          <h3>Edit Details</h3>
          <p>Edit coach and team information</p>
        </div>
      </div>
      
      {showPlayerRegistration && (
        <PlayerRegistration onPlayersRegistered={handlePlayersRegistered} />
      )}
      
      {showPlayers && !showEditDetails && !showUpcomingMatches && !showMatchResults && !showLeagueTable && !showTeamStats && teamData?.players && (
        <div className="players-display">
          <div className="roster-header">
            <h3>Team Roster ({teamData.players.filter(p => p.fullName?.trim()).length}/20)</h3>
            <button 
              className="add-player-btn" 
              onClick={handleAddPlayer}
              disabled={teamData.players.filter(p => p.fullName?.trim()).length >= 20}
            >
              Add Player
            </button>
          </div>
          <div className="players-grid">
            {teamData.players.filter(player => player.fullName?.trim()).length > 0 ? teamData.players.filter(player => player.fullName?.trim()).map((player, filteredIndex) => {
              const originalIndex = teamData.players.indexOf(player);
              return (
              <div key={originalIndex} className="player-info-card">
                {editingPlayer === originalIndex ? (
                  <div className="edit-form">
                    <div className="image-upload">
                      <div className="player-image-placeholder">
                        {editData.playerImage ? (
                          <img src={editData.playerImage} alt="Preview" className="player-image" />
                        ) : (
                          <FaUser />
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleInputChange('playerImage', e.target.files[0])}
                        id={`image-${originalIndex}`}
                      />
                      <label htmlFor={`image-${originalIndex}`} className="image-upload-label">
                        Upload Photo
                      </label>
                    </div>
                    <input 
                      type="text" 
                      value={editData.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Full Name"
                    />
                    <input 
                      type="date" 
                      value={editData.dateOfBirth || ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                    <input 
                      type="text" 
                      value={editData.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Position"
                    />
                    <input 
                      type="number" 
                      value={editData.playerNumber || ''}
                      onChange={(e) => handleInputChange('playerNumber', e.target.value)}
                      placeholder="Player Number"
                    />
                    <input 
                      type="text" 
                      value={editData.guardianName || ''}
                      onChange={(e) => handleInputChange('guardianName', e.target.value)}
                      placeholder="Guardian Name"
                    />
                    <input 
                      type="tel" 
                      value={editData.guardianNumber || ''}
                      onChange={(e) => handleInputChange('guardianNumber', e.target.value)}
                      placeholder="Guardian Number"
                    />
                    <div className="edit-buttons">
                      <button onClick={() => handleSavePlayer(originalIndex)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="player-image-placeholder">
                      {player.playerImage ? (
                        <img src={player.playerImage} alt="Player" className="player-image" />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <p><strong>Name:</strong> {player.fullName}</p>
                    <p><strong>DOB:</strong> {player.dateOfBirth} {player.dateOfBirth ? `(Age: ${new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()})` : ''}</p>
                    <p><strong>Position:</strong> {player.position}</p>
                    <p><strong>Number:</strong> {player.playerNumber}</p>
                    <p><strong>Guardian:</strong> {player.guardianName}</p>
                    <p><strong>Guardian Phone:</strong> {player.guardianNumber}</p>
                    <div className="player-actions">
                      <button className="edit-btn" onClick={() => handleEditPlayer(originalIndex)}>Edit</button>
                      <button 
                        className="remove-btn" 
                        onClick={() => handleRemovePlayer(originalIndex)}
                        disabled={teamData.players.filter(p => p.fullName?.trim()).length <= 15}
                      >
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
            }) : <p>No players registered yet. Click 'Add Player' to start adding players to your roster.</p>}
          </div>
        </div>
      )}
      
      {showUpcomingMatches && !showPlayers && !showEditDetails && !showMatchResults && !showLeagueTable && !showTeamStats && (
        <div className="fixtures-display">
          <h3>Upcoming Matches</h3>
          {upcomingMatches.length === 0 ? (
            <p>No upcoming matches scheduled.</p>
          ) : (
            <div className="round-fixtures">
              {upcomingMatches.map((fixture, index) => (
                <div key={index} className="fixture-card">
                  <div className="fixture-teams">
                    <span className="home-team">{fixture.homeTeam}</span>
                    <span className="vs">vs</span>
                    <span className="away-team">{fixture.awayTeam}</span>
                  </div>
                  <div className="fixture-details">
                    <p><strong>Round:</strong> {fixture.round}</p>
                    <p><strong>Date:</strong> {fixture.date || 'TBD'}</p>
                    <p><strong>Time:</strong> {fixture.time || 'TBD'}</p>
                    <p><strong>Venue:</strong> {fixture.venue || 'TBD'}</p>
                  </div>
                  <div className="fixture-status">
                    <span className="status scheduled">Scheduled</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {showMatchResults && !showPlayers && !showEditDetails && !showUpcomingMatches && !showLeagueTable && !showTeamStats && (
        <div className="fixtures-display">
          <h3>Match Results</h3>
          {completedMatches.length === 0 ? (
            <p>No completed matches yet.</p>
          ) : (
            <div className="round-fixtures">
              {completedMatches.map((fixture, index) => (
                <div key={index} className="fixture-card">
                  <div className="fixture-teams">
                    <span className="home-team">{fixture.homeTeam}</span>
                    <span className="vs">vs</span>
                    <span className="away-team">{fixture.awayTeam}</span>
                  </div>
                  <div className="fixture-details">
                    <p><strong>Round:</strong> {fixture.round}</p>
                    <p><strong>Date:</strong> {fixture.date}</p>
                    <p><strong>Time:</strong> {fixture.time}</p>
                    <p><strong>Venue:</strong> {fixture.venue}</p>
                  </div>
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {showLeagueTable && !showPlayers && !showEditDetails && !showUpcomingMatches && !showMatchResults && !showTeamStats && (
        <div className="league-table-container">
          <h3>League Table</h3>
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
              {leagueTable.map((team) => {
                const allTeams = JSON.parse(localStorage.getItem('teams') || '[]');
                const teamData = allTeams.find(t => t.teamName === team.teamName);
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
      )}
      
      {showTeamStats && !showPlayers && !showEditDetails && !showUpcomingMatches && !showMatchResults && !showLeagueTable && teamData && (() => {
        const teamStats = leagueTable.find(t => t.teamName === teamData.teamName) || {
          played: 0, won: 0, drawn: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0
        };
        
        const cleanSheets = completedMatches.filter(match => 
          (match.homeTeam === teamData.teamName && match.awayScore === 0) ||
          (match.awayTeam === teamData.teamName && match.homeScore === 0)
        ).length;
        
        const homeMatches = completedMatches.filter(m => m.homeTeam === teamData.teamName);
        const awayMatches = completedMatches.filter(m => m.awayTeam === teamData.teamName);
        
        const homeWins = homeMatches.filter(m => m.homeScore > m.awayScore).length;
        const homeDraws = homeMatches.filter(m => m.homeScore === m.awayScore).length;
        const homeLosses = homeMatches.filter(m => m.homeScore < m.awayScore).length;
        
        const awayWins = awayMatches.filter(m => m.awayScore > m.homeScore).length;
        const awayDraws = awayMatches.filter(m => m.awayScore === m.homeScore).length;
        const awayLosses = awayMatches.filter(m => m.awayScore < m.homeScore).length;
        
        const last5 = completedMatches.slice(-5).map(match => {
          if (match.homeTeam === teamData.teamName) {
            return match.homeScore > match.awayScore ? 'W' : match.homeScore === match.awayScore ? 'D' : 'L';
          } else {
            return match.awayScore > match.homeScore ? 'W' : match.awayScore === match.homeScore ? 'D' : 'L';
          }
        }).join(' ');
        
        const players = teamData.players?.filter(p => p.fullName?.trim()) || [];
        
        return (
          <div className="team-stats-display">
            <h3>{teamData.teamName} Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Team Overview</h4>
                <p><strong>Matches Played:</strong> {teamStats.played}</p>
                <p><strong>Wins:</strong> {teamStats.won}</p>
                <p><strong>Draws:</strong> {teamStats.drawn}</p>
                <p><strong>Losses:</strong> {teamStats.lost}</p>
                <p><strong>Points:</strong> {teamStats.points}</p>
              </div>
              <div className="stat-card">
                <h4>Goals</h4>
                <p><strong>Goals Scored:</strong> {teamStats.goalsFor}</p>
                <p><strong>Goals Conceded:</strong> {teamStats.goalsAgainst}</p>
                <p><strong>Goal Difference:</strong> {teamStats.goalDifference > 0 ? '+' : ''}{teamStats.goalDifference}</p>
                <p><strong>Clean Sheets:</strong> {cleanSheets}</p>
              </div>
              <div className="stat-card">
                <h4>Squad</h4>
                <p><strong>Total Players:</strong> {players.length}</p>
                <p><strong>Average Age:</strong> {averageAge > 0 ? `${averageAge} years` : 'N/A'}</p>
                <p><strong>Goalkeepers:</strong> {positionCounts.goalkeepers}</p>
                <p><strong>Defenders:</strong> {positionCounts.defenders}</p>
                <p><strong>Midfielders:</strong> {positionCounts.midfielders}</p>
                <p><strong>Attackers:</strong> {positionCounts.attackers}</p>
              </div>
              <div className="stat-card">
                <h4>Form & Records</h4>
                <p><strong>Last 5 Games:</strong> {last5 || 'N/A'}</p>
                <p><strong>Home Record:</strong> {homeWins}-{homeDraws}-{homeLosses}</p>
                <p><strong>Away Record:</strong> {awayWins}-{awayDraws}-{awayLosses}</p>
                <p><strong>League Position:</strong> {leagueTable.find(t => t.teamName === teamData.teamName)?.position || 'N/A'}</p>
              </div>
            </div>
          </div>
        );
      })()}
      
      {showEditDetails && !showPlayers && !showUpcomingMatches && !showMatchResults && !showLeagueTable && !showTeamStats && teamData && (
        <div className="edit-details-display">
          <h3>Edit Coach & Team Details</h3>
          <form onSubmit={handleSaveDetails}>
            <div className="edit-sections">
              <div className="edit-section">
                <h4>Coach Details</h4>
                <div className="image-section">
                  <div className="image-preview">
                    {editDetailsData.coachImage ? (
                      <img src={editDetailsData.coachImage} alt="Coach" className="preview-image" />
                    ) : (
                      <FaUser className="placeholder-icon" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'coachImage')}
                    id="coach-image"
                  />
                  <label htmlFor="coach-image" className="image-upload-label">
                    Upload Coach Photo
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Coach Name"
                  value={editDetailsData.teamCoach || ''}
                  onChange={(e) => setEditDetailsData({...editDetailsData, teamCoach: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="Coach Phone"
                  value={editDetailsData.coachNumber || ''}
                  onChange={(e) => setEditDetailsData({...editDetailsData, coachNumber: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Coach Email"
                  value={editDetailsData.coachEmail || ''}
                  onChange={(e) => setEditDetailsData({...editDetailsData, coachEmail: e.target.value})}
                  required
                />
              </div>
              
              <div className="edit-section">
                <h4>Team Details</h4>
                <div className="image-section">
                  <div className="image-preview">
                    {editDetailsData.teamLogo ? (
                      <img src={editDetailsData.teamLogo} alt="Team Logo" className="preview-image" />
                    ) : (
                      <div className="placeholder-icon">LOGO</div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'teamLogo')}
                    id="team-logo"
                  />
                  <label htmlFor="team-logo" className="image-upload-label">
                    Upload Team Logo
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Team Name"
                  value={editDetailsData.teamName || ''}
                  onChange={(e) => setEditDetailsData({...editDetailsData, teamName: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Team Email"
                  value={editDetailsData.teamEmail || ''}
                  onChange={(e) => setEditDetailsData({...editDetailsData, teamEmail: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setShowEditDetails(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default TeamDashboard;