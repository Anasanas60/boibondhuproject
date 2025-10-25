import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockListings } from '../api/mockListings';
import BookCard from '../components/BookCard';
import { useAuth } from '../contexts/AuthContext';
import { getListings, searchListings } from '../api/apiService';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const featuredBooks = mockListings.slice(0, 4);

  const trendingSubjects = [
    'Mathematics',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        if (data.listings) {
          setListings(data.listings);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleSearch = (results, query) => {
    setSearchResults(results);
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchQuery('');
  };

  const displayListings = searchResults || listings;

  if (user) {
    return (
      <div className="dashboard-container" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome, {user.name}!</h1>
        
        {/* Search Bar for Logged-in Users */}
        <div style={{ marginBottom: '2rem' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search textbooks by title, author, or course..." />
          {searchQuery && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Search Results for "{searchQuery}"</h3>
              <button 
                onClick={clearSearch}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        <div className="quick-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Books Listed</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>12</p>
          </div>
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Wishlist Items</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>5</p>
          </div>
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Seller Rating</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>4.8/5</p>
          </div>
        </div>

        <div className="quick-actions" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Quick Actions</h2>
          <Link to="/add-listing" className="btn btn-primary" style={{ marginRight: '1rem', padding: '0.8rem 1.5rem', fontSize: '1rem' }}>Sell a Book</Link>
          <Link to="/search" className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>Browse Books</Link>
        </div>

        {/* Show Search Results or Recent Listings */}
        <div className="recent-listings">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
            {searchQuery ? 'Search Results' : 'Recent Listings'}
          </h2>
          {loading ? (
            <p>Loading textbooks...</p>
          ) : displayListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No textbooks found.</p>
              {searchQuery && (
                <p>Try adjusting your search terms.</p>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {displayListings.map(listing => (
                <BookCard key={listing.listing_id} book={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{ background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%)', color: 'white', padding: '4rem 2rem', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="hero-content" style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.2' }}>
            Swap, Sell, Study Smarter<br />– Save on Textbooks<br />Today!
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9, maxWidth: '400px' }}>
            Join thousands of MBSTU students trading textbooks and saving money together.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Link to="/add-listing" className="btn btn-outline-light" style={{ color: '#800080' }}>
              List a Book
            </Link>
            <Link to="/search" className="btn btn-outline-light" style={{ color: '#800080' }}>
              Search Books
            </Link>
            <Link to="/signup" className="btn btn-outline-light" style={{ color: '#800080' }}>
              Sign Up Free &rarr;
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '3rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <div>
              <div>10,234+</div>
              <div>Books Listed</div>
            </div>
            <div>
              <div>5,678+</div>
              <div>Students</div>
            </div>
            <div>
              <div>3,456+</div>
              <div>Exchanges</div>
            </div>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80"
          alt="Diverse students studying together with books on campus"
          style={{ maxHeight: '300px', userSelect: 'none', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
        />
      </section>

      {/* Search Bar Section - UPDATED WITH REAL SEARCH */}
      <section style={{ padding: '2rem', backgroundColor: '#fff' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search by title, author, subject, or course..." />
          {searchQuery && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button 
                onClick={clearSearch}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Show Search Results or Featured Listings */}
      {searchQuery ? (
        <section className="search-results" style={{ padding: '2rem' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Search Results for "{searchQuery}"</h2>
            {loading ? (
              <p style={{ textAlign: 'center' }}>Searching...</p>
            ) : displayListings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No textbooks found matching your search.</p>
                <p>Try adjusting your search terms or browse featured listings below.</p>
              </div>
            ) : (
              <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {displayListings.map(listing => (
                  <BookCard key={listing.listing_id} book={listing} />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Featured Listings Section */}
          <section className="featured-books" style={{ padding: '4rem 2rem' }}>
            <div className="container">
              <h2>Featured Listings</h2>
              <p>Popular books from trusted sellers</p>
              <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {featuredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <h2>How It Works</h2>
            <p>Get started in three simple steps</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '2rem' }}>
              <div style={{ maxWidth: '200px' }}>
                <img src="https://img.icons8.com/ios-filled/50/000000/book.png" alt="List Your Books" style={{ width: '50px', marginBottom: '1rem' }} />
                <h3>List Your Books</h3>
                <p>Upload photos, set your price, and list your textbooks in minutes. It's completely free!</p>
              </div>
              <div style={{ maxWidth: '200px' }}>
                <img src="https://img.icons8.com/ios-filled/50/000000/search--v1.png" alt="Find What You Need" style={{ width: '50px', marginBottom: '1rem' }} />
                <h3>Find What You Need</h3>
                <p>Browse thousands of textbooks by subject, course, or author. Save your favorites to wishlist.</p>
              </div>
              <div style={{ maxWidth: '200px' }}>
                <img src="https://img.icons8.com/ios-filled/50/000000/handshake.png" alt="Connect & Trade" style={{ width: '50px', marginBottom: '1rem' }} />
                <h3>Connect & Trade</h3>
                <p>Message sellers directly, arrange meetups on campus, and complete your transaction safely.</p>
              </div>
            </div>
          </section>

          {/* Trending Subjects Section */}
          <section style={{ padding: '2rem', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
            <h2>Trending Subjects</h2>
            <p>Popular subjects students are browsing</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {trendingSubjects.map((subject) => (
            <Link key={subject} to={`/search?category=${encodeURIComponent(subject)}`} className="btn btn-outline-secondary" style={{ borderRadius: '20px', padding: '0.5rem 1rem', textDecoration: 'none', color: 'inherit' }}>
              {subject}
            </Link>
          ))}
        </div>
          </section>
        </>
      )}

      {/* Call to Action Section */}
      <section style={{ backgroundColor: '#2c5aa0', color: 'white', padding: '3rem 2rem', textAlign: 'center' }}>
        <h2>Ready to Start Saving on Textbooks?</h2>
        <p>Join the BoiBondhu community today and discover a smarter way to buy and sell textbooks.</p>
        <Link to="/signup" className="btn btn-success" style={{ marginTop: '1rem' }}>
          Sign Up Free &rarr;
        </Link>
      </section>
    </div>
  );
};

export default Home;