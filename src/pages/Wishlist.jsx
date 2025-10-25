import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getWishlist } from '../api/apiService';
import ListingCard from '../components/ListingCard';

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      getWishlist(user.user_id)
        .then(data => {
          if (data.wishlist) {
            setWishlist(data.wishlist);
          } else {
            setError('Failed to load wishlist');
          }
          setLoading(false);
        })
        .catch(err => {
          setError('Error fetching wishlist');
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view your wishlist.</p>;
  }

  if (loading) {
    return <p>Loading your wishlist...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="wishlist-container" style={{ padding: '2rem' }}>
      <h1>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        wishlist.map(item => (
          <ListingCard key={item.listing_id} listing={item} />
        ))
      )}
    </div>
  );
};

export default Wishlist;
