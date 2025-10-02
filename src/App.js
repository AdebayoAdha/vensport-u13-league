import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
import { authService } from "./utils/auth";
import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Results from "./pages/Results";
import Table from "./pages/Table";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import NewsStory from "./pages/NewsStory";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TeamDashboard from "./pages/TeamDashboard";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
    window.location.href = '/login';
  };

  const handleDashboard = () => {
    const dashboardUrl = currentUser.role === 'admin' ? '/admin-dashboard' : '/team-dashboard';
    window.location.href = dashboardUrl;
    setShowProfileMenu(false);
  };

  return (
    <Router>
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
            <Link to="/">Home</Link>
            <Link to="/clubs">Clubs</Link>
            <Link to="/results">Fixtures & Results</Link>
            <Link to="/table">League Table</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/news">News</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">About</Link>
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
              <Link to="/login">
                <FaUser /> Login
              </Link>
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
          <Link to="/" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/clubs" onClick={toggleMenu}>
            Clubs
          </Link>
          <Link to="/results" onClick={toggleMenu}>
            Fixtures & Results
          </Link>
          <Link to="/table" onClick={toggleMenu}>
            League Table
          </Link>
          <Link to="/gallery" onClick={toggleMenu}>
            Gallery
          </Link>
          <Link to="/news" onClick={toggleMenu}>
            News
          </Link>
          <Link to="/contact" onClick={toggleMenu}>
            Contact
          </Link>
          <Link to="/about" onClick={toggleMenu}>
            About
          </Link>
          <Link to="/login" onClick={toggleMenu}>
            <FaUser /> Login
          </Link>
        </div>

        <div className={`main-content ${isMenuOpen ? "blurred" : ""}`}>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/results" element={<Results />} />
              <Route path="/table" element={<Table />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/news" element={<News />} />
              <Route path="/story/:storyId" element={<NewsStory />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/team-dashboard" element={<TeamDashboard />} />
            </Routes>
          </main>

          <footer className="footer">
            <div className="footer-top">
              <div className="logo-title">
                <img src="/u-13.png" alt="VenSport Logo" className="logo" />
                <h1>VenSport U-13 League</h1>
              </div>
              <div className="social-links">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
            <div className="partners">
              <p>Partners</p>
              <div className="partners-links">
                <a
                  href="https://www.coca-cola.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/coke.svg"
                    alt="Coca-Cola"
                    className="partner-logo"
                  />
                </a>
                <a
                  href="https://indomie.ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/indomie.png"
                    alt="Indomie"
                    className="partner-logo"
                  />
                </a>
                <a
                  href="https://lssc.lg.gov.ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/lssc.png" alt="LSSC" className="partner-logo" />
                </a>
                <a
                  href="https://www.lagosfa.com.ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/lsfa.png"
                    alt="Lagos FA"
                    className="partner-logo"
                  />
                </a>
                <a
                  href="https://www.nestle.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://logos-world.net/wp-content/uploads/2020/09/Nestle-Logo.png"
                    alt="Nestle"
                    className="partner-logo"
                  />
                </a>
                <a
                  href="https://beloxxigroup.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/beloxxi.png"
                    alt="Beloxxi"
                    className="partner-logo"
                  />
                </a>
              </div>
            </div>
            <p>&copy; 2026 VenSport U-13 League. All rights reserved.</p>
          </footer>
        </div>

        {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
      </div>
    </Router>
  );
}

export default App;
