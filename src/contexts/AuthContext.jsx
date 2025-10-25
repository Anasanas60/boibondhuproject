import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0); // ✅ ADD UNREAD COUNT STATE

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // ✅ START CHECKING FOR UNREAD MESSAGES IF USER IS LOGGED IN
      if (userData && userData.user_id) {
        checkUnreadMessages(userData.user_id);
      }
    }
  }, []);

  // ✅ FUNCTION TO CHECK UNREAD MESSAGES
  const checkUnreadMessages = async (userId = null) => {
    const currentUserId = userId || (user ? user.user_id : null);
    
    if (!currentUserId) return;

    try {
      const response = await fetch(`http://localhost/boibondhu/api/get_unread_count.php?user_id=${currentUserId}`);
      const data = await response.json();
      
      if (data.success) {
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Failed to check unread messages:', error);
      // Silently fail - don't show error to user for background checks
    }
  };

  // ✅ AUTO-REFRESH UNREAD COUNT EVERY 30 SECONDS
  useEffect(() => {
    if (!user) return;

    // Check immediately
    checkUnreadMessages();

    // Set up interval for auto-refresh
    const interval = setInterval(() => {
      checkUnreadMessages();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount or user logout
    return () => clearInterval(interval);
  }, [user]);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // ✅ CHECK FOR UNREAD MESSAGES AFTER LOGIN
    setTimeout(() => {
      checkUnreadMessages(userData.user_id);
    }, 1000);
  };

  const logout = () => {
    toast.info(
      <div>
        <p>Are you sure you want to log out?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={() => {
              // ✅ ACTUAL LOGOUT LOGIC
              localStorage.removeItem('user');
              setUser(null);
              setUnreadCount(0); // ✅ RESET UNREAD COUNT
              toast.dismiss();
              // ✅ FIXED REDIRECT
              setTimeout(() => {
                window.location.href = '/login';
              }, 10);
            }}
            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  // ✅ ADD THIS NEW FUNCTION FOR DIRECT LOGOUT WITHOUT CONFIRMATION
  const directLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setUnreadCount(0); // ✅ RESET UNREAD COUNT
    // ✅ FIXED REDIRECT
    setTimeout(() => {
      window.location.href = '/login';
    }, 10);
  };

  // ✅ FUNCTION TO MANUALLY REFRESH UNREAD COUNT (for when user reads messages)
  const refreshUnreadCount = () => {
    if (user) {
      checkUnreadMessages();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      directLogout,
      unreadCount, // ✅ EXPORT UNREAD COUNT
      refreshUnreadCount // ✅ EXPORT REFRESH FUNCTION
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add useAuth custom hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext);