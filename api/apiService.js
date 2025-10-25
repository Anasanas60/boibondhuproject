// src/api/apiService.js
const API_BASE_URL = 'http://localhost/boibondhu/api';

// User Authentication
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
};

// User Settings
export const updateUserSettings = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/update_settings.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Book Listings
export const getListings = async () => {
  const response = await fetch(`${API_BASE_URL}/listings.php`);
  return response.json();
};

export const createListing = async (listingData) => {
  const response = await fetch(`${API_BASE_URL}/create_listing.php`, { // FIXED TYPO
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listingData)
  });
  return response.json();
};

export const deleteListing = async (listingId) => {
  const response = await fetch(`${API_BASE_URL}/delete_listing.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listing_id: listingId })
  });
  return response.json();
};

// Wishlist
export const addToWishlist = async (wishlistData) => {
  const response = await fetch(`${API_BASE_URL}/add_wishlist.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wishlistData)
  });
  return response.json();
};

export const getWishlist = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/get_wishlist.php?user_id=${userId}`);
  return response.json();
};

export const removeFromWishlist = async (wishlistData) => {
  const response = await fetch(`${API_BASE_URL}/remove_wishlist.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wishlistData)
  });
  return response.json();
};