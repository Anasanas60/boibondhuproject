import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import { getListings, searchListings } from '../api/apiService';
import { mockListings } from '../api/mockListings';
import { useAuth } from '../contexts/AuthContext';

const SearchBooks = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [realListings, setRealListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Computer Science', 'Physics', 'Biology', 'Economics', 'Statistics', 'Engineering', 'Chemistry'];

  // Set initial category from URL param
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Reset selectedCategory when searchQuery changes to empty
  useEffect(() => {
    if (!searchQuery) {
      setSelectedCategory('All');
    }
  }, [searchQuery]);

  // Load real listings when component mounts
  useEffect(() => {
    const loadRealListings = async () => {
      try {
        const data = await getListings();
        if (data.listings) {
          setRealListings(data.listings);
          // Combine real + mock data
          setBooks([...data.listings, ...mockListings]);
        } else {
          setBooks(mockListings);
        }
      } catch (error) {
        console.error('Failed to load real listings, using mock data only:', error);
        setBooks(mockListings);
      }
    };

    loadRealListings();
  }, []);

  const handleSearch = async (searchResults, query) => {
    const searchTerm = String(query || '').trim();

    if (!searchTerm) {
      // Show all books (real + mock)
      setBooks([...realListings, ...mockListings]);
      setSearchQuery('');
      return;
    }

    setLoading(true);
    setSearchQuery(searchTerm);

    try {
      // Search real database first
      const realResults = await searchListings(searchTerm);

      // Also search mock data
      const searchTermLower = searchTerm.toLowerCase();
      const mockResults = mockListings.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(searchTermLower);
        const authorMatch = book.author.toLowerCase().includes(searchTermLower);
        const courseMatch = book.course?.toLowerCase().includes(searchTermLower);
        const courseCodeMatch = book.course_code?.toLowerCase().includes(searchTermLower);

        return titleMatch || authorMatch || courseMatch || courseCodeMatch;
      });

      // Combine results (real data first, then mock data)
      const allResults = [...realResults.listings, ...mockResults];
      setBooks(allResults);

    } catch (error) {
      console.error('Search failed, using mock data only:', error);
      // Fallback to mock data search only
      const searchTermLower = searchTerm.toLowerCase();
      const mockResults = mockListings.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(searchTermLower);
        const authorMatch = book.author.toLowerCase().includes(searchTermLower);
        const courseMatch = book.course?.toLowerCase().includes(searchTermLower);
        const courseCodeMatch = book.course_code?.toLowerCase().includes(searchTermLower);

        return titleMatch || authorMatch || courseMatch || courseCodeMatch;
      });
      setBooks(mockResults);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = selectedCategory && selectedCategory !== 'All'
    ? books.filter(book => book.course?.toLowerCase().includes(selectedCategory.toLowerCase()))
    : books;

  const handleMessageSeller = (sellerId, sellerName) => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to messages page with the seller's conversation
    navigate('/messages', { state: { recipientId: sellerId, recipientName: sellerName } });
  };



  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <section className="search-hero" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Search Books</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Find textbooks from MBSTU students {realListings.length > 0 && `(${realListings.length} real listings + ${mockListings.length} demo books)`}
        </p>
        <SearchBar onSearch={handleSearch} />
      </section>

      <section className="categories" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3>Browse by Category</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                console.log('Category clicked:', category);
                setSelectedCategory(category);
              }}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '20px',
                backgroundColor: selectedCategory === category ? '#007bff' : '#fff',
                color: selectedCategory === category ? '#fff' : '#000',
                cursor: 'pointer'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="search-results">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Searching through {realListings.length > 0 ? 'real listings and demo books' : 'demo books'}...</p>
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: '1.5rem' }}>
              {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory && selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </h2>

            {filteredBooks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>No books found matching your search.</p>
                <p>Try searching with different keywords like:</p>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                  <li>• Book titles: "algorithms", "calculus", "physics"</li>
                  <li>• Author names: "cormen", "knuth", "einstein"</li>
                  <li>• Course codes: "CS101", "MATH201", "PHY301"</li>
                </ul>
              </div>
            )}

            {filteredBooks.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredBooks.map((book, index) => (
                  <BookCard
                    key={`${book.listing_id ? 'real' : 'mock'}-${book.listing_id || book.id}-${index}`}
                    book={book}
                    isMockData={!book.listing_id} // Mark mock data for styling
                    onMessageSeller={handleMessageSeller}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default SearchBooks;
