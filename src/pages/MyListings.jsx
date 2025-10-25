import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserListings } from '../api/apiService';
import ListingCard from '../components/ListingCard';

const MyListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      getUserListings(user.user_id)
        .then(data => {
          if (data.listings) {
            setListings(data.listings);
          } else {
            setError('Failed to load listings');
          }
          setLoading(false);
        })
        .catch(err => {
          setError('Error fetching listings');
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view your listings.</p>;
  }

  if (loading) {
    return <p>Loading your listings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="my-listings-container" style={{ padding: '2rem' }}>
      <h1>My Listings</h1>
      {listings.length === 0 ? (
        <p>You have no listings yet.</p>
      ) : (
        listings.map(listing => (
          <ListingCard key={listing.listing_id} listing={listing} />
        ))
      )}
    </div>
  );
};

export default MyListings;
