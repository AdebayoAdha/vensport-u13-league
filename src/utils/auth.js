// Simple localStorage-based authentication system
export const authService = {
  // Register a new user
  register: (userData) => {
    const { fullName, email, password, confirmPassword, role = 'coach' } = userData;
    
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser && existingUser.password) {
      throw new Error('User already exists');
    }
    
    if (existingUser && existingUser.needsPasswordSetup) {
      // Update existing admin-created user with password
      existingUser.password = password;
      existingUser.needsPasswordSetup = false;
      if (fullName) existingUser.fullName = fullName;
      localStorage.setItem('users', JSON.stringify(users));
      return { success: true, message: 'Account setup successful' };
    }
    
    const newUser = {
      id: Date.now(),
      fullName,
      email,
      password, // In production, this should be hashed
      role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Registration successful' };
  },
  
  // Login user
  login: (credentials) => {
    const { email, password } = credentials;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    if (user.needsPasswordSetup) {
      throw new Error('Account needs setup. Please register to set your password.');
    }
    
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    if (user.suspended) {
      throw new Error('Account suspended. Contact administrator.');
    }
    
    // Link coach to their team
    if (user.role === 'coach') {
      const teams = JSON.parse(localStorage.getItem('teams') || '[]');
      const userTeam = teams.find(team => team.teamEmail === user.email || team.coachEmail === user.email);
      if (userTeam) {
        user.teamName = userTeam.teamName;
        user.teamData = userTeam;
      }
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    let redirectTo;
    if (user.role === 'admin') {
      redirectTo = '/admin-dashboard';
    } else {
      redirectTo = '/team-dashboard';
    }
    
    return { success: true, user, redirectTo };
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('currentUser');
    return { success: true };
  },
  
  // Get current user
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  },
  
  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('currentUser');
  },
  
  // Check if current user has registered a team
  hasRegisteredTeam: () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || currentUser.role === 'admin') return false;
    
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    return teams.some(team => team.coachEmail === currentUser.email || team.teamEmail === currentUser.email);
  },
  
  // Reset password
  resetPassword: (email) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      throw new Error('Email not found');
    }
    
    users[userIndex].password = 'newpass123';
    users[userIndex].needsPasswordSetup = false;
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Password reset successful' };
  }
};