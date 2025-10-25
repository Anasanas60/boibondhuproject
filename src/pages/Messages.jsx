import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUser, FaEnvelope, FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from '../api/apiService';
import { useLocation } from 'react-router-dom';

const Messages = () => {
  const { user, refreshUnreadCount } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const recipientData = location.state || null;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) loadConversations();
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.other_user_id);
      markMessagesAsRead(user.user_id, selectedConversation.other_user_id)
        .then(() => {
          if (refreshUnreadCount) refreshUnreadCount();
        })
        .catch(console.error);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (recipientData && recipientData.recipientId && user) {
      const existingConv = conversations.find(
        conv => conv.other_user_id === recipientData.recipientId
      );
      if (existingConv) {
        setSelectedConversation(existingConv);
      } else {
        const newConversation = {
          other_user_id: recipientData.recipientId,
          other_user_name: recipientData.recipientName || 'Unknown User',
          last_message: 'Start a new conversation...',
          last_message_time: new Date().toISOString(),
          unread_count: 0
        };
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        setMessages([]);
      }
    }
    // eslint-disable-next-line
  }, [recipientData, conversations, user]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const response = await getConversations(user.user_id);
      if (response.success) {
        setConversations(response.conversations);
        if (recipientData && recipientData.recipientId) {
          const targetConv = response.conversations.find(
            conv => conv.other_user_id === recipientData.recipientId
          );
          if (targetConv) setSelectedConversation(targetConv);
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
      const response = await getMessages(user.user_id, otherUserId);
      if (response.success) setMessages(response.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;
    setSending(true);
    try {
      const response = await sendMessage(
        user.user_id,
        selectedConversation.other_user_id,
        newMessage.trim()
      );
      if (response.success) {
        setNewMessage('');
        await loadMessages(selectedConversation.other_user_id);
        await loadConversations();
        if (refreshUnreadCount) setTimeout(() => refreshUnreadCount(), 1000);
      } else {
        alert('Failed to send message: ' + response.error);
      }
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const startNewConversation = () => {
    if (recipientData && recipientData.recipientId) {
      const newConversation = {
        other_user_id: recipientData.recipientId,
        other_user_name: recipientData.recipientName || 'Unknown User',
        last_message: 'Start a new conversation...',
        last_message_time: new Date().toISOString(),
        unread_count: 0
      };
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      setMessages([]);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Please log in to view your messages.</p>
      </div>
    );
  }

  return (
    <div className="chat-responsive-container">
      {/* Sidebar */}
      <div style={{
        flex: '0 0 280px',
        background: '#f3f8fd',
        borderRadius: '13px',
        border: '1.5px solid #e6ecf1',
        boxShadow: '0 2px 8px #ceeaff50',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '1.1rem 1.3rem 1.1rem 1rem',
          borderBottom: '1.5px solid #e0e6ed'
        }}>
          <h3 style={{ margin: 0, color: '#2056a8', fontWeight: 800, fontSize: '1.13rem', letterSpacing: 0.2 }}>Messages</h3>
          {recipientData && !conversations.find(c => c.other_user_id === recipientData.recipientId) && (
            <button
              onClick={startNewConversation}
              style={{
                padding: '0.34rem 0.7rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: '0 2px 8px #8ee9af50'
              }}
            >
              <FaPlus size={12} />
              New Chat
            </button>
          )}
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0.75rem 0.4rem' }}>
          {loading ? (
            <p>Loading conversations...</p>
          ) : conversations.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '2rem 0.5rem' }}>
              <FaEnvelope size={38} style={{ marginBottom: '0.9rem', opacity: 0.5 }} />
              <p style={{ fontWeight: 500 }}>No conversations yet</p>
              <p style={{ fontSize: '0.93rem' }}>Start chatting with sellers about their books!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
              {conversations.map((conv) => (
                <div
                  key={conv.other_user_id}
                  onClick={() => setSelectedConversation(conv)}
                  style={{
                    padding: '0.58rem 0.63rem',
                    borderRadius: '9px',
                    cursor: 'pointer',
                    backgroundColor: selectedConversation?.other_user_id === conv.other_user_id ? '#e3f2fd' : '#fff',
                    border: selectedConversation?.other_user_id === conv.other_user_id ? '1.4px solid #007bff' : '1.4px solid #ebeef4',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: selectedConversation?.other_user_id === conv.other_user_id ? '0 2px 10px #c8ecff33' : undefined
                  }}
                >
                  <FaUser style={{ color: '#666', flexShrink: 0, fontSize: 19 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Show only the sender's name and unread badge in the sidebar preview. Clicking opens the chat. */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1976d2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.other_user_name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                        <div style={{ fontSize: '0.7rem', color: '#b3bac6' }}>{formatTime(conv.last_message_time)}</div>
                        {conv.unread_count > 0 && (
                          <span style={{
                            backgroundColor: '#ff8300',
                            color: 'white',
                            borderRadius: '11px',
                            padding: '0.14rem 0.65rem',
                            fontSize: '0.74rem'
                          }}>
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Main chat area */}
      <div style={{
        flex: 1,
        background: '#fafcff',
        borderRadius: '13px',
        border: '1.5px solid #e6ecf1',
        boxShadow: '0 3px 18px #ccdeff35',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        minWidth: 0,
        overflow: 'hidden'
      }}>
        {selectedConversation ? (
          <>
            <div style={{
              padding: '1.18rem 1.4rem',
              borderBottom: '1.5px solid #e6ecf1',
              background: '#f7fafc'
            }}>
              <h4 style={{
                margin: 0,
                color: '#2056a8',
                fontWeight: 700,
                fontSize: '1.12rem'
              }}>
                Chat with {selectedConversation.other_user_name}
                {!messages.length && (
                  <span style={{ fontSize: '0.93rem', color: '#a0abbe', marginLeft: '1rem' }}>
                    • New conversation
                  </span>
                )}
              </h4>
            </div>
            {/* Messages Area */}
            <div style={{
              flex: 1,
              padding: '1.25rem 1.2rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.62rem',
              background: 'transparent'
            }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#848D99', padding: '2.4rem' }}>
                  <FaEnvelope size={39} style={{ marginBottom: '1.17rem', opacity: 0.48 }} />
                  <p>No messages yet</p>
                  <p>Start the conversation about their book!</p>
                  <p style={{ fontSize: '0.93rem', marginTop: '1rem' }}>
                    Try asking: "Is this book still available?" or "Can we meet on campus?"
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.message_id}
                    style={{
                      alignSelf: msg.sender_id === user.user_id ? 'flex-end' : 'flex-start',
                      padding: '0.79rem 1.05rem',
                      borderRadius: '17px',
                      maxWidth: '75%',
                      background: msg.sender_id === user.user_id
                        ? 'linear-gradient(100deg, #1383eb 60%, #21b993 100%)'
                        : '#eaf2ff',
                      color: msg.sender_id === user.user_id ? 'white' : '#374151',
                      fontWeight: 500,
                      boxShadow: msg.sender_id === user.user_id ? '0 2px 10px #6bd2ff25' : '0 1px 5px #cfe9fa18',
                      wordBreak: 'break-word'
                    }}
                  >
                    <div>{msg.message_text}</div>
                    <div style={{
                      fontSize: '0.73rem',
                      opacity: 0.75,
                      marginTop: '0.29rem',
                      textAlign: msg.sender_id === user.user_id ? 'right' : 'left'
                    }}>
                      {formatTime(msg.created_at)}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef}></div>
            </div>
            {/* Message Input */}
            <form onSubmit={handleSendMessage} style={{
              padding: '0.7rem 1.2rem',
              borderTop: '1.5px solid #e6ecf1',
              background: '#f7fafc',
              display: 'flex',
              gap: '0.65rem'
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '0.8rem 1.3rem',
                  border: '1.2px solid #b7d1eb',
                  borderRadius: '7px',
                  fontSize: '1.07rem',
                  background: '#fff'
                }}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                style={{
                  padding: '0.8rem 1.35rem',
                  background: (newMessage.trim() && !sending) ? 'linear-gradient(90deg,#0084ff 60%,#25db81 100%)' : '#cad8e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '7px',
                  cursor: (newMessage.trim() && !sending) ? 'pointer' : 'not-allowed',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: (newMessage.trim() && !sending) ? '0 2px 12px #75eedf36' : 'none',
                  transition: 'background 0.17s'
                }}
              >
                {sending ? '...' : <FaPaperPlane />}
                {sending ? 'Sending' : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#66788a'
          }}>
            <div style={{ textAlign: 'center' }}>
              <FaEnvelope size={61} style={{ marginBottom: '1.17rem', opacity: 0.42 }} />
              <h4>
                {recipientData ? `Start chatting with ${recipientData.recipientName}` : 'Select a conversation'}
              </h4>
              <p>
                {recipientData
                  ? 'Click "New Chat" in the sidebar to start messaging about their book!'
                  : 'Choose someone from the list to view your chat history'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
