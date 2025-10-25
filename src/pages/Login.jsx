import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);

    try {
      const response = await fetch('http://localhost/boibondhu/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        alert('Login successful!');
        // Use context login function instead of directly localStorage
        login(result.user);
        // Redirect to home page or dashboard
        navigate('/');
      } else {
        alert(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="featured-books">
      <div className="container">
        <div className="form-container-original">
          <h1>Welcome Back</h1>
          <h2>Dive into Book Swaps!</h2>
          
          <form onSubmit={handleSubmit} className="login-form-original">
            <div className="form-group-original">
              <label>Email Address</label>
              <div className="input-with-indicator">
                <span className="input-indicator"><FaEnvelope /></span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <small>Use your campus email for instant verification</small>
            </div>
            
            <div className="form-group-original">
              <label>Password</label>
              <div className="input-with-indicator">
                <span className="input-indicator"><FaLock /></span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>
            
            <button type="submit" className="login-btn-original">
              Log In
            </button>
            
            <div className="divider">
              <span>Or continue with</span>
            </div>
            
            <div className="social-buttons">
              <button type="button" className="social-btn google-btn">
                <FaGoogle /> Google
              </button>
              <button type="button" className="social-btn facebook-btn">
                <FaFacebook /> Facebook
              </button>
            </div>
            
            <div className="auth-redirect">
              <Link to="/signup">New here? Sign up now</Link>
            </div>
          </form>
          
          <div className="secure-login">
            Secure login powered by Auth0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;