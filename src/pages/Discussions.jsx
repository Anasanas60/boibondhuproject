import React from 'react';

const Discussions = () => {
  const discussionCategories = [
    { name: 'Study Groups', description: 'Join the conversation' },
    { name: 'General Discussion', description: 'Join the conversation' },
    { name: 'Selling Tips', description: 'Join the conversation' },
    { name: 'Course Help', description: 'Join the conversation' }
  ];

  return (
    <div className="featured-books">
      <div className="container">
        <h1>Discussion Boards</h1>
        <p>Connect with fellow students</p>
        
        <div className="discussions">
          {discussionCategories.map((category, index) => (
            <div key={index} className="discussion-category">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <button className="view-threads-btn">View Threads</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discussions;