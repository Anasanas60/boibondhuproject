A full-stack web application that enables students to buy, sell, and exchange textbooks seamlessly within their campus community.

✨ Features
🔐 Authentication & Security
User Registration & Login with secure session management

Profile Management with picture upload capability

Password Encryption using bcrypt

CORS Protection for API security

📖 Book Management
Create & Manage Listings with detailed book information

Advanced Search by title, author, course, or ISBN

Category Filtering by subject and course codes

Condition Tracking (New, Like New, Good, Fair)

💬 Real-time Messaging
Asynchronous Messaging System between buyers and sellers

Notification Badges showing unread message counts

Auto-refresh every 30 seconds for new messages

Conversation Threading per book listing

❤️ Personalization
Wishlist Functionality with price tracking

Seller Rating System with detailed reviews

Personalized Dashboard with user statistics

Transaction History for completed exchanges

🛠️ Tech Stack
Frontend
React 18 - Modern UI library with hooks

Vite - Fast build tool and development server

React Router - Client-side routing

Context API - State management

Backend
PHP - Server-side logic and API

MySQL - Relational database management

RESTful API - Clean API architecture

🚀 Quick Start
Prerequisites
Node.js 16.0 or higher

PHP 7.4 or higher

MySQL 5.7 or higher

Frontend Setup
Clone the repository


Download
git clone https://github.com/Anasanas60/boibondhu.git
cd boibondhu
Install dependencies


Download
npm install
Start development server



Download
npm run dev
Frontend will be available at http://localhost:5173

Backend Setup
Database Configuration

Import api/init_db.sql to your MySQL database

Update database credentials in api/db_connect.php

API Server Setup

Place the api/ folder in your web server root

Ensure PHP and MySQL are running

Environment Configuration
Create .env file in root directory:

Download
VITE_API_BASE_URL=http://localhost/boibondhu/api
📁 Project Structure
text


Download
boibondhu/
├── src/                 # React frontend
│   ├── components/     # Reusable components
│   ├── pages/         # Route components
│   ├── contexts/      # State management
│   └── api/          # API service layer
├── api/               # PHP backend
│   ├── auth/         # Authentication endpoints
│   ├── books/        # Book management
│   └── messaging/    # Message system
└── public/           # Static assets
🔧 API Endpoints
Authentication
POST /api/login.php - User login

POST /api/register.php - User registration

Books
GET /api/listings.php - Get all listings

POST /api/create_listing.php - Create new listing

GET /api/search_listings.php - Search books

Messaging
POST /api/send_message.php - Send message

GET /api/get_conversations.php - Get user conversations

GET /api/get_unread_count.php - Get unread message count

👥 User Workflows
For Buyers
Browse available textbooks

Search by course, title, or author

Contact sellers via messaging system

Add to wishlist for price tracking

Rate sellers after transaction

For Sellers
Create listings with book details

Manage active listings

Respond to inquiries via messages

Track sales and ratings

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

👨‍💻 Developer
Anasanas

GitHub: @Anasanas60

📄 License
This project is licensed under the MIT License.

Built with ❤️ for the student community
