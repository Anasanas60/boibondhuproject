import React, { useState } from 'react';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const faqItems = [
    { question: 'How do I verify my email?', category: 'Account Setup' },
    { question: 'Can I use a non-campus email?', category: 'Account Setup' },
    { question: 'How do I list a book for sale?', category: 'Buying/Selling' },
    { question: 'What if the book condition doesn\'t match the listing?', category: 'Buying/Selling' },
    { question: 'How do I set the right price for my book?', category: 'Buying/Selling' },
    { question: 'Can I exchange books instead of selling?', category: 'Buying/Selling' },
    { question: 'How do wishlist alerts work?', category: 'Features' },
    { question: 'What are badges and how do I earn them?', category: 'Features' },
    { question: 'How does the donation feature work?', category: 'Features' },
    { question: 'What are group buys?', category: 'Features' },
    { question: 'Chat not loading?', category: 'Troubleshooting' },
    { question: 'I can\'t upload photos', category: 'Troubleshooting' },
    { question: 'My listing isn\'t showing up in search', category: 'Troubleshooting' },
    { question: 'How do I stay safe when meeting sellers?', category: 'Safety' },
    { question: 'How do I report suspicious activity?', category: 'Safety' }
  ];

  const categories = ['Account Setup', 'Buying/Selling', 'Features', 'Troubleshooting', 'Safety'];

  const filteredFaqItems = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? '' : category);
  };

  return (
    <div className="featured-books">
      <div className="container">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about BoiBondhu</p>
        
        <div className="faq-search-original">
          <input 
            type="text" 
            placeholder="Search for answers..." 
            className="faq-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="faq-categories-original">
          {categories.map(category => (
            <span 
              key={category} 
              className={`faq-category-tag ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </span>
          ))}
        </div>
        
        <div className="faq-list-original">
          {filteredFaqItems.map((item, index) => (
            <div key={index} className="faq-item-original">
              <h3>{item.question}</h3>
              <div className="faq-divider"></div>
            </div>
          ))}
          {filteredFaqItems.length === 0 && (
            <div className="no-results">
              <p>No questions found matching your search.</p>
            </div>
          )}
        </div>
        
        <div className="faq-support-original">
          <h2>Still have questions?</h2>
          <p>Our support team is here to help you with any questions or concerns.</p>
          <button className="contact-support-btn">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;