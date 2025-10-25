import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer" style={{ backgroundColor: '#0d1a2b', color: '#ccc', padding: '2rem 1rem' }}>
      <div className="footer-simple" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <div className="footer-main" style={{ flex: '1 1 250px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e90ff' }}>
            <img src="/boibondhu-logo.svg" alt="BoiBondhu Logo" width="28" height="28" style={{ display: 'block' }} />
            BoiBondhu
          </h3>
          <p>Your trusted platform for buying, selling, and exchanging textbooks with fellow students </p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '1.2rem', marginTop: '1rem' }}>
            <a href="#" aria-label="Facebook" style={{ color: '#ccc' }}><FaFacebook /></a>
            <a href="#" aria-label="Twitter" style={{ color: '#ccc' }}><FaTwitter /></a>
            <a href="#" aria-label="Instagram" style={{ color: '#ccc' }}><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn" style={{ color: '#ccc' }}><FaLinkedin /></a>
          </div>
        </div>
        
        <div className="footer-columns" style={{ flex: '2 1 500px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="footer-col" style={{ minWidth: '150px' }}>
            <h4>Quick Links</h4>
            <Link to="/" style={{ color: '#ccc', display: 'block', margin: '0.25rem 0' }}>Home</Link>
            <Link to="/search" style={{ color: '#ccc', display: 'block', margin: '0.25rem 0' }}>Search Books</Link>
            <Link to="/categories" style={{ color: '#ccc', display: 'block', margin: '0.25rem 0' }}>Categories</Link>
            <Link to="/discussions" style={{ color: '#ccc', display: 'block', margin: '0.25rem 0' }}>Discussions</Link>
          </div>
          
          <div className="footer-col" style={{ minWidth: '150px' }}>
            <h4>Support</h4>
            <Link to="/faq" style={{ color: '#ccc', display: 'block', margin: '0.25rem 0' }}>FAQ</Link>
            <a href="#" style={{ color: '#ccc', display: 'block', margin: '0.25rem 0' }}>About Us</a>
            <a href="#" style={{ color: '#ccc', display: 'block', margin: '0.25rem 0' }}>Contact</a>
            <a href="#" style={{ color: '#ccc', display: 'block', margin: '0.25rem 0' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#ccc', display: 'block', margin: '0.25rem 0' }}>Terms of Service</a>
          </div>
          
          <div className="footer-col" style={{ minWidth: '200px' }}>
            <h4>Stay Updated</h4>
            <p>Subscribe to get the latest book listings and campus deals.</p>
            <div className="subscribe-simple" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input type="email" placeholder="Your email" style={{ flex: '1', padding: '0.5rem', borderRadius: '4px', border: 'none' }} />
              <button style={{ backgroundColor: '#1e90ff', color: 'white', border: 'none', padding: '0 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                <FaEnvelope />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom-simple" style={{ borderTop: '1px solid #34495e', paddingTop: '1rem', textAlign: 'center', color: '#888' }}>
        <p>© 2025 BoiBondhu. All rights reserved.</p>
        <p><FaEnvelope style={{ marginRight: '0.5rem' }} /> support@boibondhu.com</p>
      </div>
    </footer>
  );
};

export default Footer;
