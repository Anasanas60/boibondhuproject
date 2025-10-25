import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../api/apiService';
import { useAuth } from '../contexts/AuthContext';

const AddListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    course_code: '',
    edition: '',
    price: '',
    condition: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.title || !formData.author || !formData.price) {
      setError('Please fill in all required fields: Title, Author, and Price.');
      setLoading(false);
      return;
    }

    if (!user || !user.user_id) {
      setError('User not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const listingData = { ...formData, seller_id: user.user_id };
      const response = await createListing(listingData);
      if (response.success) {
        alert('Listing created successfully!');
        navigate('/my-listings');
      } else {
        setError(response.error || 'Failed to create listing.');
      }
    } catch (err) {
      setError('An error occurred while creating the listing.');
    }
    setLoading(false);
  };

  return (
    <div className="add-listing-container" style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Add New Book Listing</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="add-listing-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="course_code">Course Code</label>
          <input type="text" id="course_code" name="course_code" value={formData.course_code} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="edition">Edition</label>
          <input type="text" id="edition" name="edition" value={formData.edition} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price *</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label htmlFor="condition">Condition</label>
          <select id="condition" name="condition" value={formData.condition} onChange={handleChange}>
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Used">Used</option>
            <option value="Acceptable">Acceptable</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Submitting...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddListing;
