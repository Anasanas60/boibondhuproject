import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just alert the form data. Integration with backend can be added later.
    alert('Message sent! Thank you for contacting us.');
    setFormData({name: '', email: '', subject: '', message: ''});
  };

  return (
    <div className="page-container" style={{ margin: '2rem auto', maxWidth: '900px', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2c5aa0' }}>Contact Us</h1>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
        You can reach us via the following contact details:
      </p>
      <ul style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
        <li>  Email: support@boibondhu.com</li>
        <li>  Phone: 01626969643</li>
        <li>  Address: Mawlana Bhashani Science And Technology Campus, MBSTU</li>
      </ul>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
        Business Hours: Sun-Wed 9am - 6pm
      </p>
      <form onSubmit={handleSubmit} className="contact-form" style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Subject:
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Message:
          <textarea name="message" value={formData.message} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }} />
        </label>
        <button type="submit" style={{ backgroundColor: '#2c5aa0', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Send Message
        </button>
      </form>
      <div className="map-container" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2c5aa0' }}>Our Location</h2>
        <iframe
          title="BoiBondhu Location"
          src="https://maps.google.com/maps?q=Mawlana+Bhashani+Science+and+Technology+University&z=15&output=embed"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '8px' }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      <div className="social-media" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2c5aa0' }}>Follow Us</h2>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', padding: 0 }}>
          <li><a href="https://facebook.com/boibondhu" target="_blank" rel="noopener noreferrer" style={{ color: '#3b5998', fontWeight: 'bold' }}>Facebook</a></li>
          <li><a href="https://twitter.com/boibondhu" target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2', fontWeight: 'bold' }}>Twitter</a></li>
          <li><a href="https://instagram.com/boibondhu" target="_blank" rel="noopener noreferrer" style={{ color: '#e1306c', fontWeight: 'bold' }}>Instagram</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Contact;
