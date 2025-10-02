import { useState } from 'react';

function TeamRegistration({ onTeamRegistered }) {
  const [teamData, setTeamData] = useState({});
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const teams = JSON.parse(localStorage.getItem('teams') || '[]');
      
      const newTeam = {
        id: Date.now(),
        ...teamData,
        coachId: currentUser.id,
        coachEmail: currentUser.email,
        createdAt: new Date().toISOString()
      };
      
      teams.push(newTeam);
      localStorage.setItem('teams', JSON.stringify(teams));
      
      // Update user with team info
      currentUser.teamId = newTeam.id;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      setMessage('Team registered successfully! Now register your players.');
      setTimeout(() => onTeamRegistered(), 1500);
    } catch (error) {
      setMessage('Error registering team');
    }
  };

  const handleChange = (e) => {
    if (e.target.type === 'file' && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTeamData({ ...teamData, [e.target.name]: event.target.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setTeamData({ ...teamData, [e.target.name]: e.target.value });
    }
  };

  return (
    <section className="section">
      <div className="auth-card">
        <h2>Register Your Team</h2>
        {message && <p className="auth-message">{message}</p>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="teamName" 
            placeholder="Team Name" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="teamCoach" 
            placeholder="Team Coach" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="teamEmail" 
            placeholder="Team Email" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="file" 
            name="teamLogo" 
            accept="image/*" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="tel" 
            name="coachNumber" 
            placeholder="Coach Phone Number" 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Register Team</button>
        </form>
      </div>
    </section>
  );
}

export default TeamRegistration;