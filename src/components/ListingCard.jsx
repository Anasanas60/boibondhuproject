import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

const ListingCard = ({ listing, showActions = false, onEdit, onDelete, currentUser, onMessageSeller }) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      available: { backgroundColor: '#28a745', color: 'white' },
      sold: { backgroundColor: '#dc3545', color: 'white' },
      pending: { backgroundColor: '#ffc107', color: 'black' },
      reserved: { backgroundColor: '#17a2b8', color: 'white' }
    };

    return (
      <span style={{
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        ...statusStyles[status] || { backgroundColor: '#6c757d', color: 'white' }
      }}>
        {status || 'available'}
      </span>
    );
  };

  return (
    <div className="listing-card" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0 }}>{listing.title}</h3>
        {getStatusBadge(listing.status)}
      </div>
      <p><strong>Author:</strong> {listing.author}</p>
      <p><strong>Course Code:</strong> {listing.course_code}</p>
      <p><strong>Edition:</strong> {listing.edition}</p>
      <p><strong>Price:</strong> ${listing.price}</p>
      <p><strong>Condition:</strong> {listing.condition}</p>
      <p><strong>Seller:</strong> {listing.seller_name}</p>
      <p>{listing.description}</p>

      {/* Contact Seller Button */}
      {currentUser && currentUser.user_id !== listing.seller_id && (
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => onMessageSeller(listing.seller_id, listing.seller_name)}
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaEnvelope />
            Contact Seller
          </button>
        </div>
      )}
      {showActions && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onEdit(listing)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(listing.listing_id)}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingCard;
