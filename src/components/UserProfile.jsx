// src/components/UserProfile.jsx

import { useState, useEffect } from 'react';

function UserProfile() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/get_user_analytics.php')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching analytics:', error);
        setError('Could not load user analytics.');
        setLoading(false);
      });
  }, []);

  return (
    <main className="main-content gjs-t-body">
      <section className="profile-container gjs-t-container">
        <div className="profile-sidebar">
          {/* Profile Header and Details */}
          <div className="profile-header">
            <div className="profile-avatar"><span>TS</span></div>
            <div className="profile-details">
              <h2 className="profile-name">{analytics?.name || 'Loading...'}</h2>
              <p className="profile-email">{analytics?.email || 'loading...'}</p>
            </div>
          </div>
          {/* Stats Display */}
          <div className="profile-stats">
            <div className="stat-item"><span className="stat-label">Average Seller Rating</span><span className="stat-value">{analytics?.avg_rating ? `${analytics.avg_rating.toFixed(1)} / 5.0` : '—'}</span></div>
            <div className="stat-item"><span className="stat-label">Books Listed</span><span className="stat-value">{analytics?.books_listed || '—'}</span></div>
          </div>
          {/* Achievements Section */}
          <div className="profile-section">
            <h3 className="section-title">Achievements</h3>
            {analytics?.achievements?.map((ach, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-header">
                  <p className="achievement-title">{ach.title}</p>
                  <img src={`https://api.iconify.design/lucide-${ach.icon}.svg`} alt={`${ach.title} Badge`} width="20" height="20" loading="lazy" className="w-5 h-5 text-yellow-500"/>
                </div>
                <p className="achievement-hint">{ach.hint}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Main Content Placeholder */}
        <div className="profile-main-content">
          <h3 className="section-title">Active Listings</h3>
          <div className="profile-listings-grid">
            {loading && <p>Loading listings...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && analytics?.books_listed === 0 && <p>You have no active listings.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}

export default UserProfile;
