import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserReviews } from '../api/apiService';
import ReviewCard from '../components/ReviewCard';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserReviews(user.user_id);
        
        if (data.success && data.reviews) {
          setReviews(data.reviews);
        } else {
          setError('Failed to load reviews');
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Error fetching reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  if (!user) {
    return (
      <div className="reviews-container" style={{ padding: '2rem' }}>
        <p>Please log in to view your reviews.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="reviews-container" style={{ padding: '2rem' }}>
        <p>Loading your reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-container" style={{ padding: '2rem' }}>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="reviews-container" style={{ padding: '2rem' }}>
      <h1>My Reviews</h1>
      {reviews.length === 0 ? (
        <p>You have no reviews yet.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <ReviewCard key={review.rating_id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
