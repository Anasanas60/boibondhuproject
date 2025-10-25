import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserSettings } from '../api/apiService';

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    campus: '',
    year: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        campus: user.campus || '',
        year: user.year || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await updateUserSettings({ user_id: user.user_id, ...formData });
      if (response.success) {
        setMessage('Settings updated successfully.');
      } else {
        setError(response.error || 'Failed to update settings.');
      }
    } catch (err) {
      setError('Error updating settings.');
    }
  };

  if (!user) {
    return <p>Please log in to access settings.</p>;
  }

  return (
    <div className="settings-container" style={{ padding: '2rem' }}>
      <h1>Settings</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Campus:</label>
          <input type="text" name="campus" value={formData.campus} onChange={handleChange} />
        </div>
        <div>
          <label>Year:</label>
          <input type="text" name="year" value={formData.year} onChange={handleChange} />
        </div>
        <button type="submit">Update Settings</button>
      </form>
    </div>
  );
};

// MAKE SURE THIS LINE EXISTS AT THE END:
export default Settings;