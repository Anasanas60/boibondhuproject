-- api/create_messages_table_postgres.sql
-- PostgreSQL-compatible version of create_messages_table.sql

CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON messages(created_at);

-- Conversations view (adapted for PostgreSQL)
CREATE OR REPLACE VIEW conversations AS
SELECT
    LEAST(sender_id, receiver_id) AS user1_id,
    GREATEST(sender_id, receiver_id) AS user2_id,
    MAX(created_at) AS last_message_time,
    COUNT(*) AS total_messages,
    SUM(CASE WHEN is_read = FALSE AND receiver_id = LEAST(sender_id, receiver_id) THEN 1 ELSE 0 END) AS unread_count_user1,
    SUM(CASE WHEN is_read = FALSE AND receiver_id = GREATEST(sender_id, receiver_id) THEN 1 ELSE 0 END) AS unread_count_user2
FROM messages
GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id);
