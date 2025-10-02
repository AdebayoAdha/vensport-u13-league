export const generateFixtures = (teams) => {
  if (teams.length !== 20) {
    throw new Error('Fixture generation requires exactly 20 teams');
  }

  const fixtures = [];
  const teamList = [...teams];
  const rounds = 19;
  
  // First half of season - round-robin algorithm
  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < 10; i++) {
      const home = teamList[i];
      const away = teamList[19 - i];
      
      // Randomize home/away for each match
      const isHomeFirst = Math.random() > 0.5;
      
      fixtures.push({
        id: `R${round + 1}M${i + 1}`,
        round: round + 1,
        homeTeam: isHomeFirst ? home : away,
        awayTeam: isHomeFirst ? away : home,
        venue: (isHomeFirst ? home : away).stadium || `${(isHomeFirst ? home : away).name} Stadium`,
        status: 'scheduled'
      });
    }
    
    // Rotate teams (keep first team fixed)
    teamList.splice(1, 0, teamList.pop());
  }
  
  // Second half - reverse fixtures
  for (let round = 0; round < rounds; round++) {
    const originalMatches = fixtures.filter(f => f.round === round + 1);
    
    originalMatches.forEach((match, index) => {
      fixtures.push({
        id: `R${round + 20}M${index + 1}`,
        round: round + 20,
        homeTeam: match.awayTeam,
        awayTeam: match.homeTeam,
        venue: match.awayTeam.stadium || `${match.awayTeam.name} Stadium`,
        status: 'scheduled'
      });
    });
  }
  
  return fixtures;
};