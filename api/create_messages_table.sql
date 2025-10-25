-- api/create_messages_table.sql

-- Create Messages table for asynchronous messaging system
CREATE TABLE IF NOT EXISTS messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_sender_receiver (sender_id, receiver_id),
    INDEX idx_created_at (created_at)
);

-- Create Conversations view for easier conversation listing
CREATE VIEW conversations AS
SELECT
    LEAST(sender_id, receiver_id) as user1_id,
    GREATEST(sender_id, receiver_id) as user2_id,
    MAX(created_at) as last_message_time,
    COUNT(*) as total_messages,
    SUM(CASE WHEN is_read = 0 AND receiver_id = LEAST(sender_id, receiver_id) THEN 1 ELSE 0 END) as unread_count_user1,
    SUM(CASE WHEN is_read = 0 AND receiver_id = GREATEST(sender_id, receiver_id) THEN 1 ELSE 0 END) as unread_count_user2
FROM messages
GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id);
