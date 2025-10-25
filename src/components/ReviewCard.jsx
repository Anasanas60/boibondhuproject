import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card" style={{ 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      padding: '1.5rem', 
      marginBottom: '1rem', 
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0, color: '#333' }}>{review.book_title}</h3>
        <div style={{ 
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '20px',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          {review.rating} / 5
        </div>
      </div>
      
      <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
        <strong>From:</strong> {review.buyer_name}
      </p>
      
      {review.review && (
        <div style={{ margin: '0.75rem 0', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <strong>Review:</strong> 
          <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic', color: '#555' }}>"{review.review}"</p>
        </div>
      )}
      
      {review.comment && (
        <p style={{ margin: '0.5rem 0', color: '#555' }}>
          <strong>Comment:</strong> {review.comment}
        </p>
      )}
      
      <p style={{ 
        margin: '0.5rem 0 0 0', 
        fontSize: '0.8rem', 
        color: '#999',
        textAlign: 'right'
      }}>
        Reviewed on: {new Date(review.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    </div>
  );
};

export default ReviewCard;