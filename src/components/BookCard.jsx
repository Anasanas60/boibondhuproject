// components/BookCard.jsx
import React from 'react';

const BookCard = ({ book, isMockData, onMessageSeller }) => {
  return (
    <div className="book-card" style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}>
      {/* Demo Book Indicator */}
      {isMockData && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#ffc107',
          color: '#000',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          zIndex: 1
        }}>
          DEMO
        </div>
      )}

      {/* Real Listing Indicator */}
      {!isMockData && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          zIndex: 1
        }}>
          REAL
        </div>
      )}

      <div style={{
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        color: '#333'
      }}>
        {book.title}
      </div>
      
      {/* HIGHLIGHTED AUTHOR NAME */}
      <div style={{
        backgroundColor: '#fff3e0',
        color: '#e65100',
        padding: '6px 10px',
        borderRadius: '6px',
        marginBottom: '0.8rem',
        fontSize: '0.95rem',
        fontWeight: '600',
        border: '1px solid #ffcc80',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ fontSize: '1rem' }}>✍️</span>
        {book.author}
      </div>
      
      <div style={{
        color: '#007bff',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
        fontWeight: '500'
      }}>
        {book.course} {book.course_code && `(${book.course_code})`}
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
        fontSize: '0.9rem'
      }}>
        <span style={{
          backgroundColor: '#e9ecef',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          {book.condition}
        </span>
        {book.edition && (
          <span style={{
            backgroundColor: '#d1ecf1',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: '#0c5460',
            fontWeight: '500'
          }}>
            {book.edition} {getEditionSuffix(book.edition)}
          </span>
        )}
      </div>
      
      {/* UPDATED: Bangladeshi Taka Price */}
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: '1rem',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        padding: '8px',
        borderRadius: '6px'
      }}>
        ৳{book.price}
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        fontSize: '0.9rem'
      }}>
        <span style={{ fontWeight: '500' }}>
          🧑‍🎓 {book.seller || book.seller_name}
        </span>
        {book.rating && (
          <span style={{
            backgroundColor: '#ffc107',
            color: '#000',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            ⭐ {book.rating}
          </span>
        )}
      </div>
      
      <div style={{
        color: '#666',
        fontSize: '0.8rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        📍 {book.location || 'MBSTU Campus'}
      </div>
      
      <button
        onClick={() => onMessageSeller && onMessageSeller(book.seller_id, book.seller || book.seller_name)}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        📞 Contact Seller
      </button>
    </div>
  );
};

// Helper function for edition suffixes
const getEditionSuffix = (edition) => {
  if (edition === 1) return 'st Edition';
  if (edition === 2) return 'nd Edition';
  if (edition === 3) return 'rd Edition';
  return 'th Edition';
};

export default BookCard;