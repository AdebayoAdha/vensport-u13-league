'use client'

import { useState, useEffect } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaBars,
  FaUser,
  FaTimes,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { authService } from "../src/utils/auth";
import Home from "../src/pages/Home";
import Clubs from "../src/pages/Clubs";
import Results from "../src/pages/Results";
import Table from "../src/pages/Table";
import Gallery from "../src/pages/Gallery";
import News from "../src/pages/News";
import NewsStory from "../src/pages/NewsStory";
import Contact from "../src/pages/Contact";
import About from "../src/pages/About";
import Login from "../src/pages/Login";
import AdminDashboard from "../src/pages/AdminDashboard";
import TeamDashboard from "../src/pages/TeamDashboard";
import { API } from "../lib/api";

interface User {
  fullName: string;
  role: 'admin' | 'team';
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [storyId, setStoryId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setShowProfileMenu(false);
    setCurrentPage('login');
  };

  const handleDashboard = () => {
    if (!currentUser) return;
    const dashboardPage = currentUser.role === 'admin' ? 'admin-dashboard' : 'team-dashboard';
    setCurrentPage(dashboardPage);
    setShowProfileMenu(false);
  };

  const navigate = (page: string, id: string | null = null) => {
    setCurrentPage(page);
    setStoryId(id);
    setIsMenuOpen(false);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'clubs': return <Clubs />;
      case 'results': return <Results />;
      case 'table': return <Table />;
      case 'gallery': return <Gallery />;
      case 'news': return <News onNavigate={navigate} />;
      case 'story': return <NewsStory storyId={storyId} onNavigate={navigate} />;
      case 'contact': return <Contact />;
      case 'about': return <About />;
      case 'login': return <Login />;
      case 'admin-dashboard': return <AdminDashboard />;
      case 'team-dashboard': return <TeamDashboard />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="App">
      <header className={`header ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="left-section">
          <button className="menu-btn" onClick={toggleMenu}>
            <FaBars />
          </button>
          <div className={`logo-title ${isMenuOpen ? "hidden" : ""}`}>
            <img src="/u-13.png" alt="VenSport Logo" className="logo" />
            <h1>VenSport U-13 League</h1>
          </div>
        </div>
        <nav>
          <button onClick={() => navigate('home')}>Home</button>
          <button onClick={() => navigate('clubs')}>Clubs</button>
          <button onClick={() => navigate('results')}>Fixtures & Results</button>
          <button onClick={() => navigate('table')}>League Table</button>
          <button onClick={() => navigate('gallery')}>Gallery</button>
          <button onClick={() => navigate('news')}>News</button>
          <button onClick={() => navigate('contact')}>Contact</button>
          <button onClick={() => navigate('about')}>About</button>
          {currentUser ? (
            <div className="profile-dropdown">
              <button 
                className="profile-btn" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <FaUser /> {currentUser.fullName}
              </button>
              {showProfileMenu && (
                <div className="profile-menu">
                  <button onClick={handleDashboard}>
                    <FaTachometerAlt /> Dashboard
                  </button>
                  <button onClick={handleLogout}>
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('login')}>
              <FaUser /> Login
            </button>
          )}
        </nav>
      </header>

      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-header">
          <button className="close-btn" onClick={toggleMenu}>
            <FaTimes />
          </button>
          <div className="logo-title">
            <img src="/u-13.png" alt="VenSport Logo" className="logo" />
            <h1>VenSport U-13 League</h1>
          </div>
        </div>
        <button onClick={() => navigate('home')}>Home</button>
        <button onClick={() => navigate('clubs')}>Clubs</button>
        <button onClick={() => navigate('results')}>Fixtures & Results</button>
        <button onClick={() => navigate('table')}>League Table</button>
        <button onClick={() => navigate('gallery')}>Gallery</button>
        <button onClick={() => navigate('news')}>News</button>
        <button onClick={() => navigate('contact')}>Contact</button>
        <button onClick={() => navigate('about')}>About</button>
        <button onClick={() => navigate('login')}>
          <FaUser /> Login
        </button>
      </div>

      <div className={`main-content ${isMenuOpen ? "blurred" : ""}`}>
        <main>
          {renderPage()}
        </main>

        <footer className="footer">
          <div className="footer-top">
            <div className="logo-title">
              <img src="/u-13.png" alt="VenSport Logo" className="logo" />
              <h1>VenSport U-13 League</h1>
            </div>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>
          <div className="partners">
            <p>Partners</p>
            <div className="partners-links">
              <a href="https://www.coca-cola.com/" target="_blank" rel="noopener noreferrer">
                <img src="/coke.svg" alt="Coca-Cola" className="partner-logo" />
              </a>
              <a href="https://indomie.ng/" target="_blank" rel="noopener noreferrer">
                <img src="/indomie.png" alt="Indomie" className="partner-logo" />
              </a>
              <a href="https://lssc.lg.gov.ng/" target="_blank" rel="noopener noreferrer">
                <img src="/lssc.png" alt="LSSC" className="partner-logo" />
              </a>
              <a href="https://www.lagosfa.com.ng/" target="_blank" rel="noopener noreferrer">
                <img src="/lsfa.png" alt="Lagos FA" className="partner-logo" />
              </a>
              <a href="https://www.nestle.com/" target="_blank" rel="noopener noreferrer">
                <img src="https://logos-world.net/wp-content/uploads/2020/09/Nestle-Logo.png" alt="Nestle" className="partner-logo" />
              </a>
              <a href="https://beloxxigroup.com/" target="_blank" rel="noopener noreferrer">
                <img src="/beloxxi.png" alt="Beloxxi" className="partner-logo" />
              </a>
            </div>
          </div>
          <p>&copy; 2026 VenSport U-13 League. All rights reserved.</p>
        </footer>
      </div>

      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </div>
  );
}