import { useState, useEffect } from "react";
import { FaUser, FaPlus, FaBan } from "react-icons/fa";
import { generateFixtures } from "../utils/fixtureGenerator";

function AdminDashboard() {
  const [showTeams, setShowTeams] = useState(false);
  const [showLeagueTable, setShowLeagueTable] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [teams, setTeams] = useState([]);
  const [leagueTable, setLeagueTable] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCoaches, setShowCoaches] = useState(true);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [adminProfileData, setAdminProfileData] = useState({});
  const [showNewsManagement, setShowNewsManagement] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [showAddNews, setShowAddNews] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', content: '', image: '' });

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({ teamName: '', teamCoach: '', teamEmail: '', coachNumber: '' });
  const [showFixtures, setShowFixtures] = useState(false);
  const [fixtures, setFixtures] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newFixture, setNewFixture] = useState({ homeTeam: '', awayTeam: '', date: '', time: '', venue: '' });
  const [editingFixture, setEditingFixture] = useState(null);
  const [editFixtureData, setEditFixtureData] = useState({});
  const [updatingResult, setUpdatingResult] = useState(null);
  const [resultData, setResultData] = useState({ homeScore: 0, awayScore: 0, homeGoals: [], awayGoals: [], homeCleanSheet: '', awayCleanSheet: '' });
  const [selectedRound, setSelectedRound] = useState('all');

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem("teams") || "[]");
    setTeams(storedTeams);
    
    const storedFixtures = JSON.parse(localStorage.getItem("fixtures") || "[]");
    setFixtures(storedFixtures);
    
    // Calculate league table from fixtures
    const calculateLeagueTable = () => {
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
      storedFixtures.forEach(fixture => {
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
      
      setLeagueTable(table);
    };
    
    calculateLeagueTable();
    
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const coaches = storedUsers.filter(user => user.role === 'coach');
    setUsers(coaches);
    
    const storedNews = JSON.parse(localStorage.getItem('newsStories') || '[]');
    setNewsArticles(storedNews);
  }, []);

  return (
    <section className="section">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-grid">
        <div
          className="dashboard-card"
          onClick={() => {
            setShowTeams(!showTeams);
            setShowLeagueTable(false);
            setShowUserManagement(false);
            setShowFixtures(false);
            setShowScheduleForm(false);
            setShowAdminProfile(false);
            setShowNewsManagement(false);
            setShowAddNews(false);
            setSelectedTeam(null);
          }}
        >
          <h3>Manage Teams</h3>
          <p>Add, edit, or remove teams from the league</p>
        </div>
        <div className="dashboard-card" onClick={() => {
          setShowFixtures(!showFixtures);
          setShowTeams(false);
          setShowLeagueTable(false);
          setShowUserManagement(false);
          setShowAddTeam(false);
          setShowScheduleForm(false);
          setShowAdminProfile(false);
          setShowNewsManagement(false);
          setShowAddNews(false);
          setSelectedTeam(null);
          setSelectedRound('all');
        }}>
          <h3>Manage Fixtures</h3>
          <p>Schedule matches and update results</p>
        </div>
        <div className="dashboard-card" onClick={() => {
          setShowLeagueTable(!showLeagueTable);
          setShowTeams(false);
          setShowUserManagement(false);
          setShowFixtures(false);
          setShowAddTeam(false);
          setShowScheduleForm(false);
          setShowAdminProfile(false);
          setShowNewsManagement(false);
          setShowAddNews(false);
          setSelectedTeam(null);
        }}>
          <h3>League Table</h3>
          <p>View and manage league standings</p>
        </div>
        <div className="dashboard-card" onClick={() => {
          setShowUserManagement(!showUserManagement);
          setShowTeams(false);
          setShowLeagueTable(false);
          setShowFixtures(false);
          setShowAddTeam(false);
          setShowScheduleForm(false);
          setShowAdminProfile(false);
          setShowNewsManagement(false);
          setShowAddNews(false);
          setSelectedTeam(null);
        }}>
          <h3>User Management</h3>
          <p>Manage coaches and admin accounts</p>
        </div>
        <div className="dashboard-card" onClick={() => {
          setShowAdminProfile(!showAdminProfile);
          setShowUserManagement(false);
          setShowTeams(false);
          setShowLeagueTable(false);
          setShowFixtures(false);
          setShowAddTeam(false);
          setShowScheduleForm(false);
          setShowNewsManagement(false);
          setShowAddNews(false);
          setSelectedTeam(null);
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          setAdminProfileData({
            fullName: currentUser.fullName,
            email: currentUser.email,
            adminImage: currentUser.adminImage || currentUser.coachImage
          });
        }}>
          <h3>My Profile</h3>
          <p>Edit your admin profile and image</p>
        </div>
        <div className="dashboard-card" onClick={() => {
          setShowNewsManagement(!showNewsManagement);
          setShowAdminProfile(false);
          setShowUserManagement(false);
          setShowTeams(false);
          setShowLeagueTable(false);
          setShowFixtures(false);
          setShowAddTeam(false);
          setShowScheduleForm(false);
          setSelectedTeam(null);
          setShowAddNews(false);
        }}>
          <h3>News Management</h3>
          <p>Create and manage news articles</p>
        </div>
      </div>

      {showTeams && !selectedTeam && !showAddTeam && (
        <div className="teams-display">
          <div className="teams-header">
            <h3>Registered Teams</h3>
            <button className="add-team-btn" onClick={() => setShowAddTeam(true)}>
              <FaPlus /> Add Team
            </button>
          </div>
          <div className="teams-grid">
            {teams.map((team, index) => (
              <div key={index} className="team-info-card">
                <div className="team-logo-placeholder" onClick={() => setSelectedTeam(team)}>
                  <img
                    src={team.teamLogo || "/u-13.png"}
                    alt="Team Logo"
                    className="team-logo"
                  />
                </div>
                <h4 onClick={() => setSelectedTeam(team)}>{team.teamName}</h4>
                <p><strong>Coach:</strong> {team.teamCoach}</p>
                <div className="team-actions">
                  <button 
                    className={`disqualify-btn ${team.disqualified ? 'reactivate' : 'disqualify'}`}
                    onClick={() => handleDisqualifyTeam(index)}
                  >
                    <FaBan /> {team.disqualified ? 'Reactivate' : 'Disqualify'}
                  </button>
                </div>
                {team.disqualified && <span className="disqualified-badge">Disqualified</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddTeam && (
        <div className="add-team-form">
          <h3>Add New Team</h3>
          <form onSubmit={handleAddTeam}>
            <input
              type="text"
              placeholder="Team Name"
              value={newTeam.teamName}
              onChange={(e) => setNewTeam({...newTeam, teamName: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Coach Name"
              value={newTeam.teamCoach}
              onChange={(e) => setNewTeam({...newTeam, teamCoach: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Coach Email"
              value={newTeam.teamEmail}
              onChange={(e) => setNewTeam({...newTeam, teamEmail: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Coach Phone"
              value={newTeam.coachNumber}
              onChange={(e) => setNewTeam({...newTeam, coachNumber: e.target.value})}
              required
            />
            <div className="form-actions">
              <button type="submit">Add Team</button>
              <button type="button" onClick={() => {setShowAddTeam(false); setNewTeam({ teamName: '', teamCoach: '', teamEmail: '', coachNumber: '' });}}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {selectedTeam && (
        <div className="team-roster-display">
          <div className="roster-header">
            <h3>{selectedTeam.teamName} Roster</h3>
            <button onClick={() => setSelectedTeam(null)}>Close</button>
          </div>
          <div className="team-info-section">
            <div className="team-logo-placeholder">
              <img
                src={selectedTeam.teamLogo || "/u-13.png"}
                alt="Team Logo"
                className="team-logo"
              />
            </div>
            <div className="team-details">
              <p>
                <strong>Team Name:</strong> {selectedTeam.teamName}
              </p>
              <p>
                <strong>Coach:</strong> {selectedTeam.teamCoach}
              </p>
              <p>
                <strong>Email:</strong> {selectedTeam.teamEmail}
              </p>
              <p>
                <strong>Phone:</strong> {selectedTeam.coachNumber}
              </p>
            </div>
          </div>
          <div className="players-grid">
            {selectedTeam.players
              ?.filter((player) => player.fullName.trim())
              .map((player, index) => (
                <div key={index} className="player-info-card">
                  <div className="player-image-placeholder">
                    {player.playerImage ? (
                      <img
                        src={player.playerImage}
                        alt="Player"
                        className="player-image"
                      />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                  <p>
                    <strong>Name:</strong> {player.fullName}
                  </p>
                  <p>
                    <strong>DOB:</strong> {player.dateOfBirth}
                  </p>
                  <p>
                    <strong>Position:</strong> {player.position}
                  </p>
                  <p>
                    <strong>Number:</strong> {player.playerNumber}
                  </p>
                  <p>
                    <strong>Guardian:</strong> {player.guardianName}
                  </p>
                  <p>
                    <strong>Guardian Phone:</strong> {player.guardianNumber}
                  </p>
                </div>
              )) || <p>No players registered yet.</p>}
          </div>
        </div>
      )}

      {showFixtures && !showScheduleForm && editingFixture === null && updatingResult === null && (
        <div className="fixtures-display">
          <div className="fixtures-header">
            <h3>Fixtures Management</h3>
            <div className="fixtures-controls">
              <div className="round-selector">
                <label>Filter by Round:</label>
                <select 
                  value={selectedRound} 
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="round-select"
                >
                  <option value="all">All Rounds</option>
                  {Object.keys(
                    fixtures.reduce((rounds, fixture) => {
                      const roundKey = fixture.round || 'Manual';
                      rounds[roundKey] = true;
                      return rounds;
                    }, {})
                  ).sort((a, b) => {
                    if (a === 'Manual') return 1;
                    if (b === 'Manual') return -1;
                    return parseInt(a) - parseInt(b);
                  }).map(round => (
                    <option key={round} value={round}>Round {round}</option>
                  ))}
                </select>
              </div>
              <div className="fixtures-actions">
                <button className="auto-generate-btn" onClick={handleAutoGenerateFixtures}>
                  {fixtures.length > 0 ? 'Fixtures Generated' : 'Generate All Fixtures'}
                </button>
                <button className="reset-fixtures-btn" onClick={handleResetFixtures}>
                  Reset All
                </button>
                <button className="schedule-btn" onClick={() => setShowScheduleForm(true)}>
                  <FaPlus /> Schedule Fixture
                </button>
              </div>
            </div>
          </div>
          <div className="fixtures-list">
            {Object.entries(
              fixtures.reduce((rounds, fixture, index) => {
                const roundKey = fixture.round || 'Manual';
                if (!rounds[roundKey]) rounds[roundKey] = [];
                rounds[roundKey].push({ ...fixture, index });
                return rounds;
              }, {})
            ).filter(([roundName]) => selectedRound === 'all' || roundName === selectedRound)
            .sort(([a], [b]) => {
              if (a === 'Manual') return 1;
              if (b === 'Manual') return -1;
              return parseInt(a) - parseInt(b);
            }).map(([roundName, roundFixtures]) => (
              <div key={roundName} className="round-section">
                <h4 className="round-title">Round {roundName}</h4>
                <div className="round-fixtures">
                  {roundFixtures.map((fixture) => (
                    <div key={fixture.index} className="fixture-card">
                      <div className="fixture-teams">
                        <span className="home-team">{fixture.homeTeam}</span>
                        <span className="vs">vs</span>
                        <span className="away-team">{fixture.awayTeam}</span>
                      </div>
                      <div className="fixture-details">
                        <p><strong>Date:</strong> {fixture.date}</p>
                        <p><strong>Time:</strong> {fixture.time}</p>
                        <p><strong>Venue:</strong> {fixture.venue}</p>
                      </div>
                      {fixture.homeScore !== undefined ? (
                        <div className="fixture-result">
                          <span className="result">{fixture.homeScore} - {fixture.awayScore}</span>
                          <span className="status">{fixture.forfeit ? 'Forfeit' : 'Final'}</span>
                          {fixture.forfeit && <div className="cancel-reason">{fixture.cancelReason}</div>}
                        </div>
                      ) : (
                        <div className="fixture-actions">
                          <button className="update-result-btn" onClick={() => handleUpdateResult(fixture.index)}>Update Result</button>
                          <button className="edit-fixture-btn" onClick={() => handleEditFixture(fixture.index)}>Edit Fixture</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showScheduleForm && (
        <div className="schedule-form">
          <h3>Schedule New Fixture</h3>
          <form onSubmit={handleScheduleFixture}>
            <select
              value={newFixture.homeTeam}
              onChange={(e) => setNewFixture({...newFixture, homeTeam: e.target.value})}
              required
            >
              <option value="">Select Home Team</option>
              {teams.filter(t => !t.disqualified).map((team, i) => (
                <option key={i} value={team.teamName}>{team.teamName}</option>
              ))}
            </select>
            <select
              value={newFixture.awayTeam}
              onChange={(e) => setNewFixture({...newFixture, awayTeam: e.target.value})}
              required
            >
              <option value="">Select Away Team</option>
              {teams.filter(t => !t.disqualified && t.teamName !== newFixture.homeTeam).map((team, i) => (
                <option key={i} value={team.teamName}>{team.teamName}</option>
              ))}
            </select>
            <input
              type="date"
              value={newFixture.date}
              onChange={(e) => setNewFixture({...newFixture, date: e.target.value})}
              required
            />
            <input
              type="time"
              value={newFixture.time}
              onChange={(e) => setNewFixture({...newFixture, time: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Venue"
              value={newFixture.venue}
              onChange={(e) => setNewFixture({...newFixture, venue: e.target.value})}
              required
            />
            <div className="form-actions">
              <button type="submit">Schedule Fixture</button>
              <button type="button" onClick={() => {setShowScheduleForm(false); setNewFixture({ homeTeam: '', awayTeam: '', date: '', time: '', venue: '' });}}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {editingFixture !== null && (
        <div className="schedule-form">
          <h3>Edit Fixture</h3>
          <form onSubmit={handleSaveFixtureEdit}>
            <input
              type="date"
              value={editFixtureData.date || ''}
              onChange={(e) => setEditFixtureData({...editFixtureData, date: e.target.value})}
              required
            />
            <input
              type="time"
              value={editFixtureData.time || ''}
              onChange={(e) => setEditFixtureData({...editFixtureData, time: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Venue"
              value={editFixtureData.venue || ''}
              onChange={(e) => setEditFixtureData({...editFixtureData, venue: e.target.value})}
              required
            />
            <div className="form-actions">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditingFixture(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {updatingResult !== null && (
        <div className="result-form">
          <h3>Update Match Result</h3>
          <div className="match-info">
            <span>{fixtures[updatingResult]?.homeTeam} vs {fixtures[updatingResult]?.awayTeam}</span>
          </div>
          <form onSubmit={handleSaveResult}>
            <div className="scores-section">
              <div className="team-score">
                <label>{fixtures[updatingResult]?.homeTeam} Score:</label>
                <input
                  type="number"
                  min="0"
                  value={resultData.homeScore}
                  onChange={(e) => setResultData({...resultData, homeScore: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              <div className="team-score">
                <label>{fixtures[updatingResult]?.awayTeam} Score:</label>
                <input
                  type="number"
                  min="0"
                  value={resultData.awayScore}
                  onChange={(e) => setResultData({...resultData, awayScore: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
            </div>
            
            <div className="goals-section">
              <h4>{fixtures[updatingResult]?.homeTeam} Goals</h4>
              {Array.from({length: resultData.homeScore}, (_, i) => (
                <div key={i} className="goal-input">
                  <input
                    type="text"
                    placeholder="Goal scorer"
                    value={resultData.homeGoals[i]?.scorer || ''}
                    onChange={(e) => {
                      const newGoals = [...resultData.homeGoals];
                      newGoals[i] = {...newGoals[i], scorer: e.target.value};
                      setResultData({...resultData, homeGoals: newGoals});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Assist (optional)"
                    value={resultData.homeGoals[i]?.assist || ''}
                    onChange={(e) => {
                      const newGoals = [...resultData.homeGoals];
                      newGoals[i] = {...newGoals[i], assist: e.target.value};
                      setResultData({...resultData, homeGoals: newGoals});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g. 45')" 
                    value={resultData.homeGoals[i]?.time || ''}
                    onChange={(e) => {
                      const newGoals = [...resultData.homeGoals];
                      newGoals[i] = {...newGoals[i], time: e.target.value};
                      setResultData({...resultData, homeGoals: newGoals});
                    }}
                  />
                </div>
              ))}
              
              <h4>{fixtures[updatingResult]?.awayTeam} Goals</h4>
              {Array.from({length: resultData.awayScore}, (_, i) => (
                <div key={i} className="goal-input">
                  <input
                    type="text"
                    placeholder="Goal scorer"
                    value={resultData.awayGoals[i]?.scorer || ''}
                    onChange={(e) => {
                      const newGoals = [...resultData.awayGoals];
                      newGoals[i] = {...newGoals[i], scorer: e.target.value};
                      setResultData({...resultData, awayGoals: newGoals});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Assist (optional)"
                    value={resultData.awayGoals[i]?.assist || ''}
                    onChange={(e) => {
                      const newGoals = [...resultData.awayGoals];
                      newGoals[i] = {...newGoals[i], assist: e.target.value};
                      setResultData({...resultData, awayGoals: newGoals});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g. 45')"
                    value={resultData.awayGoals[i]?.time || ''}
                    onChange={(e) => {
                      const newGoals = [...resultData.awayGoals];
                      newGoals[i] = {...newGoals[i], time: e.target.value};
                      setResultData({...resultData, awayGoals: newGoals});
                    }}
                  />
                </div>
              ))}
            </div>
            
            <div className="cleansheet-section">
              <h4>Clean Sheets</h4>
              <div className="cleansheet-inputs">
                <div className="cleansheet-input">
                  <label>{fixtures[updatingResult]?.homeTeam} Goalkeeper:</label>
                  <input
                    type="text"
                    placeholder="Goalkeeper name (if clean sheet)"
                    value={resultData.homeCleanSheet}
                    onChange={(e) => setResultData({...resultData, homeCleanSheet: e.target.value})}
                  />
                </div>
                <div className="cleansheet-input">
                  <label>{fixtures[updatingResult]?.awayTeam} Goalkeeper:</label>
                  <input
                    type="text"
                    placeholder="Goalkeeper name (if clean sheet)"
                    value={resultData.awayCleanSheet}
                    onChange={(e) => setResultData({...resultData, awayCleanSheet: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit">Save Result</button>
              <button type="button" onClick={() => {setUpdatingResult(null); setResultData({ homeScore: 0, awayScore: 0, homeGoals: [], awayGoals: [], homeCleanSheet: '', awayCleanSheet: '' });}}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {showLeagueTable && (() => {
        const storedTeams = JSON.parse(localStorage.getItem('teams') || '[]');
        const storedFixtures = JSON.parse(localStorage.getItem('fixtures') || '[]');
        const completedMatches = storedFixtures.filter(f => f.homeScore !== undefined);
        const totalMatches = storedFixtures.length;
        const totalGoals = completedMatches.reduce((sum, match) => sum + match.homeScore + match.awayScore, 0);
        const avgGoalsPerMatch = completedMatches.length > 0 ? (totalGoals / completedMatches.length).toFixed(2) : 0;
        
        return (
          <div className="league-details-container">
            <div className="league-overview">
              <h3>League Overview</h3>
              <div className="league-stats">
                <div className="stat-box">
                  <span className="stat-number">{storedTeams.length}</span>
                  <span className="stat-label">Total Teams</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{storedTeams.filter(t => !t.disqualified).length}</span>
                  <span className="stat-label">Active Teams</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{completedMatches.length}</span>
                  <span className="stat-label">Matches Played</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{totalMatches - completedMatches.length}</span>
                  <span className="stat-label">Matches Remaining</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{totalGoals}</span>
                  <span className="stat-label">Total Goals</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{avgGoalsPerMatch}</span>
                  <span className="stat-label">Goals/Match</span>
                </div>
              </div>
            </div>
            
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
          </div>
        );
      })()}
      
      {showUserManagement && (
        <div className="user-management-display">
          <div className="user-management-header">
            <h3>User Management</h3>
            <div className="user-toggle">
              <button 
                className={showCoaches ? 'active' : ''}
                onClick={() => {
                  setShowCoaches(true);
                  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
                  const coaches = storedUsers.filter(user => user.role === 'coach');
                  setUsers(coaches);
                }}
              >
                Coaches
              </button>
              <button 
                className={!showCoaches ? 'active' : ''}
                onClick={() => {
                  setShowCoaches(false);
                  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
                  const admins = storedUsers.filter(user => user.role === 'admin');
                  setUsers(admins);
                }}
              >
                Admins
              </button>
            </div>
          </div>
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.id} className="user-info-card">
                <div className="user-header">
                  <div className="user-image-placeholder">
                    {user.coachImage || user.adminImage ? (
                      <img src={user.coachImage || user.adminImage} alt="User" className="user-image" />
                    ) : (
                      <FaUser className="user-icon" />
                    )}
                  </div>
                  <div className="user-status">
                    <span className={`status-badge ${user.suspended ? 'suspended' : 'active'}`}>
                      {user.suspended ? 'Suspended' : 'Active'}
                    </span>
                  </div>
                </div>
                <div className="user-details">
                  <p><strong>Name:</strong> {user.fullName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <button 
                  className={`suspend-btn ${user.suspended ? 'reactivate' : 'suspend'}`}
                  onClick={() => handleSuspendUser(user.id)}
                >
                  {user.suspended ? 'Reactivate Account' : 'Suspend Account'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showAdminProfile && (
        <div className="edit-details-display">
          <h3>Admin Profile</h3>
          <form onSubmit={handleSaveAdminProfile}>
            <div className="edit-section">
              <h4>Profile Details</h4>
              <div className="image-section">
                <div className="image-preview">
                  {adminProfileData.adminImage ? (
                    <img src={adminProfileData.adminImage} alt="Admin" className="preview-image" />
                  ) : (
                    <FaUser className="placeholder-icon" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAdminImageUpload(e)}
                  id="admin-image"
                />
                <label htmlFor="admin-image" className="image-upload-label">
                  Upload Profile Photo
                </label>
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={adminProfileData.fullName || ''}
                onChange={(e) => setAdminProfileData({...adminProfileData, fullName: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={adminProfileData.email || ''}
                onChange={(e) => setAdminProfileData({...adminProfileData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setShowAdminProfile(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {showNewsManagement && !showAddNews && (
        <div className="news-management-display">
          <div className="news-management-header">
            <h3>News Management</h3>
            <button className="add-news-btn" onClick={() => setShowAddNews(true)}>
              <FaPlus /> Add News Article
            </button>
          </div>
          <div className="news-articles-grid">
            {newsArticles.map((article, index) => (
              <div key={index} className="news-article-card">
                <div className="news-article-image">
                  <img src={article.image} alt={article.title} />
                </div>
                <div className="news-article-content">
                  <div className="news-article-date">{article.date}</div>
                  <h4>{article.title}</h4>
                  <p>{article.content.substring(0, 100)}...</p>
                  <button className="delete-news-btn" onClick={() => handleDeleteNews(index)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showAddNews && (
        <div className="add-news-form">
          <h3>Add News Article</h3>
          <form onSubmit={handleAddNews}>
            <input
              type="text"
              placeholder="Article Title"
              value={newArticle.title}
              onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleNewsImageUpload}
              required
            />
            <textarea
              placeholder="Article Content"
              value={newArticle.content}
              onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
              rows="10"
              required
            />
            <div className="form-actions">
              <button type="submit">Publish Article</button>
              <button type="button" onClick={() => {setShowAddNews(false); setNewArticle({ title: '', content: '', image: '' });}}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );

  function handleSuspendUser(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].suspended = !users[userIndex].suspended;
      localStorage.setItem('users', JSON.stringify(users));
      
      if (showCoaches) {
        const coaches = users.filter(user => user.role === 'coach');
        setUsers(coaches);
      } else {
        const admins = users.filter(user => user.role === 'admin');
        setUsers(admins);
      }
    }
  }

  function handleAddTeam(e) {
    e.preventDefault();
    const storedTeams = JSON.parse(localStorage.getItem('teams') || '[]');
    const teamWithDefaults = {
      ...newTeam,
      players: [],
      disqualified: false,
      createdAt: new Date().toISOString()
    };
    storedTeams.push(teamWithDefaults);
    localStorage.setItem('teams', JSON.stringify(storedTeams));
    
    // Create user account for the coach
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = storedUsers.find(user => user.email === newTeam.teamEmail);
    
    if (!existingUser) {
      const newUser = {
        id: Date.now().toString(),
        fullName: newTeam.teamCoach,
        email: newTeam.teamEmail,
        password: null, // No password initially
        role: 'coach',
        teamName: newTeam.teamName,
        suspended: false,
        needsPasswordSetup: true,
        createdAt: new Date().toISOString()
      };
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
    }
    
    setTeams(storedTeams);
    setShowAddTeam(false);
    setNewTeam({ teamName: '', teamCoach: '', teamEmail: '', coachNumber: '' });
  }

  function handleDisqualifyTeam(teamIndex) {
    const updatedTeams = [...teams];
    const teamName = updatedTeams[teamIndex].teamName;
    const isBeingDisqualified = !updatedTeams[teamIndex].disqualified;
    
    updatedTeams[teamIndex].disqualified = isBeingDisqualified;
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    setTeams(updatedTeams);
    
    // Update fixtures for disqualified team
    const updatedFixtures = [...fixtures];
    updatedFixtures.forEach(fixture => {
      if (fixture.homeTeam === teamName || fixture.awayTeam === teamName) {
        if (isBeingDisqualified) {
          // Only update unplayed matches (no existing score)
          if (fixture.homeScore === undefined && fixture.awayScore === undefined) {
            // Award 3-0 to opponent
            if (fixture.homeTeam === teamName) {
              fixture.homeScore = 0;
              fixture.awayScore = 3;
            } else {
              fixture.homeScore = 3;
              fixture.awayScore = 0;
            }
            fixture.forfeit = true;
            fixture.cancelReason = `${teamName} disqualified - 3-0 awarded to opponent`;
          }
          // Already played matches keep their original results
        } else {
          // Reactivating team - remove forfeit results but keep played results
          if (fixture.forfeit) {
            delete fixture.homeScore;
            delete fixture.awayScore;
            delete fixture.forfeit;
            delete fixture.cancelReason;
          }
        }
      }
    });
    localStorage.setItem('fixtures', JSON.stringify(updatedFixtures));
    setFixtures(updatedFixtures);
    
    // Update league table with new results
    updateLeagueTable(updatedFixtures);
  }

  function handleScheduleFixture(e) {
    e.preventDefault();
    const storedFixtures = JSON.parse(localStorage.getItem('fixtures') || '[]');
    storedFixtures.push(newFixture);
    localStorage.setItem('fixtures', JSON.stringify(storedFixtures));
    setFixtures(storedFixtures);
    setShowScheduleForm(false);
    setNewFixture({ homeTeam: '', awayTeam: '', date: '', time: '', venue: '' });
  }

  function handleUpdateResult(fixtureIndex) {
    setUpdatingResult(fixtureIndex);
    setResultData({ homeScore: 0, awayScore: 0, homeGoals: [], awayGoals: [], homeCleanSheet: '', awayCleanSheet: '' });
  }
  
  function handleSaveResult(e) {
    e.preventDefault();
    const updatedFixtures = [...fixtures];
    updatedFixtures[updatingResult] = {
      ...updatedFixtures[updatingResult],
      homeScore: resultData.homeScore,
      awayScore: resultData.awayScore,
      homeGoals: resultData.homeGoals.filter(g => g.scorer),
      awayGoals: resultData.awayGoals.filter(g => g.scorer),
      homeCleanSheet: resultData.homeCleanSheet,
      awayCleanSheet: resultData.awayCleanSheet
    };
    
    // Update player stats
    updatePlayerStats(updatedFixtures[updatingResult]);
    localStorage.setItem('fixtures', JSON.stringify(updatedFixtures));
    setFixtures(updatedFixtures);
    
    // Update league table
    updateLeagueTable(updatedFixtures);
    
    setUpdatingResult(null);
    setResultData({ homeScore: 0, awayScore: 0, homeGoals: [], awayGoals: [], homeCleanSheet: '', awayCleanSheet: '' });
    alert('Result updated successfully!');
  }
  
  function updatePlayerStats(fixture) {
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    let teamsUpdated = false;
    
    // Update home team player stats
    const homeTeamIndex = teams.findIndex(t => t.teamName === fixture.homeTeam);
    if (homeTeamIndex !== -1 && teams[homeTeamIndex].players) {
      teams[homeTeamIndex].players.forEach(player => {
        if (!player.stats) player.stats = { goals: 0, assists: 0, cleanSheets: 0 };
        
        // Count goals
        const goals = fixture.homeGoals?.filter(g => g.scorer === player.fullName).length || 0;
        player.stats.goals = (player.stats.goals || 0) + goals;
        
        // Count assists
        const assists = fixture.homeGoals?.filter(g => g.assist === player.fullName).length || 0;
        player.stats.assists = (player.stats.assists || 0) + assists;
        
        // Clean sheets for goalkeepers
        if (fixture.homeCleanSheet === player.fullName) {
          player.stats.cleanSheets = (player.stats.cleanSheets || 0) + 1;
        }
      });
      teamsUpdated = true;
    }
    
    // Update away team player stats
    const awayTeamIndex = teams.findIndex(t => t.teamName === fixture.awayTeam);
    if (awayTeamIndex !== -1 && teams[awayTeamIndex].players) {
      teams[awayTeamIndex].players.forEach(player => {
        if (!player.stats) player.stats = { goals: 0, assists: 0, cleanSheets: 0 };
        
        // Count goals
        const goals = fixture.awayGoals?.filter(g => g.scorer === player.fullName).length || 0;
        player.stats.goals = (player.stats.goals || 0) + goals;
        
        // Count assists
        const assists = fixture.awayGoals?.filter(g => g.assist === player.fullName).length || 0;
        player.stats.assists = (player.stats.assists || 0) + assists;
        
        // Clean sheets for goalkeepers
        if (fixture.awayCleanSheet === player.fullName) {
          player.stats.cleanSheets = (player.stats.cleanSheets || 0) + 1;
        }
      });
      teamsUpdated = true;
    }
    
    if (teamsUpdated) {
      localStorage.setItem('teams', JSON.stringify(teams));
      setTeams(teams);
    }
  }

  function updateLeagueTable(fixtures) {
    const teamStats = {};
    
    // Initialize stats for all teams
    teams.forEach(team => {
      teamStats[team.teamName] = {
        played: 0, won: 0, drawn: 0, lost: 0,
        goalsFor: 0, goalsAgainst: 0, points: 0
      };
    });
    
    // Calculate stats from fixtures with results (exclude cancelled)
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
    
    // Create sorted table
    const table = Object.entries(teamStats)
      .map(([teamName, stats]) => {
        const team = teams.find(t => t.teamName === teamName);
        return {
          teamName,
          teamLogo: team?.teamLogo,
          ...stats,
          goalDifference: stats.goalsFor - stats.goalsAgainst
        };
      })
      .sort((a, b) => {
        const aTeam = teams.find(t => t.teamName === a.teamName);
        const bTeam = teams.find(t => t.teamName === b.teamName);
        if (aTeam?.disqualified && !bTeam?.disqualified) return 1;
        if (!aTeam?.disqualified && bTeam?.disqualified) return -1;
        if (a.points !== b.points) return b.points - a.points;
        if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      })
      .map((team, index) => ({ ...team, position: index + 1 }));
    
    setLeagueTable(table);
  }

  function handleAdminImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAdminProfileData({...adminProfileData, adminImage: event.target.result});
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSaveAdminProfile(e) {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        fullName: adminProfileData.fullName,
        email: adminProfileData.email,
        adminImage: adminProfileData.adminImage
      };
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      setShowAdminProfile(false);
      alert('Profile updated successfully!');
    }
  }

  function handleAutoGenerateFixtures() {
    const activeTeams = teams.filter(t => !t.disqualified);
    if (activeTeams.length !== 20) {
      alert('Need exactly 20 active teams for fixture generation.');
      return;
    }
    
    const existingFixtures = JSON.parse(localStorage.getItem('fixtures') || '[]');
    if (existingFixtures.length > 0) {
      alert('Fixtures already generated! Use Reset All to regenerate.');
      return;
    }
    
    try {
      const teamObjects = activeTeams.map(team => ({
        id: team.teamName,
        name: team.teamName,
        stadium: team.stadium || `${team.teamName} Stadium`
      }));
      
      const generatedFixtures = generateFixtures(teamObjects);
      
      // Add dates (spread over season)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      
      const fixturesWithDates = generatedFixtures.map((fixture, index) => {
        const gameDate = new Date(startDate);
        gameDate.setDate(gameDate.getDate() + Math.floor(index / 10) * 7);
        
        return {
          ...fixture,
          homeTeam: fixture.homeTeam.name,
          awayTeam: fixture.awayTeam.name,
          date: gameDate.toISOString().split('T')[0],
          time: '15:00'
        };
      });
      
      localStorage.setItem('fixtures', JSON.stringify(fixturesWithDates));
      setFixtures(fixturesWithDates);
      alert('Generated complete 38-round fixture list!');
    } catch (error) {
      alert('Error generating fixtures: ' + error.message);
    }
  }

  function handleResetFixtures() {
    if (window.confirm('Are you sure you want to reset all fixtures? This action cannot be undone.')) {
      localStorage.setItem('fixtures', JSON.stringify([]));
      setFixtures([]);
      alert('All fixtures have been reset!');
    }
  }

  function handleEditFixture(fixtureIndex) {
    const fixture = fixtures[fixtureIndex];
    setEditingFixture(fixtureIndex);
    setEditFixtureData({
      date: fixture.date,
      time: fixture.time,
      venue: fixture.venue
    });
  }

  function handleSaveFixtureEdit(e) {
    e.preventDefault();
    const updatedFixtures = [...fixtures];
    updatedFixtures[editingFixture] = {
      ...updatedFixtures[editingFixture],
      ...editFixtureData
    };
    localStorage.setItem('fixtures', JSON.stringify(updatedFixtures));
    setFixtures(updatedFixtures);
    setEditingFixture(null);
    setEditFixtureData({});
    alert('Fixture updated successfully!');
  }
  
  function handleNewsImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewArticle({...newArticle, image: event.target.result});
      };
      reader.readAsDataURL(file);
    }
  }
  
  function handleAddNews(e) {
    e.preventDefault();
    if (newsArticles.length >= 5) {
      alert('Maximum of 5 news articles allowed. Please delete old articles first.');
      return;
    }
    const article = {
      ...newArticle,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      story: newArticle.title.toLowerCase().replace(/\s+/g, '-')
    };
    const updatedNews = [...newsArticles, article];
    try {
      localStorage.setItem('newsStories', JSON.stringify(updatedNews));
      setNewsArticles(updatedNews);
      setShowAddNews(false);
      setNewArticle({ title: '', content: '', image: '' });
      alert('News article published successfully!');
    } catch (error) {
      alert('Storage quota exceeded. Please delete some articles first.');
    }
  }
  
  function handleDeleteNews(index) {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const updatedNews = newsArticles.filter((_, i) => i !== index);
      localStorage.setItem('newsStories', JSON.stringify(updatedNews));
      setNewsArticles(updatedNews);
    }
  }
}

export default AdminDashboard;
