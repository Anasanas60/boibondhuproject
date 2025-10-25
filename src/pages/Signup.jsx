import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaUser, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    campus: 'MBSTU',
    year: '2024',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup attempt:', formData);

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Check if terms are agreed
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    try {
      const response = await fetch('http://localhost/boibondhu/api/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
          campus: formData.campus,
          year: parseInt(formData.year)
        })
      });
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        alert('Registration successful! You can now login.');
        // Clear form after successful registration
        setFormData({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          campus: 'MBSTU',
          year: '2024',
          agreeToTerms: false
        });
      } else {
        alert(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="featured-books">
      <div className="container">
        <div className="form-container-original">
          <h1>Join BoiBondhu</h1>
          <h2>Start Swapping Books in Seconds!</h2>
          
          <form onSubmit={handleSubmit} className="signup-form-original">
            <div className="form-group-original">
              <label>Email Address *</label>
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
              <small>Campus emails get instant approval!</small>
            </div>
            
            <div className="form-group-original">
              <label>Username *</label>
              <div className="input-with-indicator">
                <span className="input-indicator"><FaUser /></span>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group-original">
              <label>Password *</label>
              <div className="input-with-indicator">
                <span className="input-indicator"><FaLock /></span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group-original">
              <label>Confirm Password *</label>
              <div className="input-with-indicator">
                <span className="input-indicator"><FaLock /></span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group-original">
                <label>Campus *</label>
                <div className="input-with-indicator">
                  <span className="input-indicator">-</span>
                  <select
                    name="campus"
                    value={formData.campus}
                    onChange={handleChange}
                    required
                  >
                    <option value="MBSTU">MBSTU</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group-original">
                <label>Year *</label>
                <div className="input-with-indicator">
                  <span className="input-indicator">-</span>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            
            <button type="submit" className="signup-btn-original">
              Sign Up Free
            </button>
            
            <div className="divider">
              <span>Or sign up with</span>
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
              <Link to="/login">Already a member? Login here</Link>
            </div>
          </form>
          
          <div className="badge-notification">
            Unlock Top Seller badge on your first list
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;