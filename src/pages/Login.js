import { useState } from 'react';
import { authService } from '../utils/auth';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      if (isLogin) {
        const result = authService.login(formData);
        setMessage('Login successful!');
        setTimeout(() => {
          window.location.href = result.redirectTo;
        }, 1000);
      } else {
        authService.register(formData);
        setMessage('Registration successful!');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotPassword = () => {
    if (!formData.resetEmail) {
      setMessage('Please enter your email address.');
      return;
    }
    
    try {
      authService.resetPassword(formData.resetEmail);
      setMessage('Password reset successful! Your new password is: newpass123');
      setShowForgotPassword(false);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="section">
      <div className="auth-card">
        <div className="auth-toggle">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {message && <p className="auth-message">{message}</p>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input 
                type="text" 
                name="fullName" 
                placeholder="Full Name" 
                onChange={handleChange} 
                required 
              />
              <select 
                name="role" 
                onChange={handleChange} 
                required
              >
                <option value="">Select Role</option>
                <option value="coach">Coach</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
          {!isLogin && (
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              onChange={handleChange} 
              required 
            />
          )}
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        
        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
        
        {isLogin && (
          <p className="auth-switch">
            <span onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </span>
          </p>
        )}
      </div>
      
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <div className="modal-content">
            <h3>Reset Password</h3>
            <p>Enter your email to reset your password:</p>
            <input 
              type="email" 
              placeholder="Email" 
              onChange={(e) => setFormData({...formData, resetEmail: e.target.value})}
            />
            <div className="modal-actions">
              <button onClick={handleForgotPassword}>Reset Password</button>
              <button onClick={() => setShowForgotPassword(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Login;