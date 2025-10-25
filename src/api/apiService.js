import { mockListings } from './mockListings';

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
  try {
    const response = await fetch(`${API_BASE_URL}/listings.php`);
    if (!response.ok) {
      return { success: true, listings: mockListings };
    }
    const data = await response.json();
    if (data.success && Array.isArray(data.listings)) {
      return { success: true, listings: [...mockListings, ...data.listings] };
    }
    return { success: true, listings: mockListings };
  } catch (error) {
    console.error('Error fetching listings:', error);
    return { success: true, listings: mockListings };
  }
};

export const getUserListings = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/get_user_listings.php?user_id=${userId}`);
  return response.json();
};

export const createListing = async (listingData) => {
  const response = await fetch(`${API_BASE_URL}/create_listing.php`, {
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

export const updateListing = async (listingId, listingData) => {
  const response = await fetch(`${API_BASE_URL}/update_listing.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listing_id: listingId, ...listingData })
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

// Reviews - UPDATED with proper error handling
export const getUserReviews = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_user_reviews.php?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    // Handle the API response format: {success: true, reviews: [...]}
    if (data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to fetch reviews');
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getUserStats = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_user_stats.php?user_id=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { success: false, error: 'Failed to fetch user stats' };
  }
};

export const uploadProfilePicture = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('profile_picture', file);

    const response = await fetch(`${API_BASE_URL}/upload_profile_picture.php`, {
      method: 'POST',
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return { success: false, error: 'Failed to upload profile picture' };
  }
};

// Messaging System
export const sendMessage = async (senderId, receiverId, messageText) => {
  try {
    const response = await fetch(`${API_BASE_URL}/send_message.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
        message_text: messageText
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to send message' };
  }
};

export const getMessages = async (userId, conversationWith) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_messages.php?user_id=${userId}&conversation_with=${conversationWith}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { success: false, error: 'Failed to fetch messages' };
  }
};

export const getConversations = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_conversations.php?user_id=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return { success: false, error: 'Failed to fetch conversations' };
  }
};

// ✅ ADD MARK MESSAGES AS READ FUNCTION
export const markMessagesAsRead = async (userId, otherUserId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mark_messages_as_read.php?user_id=${userId}&other_user_id=${otherUserId}`);
    return await response.json();
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return { success: false, error: 'Failed to mark messages as read' };
  }
};

// Search Listings
export const searchListings = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search_listings.php?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to fetch search results');
    }
  } catch (error) {
    console.error('Error searching listings:', error);
    throw error;
  }
};