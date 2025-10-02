import { useState } from 'react';

function PlayerRegistration({ onPlayersRegistered }) {
  const [players, setPlayers] = useState(
    Array(20).fill().map(() => ({
      fullName: '',
      dateOfBirth: '',
      position: '',
      playerNumber: '',
      guardianName: '',
      guardianNumber: ''
    }))
  );
  const [message, setMessage] = useState('');

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = players.map((player, i) => 
      i === index ? { ...player, [field]: value } : player
    );
    setPlayers(updatedPlayers);
    
    // Auto-save when player name is entered
    if (field === 'fullName' && value.trim()) {
      savePlayersToStorage(updatedPlayers);
    }
  };
  
  const savePlayersToStorage = (playersData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const teams = JSON.parse(localStorage.getItem('teams') || '[]');
      
      const teamIndex = teams.findIndex(team => team.coachEmail === currentUser.email || team.teamEmail === currentUser.email);
      if (teamIndex !== -1) {
        teams[teamIndex].players = playersData;
        localStorage.setItem('teams', JSON.stringify(teams));
      }
    } catch (error) {
      console.error('Error saving players:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const registeredPlayers = players.filter(player => player.fullName.trim());
    
    if (registeredPlayers.length < 15) {
      setMessage('Minimum 15 players required to register the team.');
      return;
    }
    
    try {
      savePlayersToStorage(players);
      setMessage('Players registered successfully!');
      setTimeout(() => onPlayersRegistered(), 1500);
    } catch (error) {
      setMessage('Error registering players');
    }
  };

  return (
    <section className="section">
      <div className="player-registration-container">
        <h2>Register Players (20 Players)</h2>
        {message && <p className="auth-message">{message}</p>}
        
        <form className="player-form" onSubmit={handleSubmit}>
          {players.map((player, index) => (
            <div key={index} className="player-card">
              <h4>Player {index + 1}</h4>
              <div className="player-row">
                <input 
                  type="text" 
                  placeholder="Player Full Name" 
                  value={player.fullName}
                  onChange={(e) => handlePlayerChange(index, 'fullName', e.target.value)}
                />
                <input 
                  type="date" 
                  placeholder="Date of Birth" 
                  value={player.dateOfBirth}
                  onChange={(e) => handlePlayerChange(index, 'dateOfBirth', e.target.value)}
                />
              </div>
              <div className="player-row">
                <input 
                  type="text" 
                  placeholder="Position" 
                  value={player.position}
                  onChange={(e) => handlePlayerChange(index, 'position', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Player Number" 
                  value={player.playerNumber}
                  onChange={(e) => handlePlayerChange(index, 'playerNumber', e.target.value)}
                />
              </div>
              <div className="player-row">
                <input 
                  type="text" 
                  placeholder="Guardian Name" 
                  value={player.guardianName}
                  onChange={(e) => handlePlayerChange(index, 'guardianName', e.target.value)}
                />
                <input 
                  type="tel" 
                  placeholder="Guardian Number" 
                  value={player.guardianNumber}
                  onChange={(e) => handlePlayerChange(index, 'guardianNumber', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          <div className="form-actions">
            <button type="submit" className="register-btn">Register All Players</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default PlayerRegistration;