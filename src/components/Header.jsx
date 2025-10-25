import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBook, FaHome, FaSearch, FaComments, FaQuestionCircle, FaSignOutAlt, FaUser, FaPlus, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const navLinkStyle = (isActive) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '8px 18px',
  borderRadius: 24,
  textDecoration: 'none',
  fontWeight: 500,
  color: isActive ? '#2056a8' : '#34394d',
  background: isActive ? 'rgba(32,86,168,0.07)' : 'transparent',
  boxShadow: isActive ? '0 1px 4px rgba(32,86,168,0.11)' : 'none',
  transition: 'all 0.15s',
});
const pillBtn = (filled) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 22px',
  fontWeight: 700,
  fontSize: 17,
  border: filled ? 'none' : '2px solid #2056a8',
  background: filled ? '#2056a8' : '#fff',
  color: filled ? '#fff' : '#2056a8',
  borderRadius: 24,
  cursor: 'pointer',
  marginLeft: 9,
  boxShadow: filled ? '0 2px 8px #2c5aa034' : 'none',
  transition: 'background 0.16s,color 0.18s',
});
const ProfileDropItem = { padding: '8px 28px', fontWeight: 500, color: '#333', textDecoration: 'none', cursor: 'pointer' };
const dropBox = {
  position: 'absolute',
  top: '115%',
  right: 0,
  background: '#fff',
  border: '1.5px solid #eee',
  borderRadius: 10,
  zIndex: 99,
  minWidth: 160,
  minHeight: 0,
  boxShadow: '0 4px 16px rgba(60,90,160,.13)',
  animation: 'dropdownFade 0.3s',
};

const unreadCircle = {
  background: '#e13d41',
  color: '#fff',
  borderRadius: '50%',
  fontSize: 12,
  padding: '2px 7px',
  minWidth: 22,
  textAlign: 'center',
  fontWeight: 700,
  marginLeft: 8,
  animation: 'pulse 1.2s infinite',
  display: 'inline-block',
  position: 'relative',
  top: -2,
};

const Header = () => {
  const { user, directLogout, unreadCount } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      directLogout();
      setDropdownOpen(false);
    }
  };

  return (
    <header style={{
      width: '100%',
      padding: '0.65rem 0',
      background: '#fff',
      boxShadow: '0 3px 18px 0 rgba(32,86,168,0.08)',
      zIndex: 88,
      position: 'relative'
    }}>
      <nav style={{
        maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'
      }}>
        {/* Logo/Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 800, color: '#2056a8', fontSize: 29, letterSpacing: 1 }}>
          <FaBook size={31} style={{ color: '#2056a8' }} />
          <span>BoiBondhu</span>
        </Link>
        {/* Nav Links */}
        <ul style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 30, margin: 0 }}>
          <li>
            <NavLink to="/" style={({ isActive }) => navLinkStyle(isActive)}>
              <FaHome style={{ marginRight: 6 }} /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/search" style={({ isActive }) => navLinkStyle(isActive)}>
              <FaSearch style={{ marginRight: 6 }} /> Search Books
            </NavLink>
          </li>
          {!user && (
            <>
              <li>
                <NavLink to="/about" style={({ isActive }) => navLinkStyle(isActive)}>About Us</NavLink>
              </li>
              <li>
                <NavLink to="/contact" style={({ isActive }) => navLinkStyle(isActive)}>Contact Us</NavLink>
              </li>
              <li>
                <NavLink to="/faq" style={({ isActive }) => navLinkStyle(isActive)}>
                  <FaQuestionCircle style={{ marginRight: 6 }} /> FAQ
                </NavLink>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <NavLink to="/discussions" style={({ isActive }) => navLinkStyle(isActive)}>
                  <FaComments style={{ marginRight: 6 }} /> Discussions
                </NavLink>
              </li>
              <li style={{ position: 'relative' }}>
                <NavLink to="/messages" style={({ isActive }) => navLinkStyle(isActive)}>
                  <FaEnvelope style={{ marginRight: 5 }} /> Messages
                  {unreadCount > 0 && (
                    <span style={unreadCircle}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              </li>
            </>
          )}
        </ul>
        {/* Auth/Profile Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {!user ? (
            <>
              <Link to="/login" style={pillBtn(false)}>
                Login
              </Link>
              <Link to="/signup" style={pillBtn(true)}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div style={{ position: 'relative', marginRight: 9 }}>
                <button
                  onClick={() => setDropdownOpen((d) => !d)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, background: '#f3f6fd', color: '#2056a8',
                    border: 'none', borderRadius: 23, padding: '8px 17px', fontWeight: 600, cursor: 'pointer',
                    fontSize: 16, boxShadow: dropdownOpen ? '0 2px 11px #2056a82a' : 'none',
                    marginRight: 5, transition: 'box-shadow 0.17s'
                  }}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <FaUser size={18} /> {user.name}
                  <span style={{
                    fontSize: 14, marginLeft: 5,
                    transition: 'transform .25s', display: 'inline-block',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
                  }}>▼</span>
                </button>
                {dropdownOpen && (
                  <ul style={dropBox}>
                    <li>
                      <Link to="/profile" style={ProfileDropItem} onClick={() => setDropdownOpen(false)}>
                        👤 My Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-listings" style={ProfileDropItem} onClick={() => setDropdownOpen(false)}>
                        📚 My Listings
                      </Link>
                    </li>
                    <li>
                      <Link to="/wishlist" style={ProfileDropItem} onClick={() => setDropdownOpen(false)}>
                        ❤️ My Wishlist
                      </Link>
                    </li>
                    <li>
                      <Link to="/reviews" style={ProfileDropItem} onClick={() => setDropdownOpen(false)}>
                        ⭐ My Reviews
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" style={ProfileDropItem} onClick={() => setDropdownOpen(false)}>
                        ⚙️ Settings
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} style={{ ...ProfileDropItem, color: '#e13d41', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <FaSignOutAlt style={{ marginRight: 5 }} /> Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              <Link to="/add-listing" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 20px', background: '#28a745', color: '#fff', fontWeight: 700,
                borderRadius: 24, boxShadow: '0 2px 10px #28a74522', textDecoration: 'none',
                fontSize: 17, marginLeft: 6, transition: 'background 0.18s'
              }}>
                <FaPlus /> Sell Books
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 #e13d41; }
          50% { box-shadow: 0 0 0 7px #e13d4120; }
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-18px);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
    </header>
  );
};

export default Header;
