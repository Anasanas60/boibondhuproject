import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, uploadProfilePicture } from '../api/apiService';

const UserProfile = () => {
  const { user, login } = useAuth();
  const [stats, setStats] = useState({ listings: 0, reviews: 0, wishlist: 0 });
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      getUserStats(user.user_id).then(data => {
        if (data.success) {
          setStats(data.stats);
          setProfilePic(data.profilePicUrl || null);
        }
      });
    }
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const data = await uploadProfilePicture(user.user_id, file);
      if (data.success) {
        setProfilePic(data.profilePicUrl);
        // Update user context with new profile pic if needed
        login({ ...user, profilePicUrl: data.profilePicUrl });
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Error uploading image');
    }
    setUploading(false);
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="user-profile-container">
      <h1>My Profile</h1>
      <div className="profile-picture-section" style={{ marginBottom: '1rem' }}>
        {profilePic ? (
          <img src={profilePic} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            No Image
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        {uploading && <p>Uploading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="user-details">
        <h2>User Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Campus:</strong> {user.campus}</p>
        <p><strong>Year:</strong> {user.year}</p>
      </div>

      <div className="user-activity">
        <h2>My Activity</h2>
        <p><strong>Total Listings:</strong> {stats.listings}</p>
        <p><strong>Total Reviews:</strong> {stats.reviews}</p>
        <p><strong>Wishlist Count:</strong> {stats.wishlist}</p>
      </div>
    </div>
  );
};

export default UserProfile;
