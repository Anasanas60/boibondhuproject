import React from 'react';

const About = () => {
  return (
    <div className="page-container" style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2c5aa0' }}>About BoiBondhu</h1>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
        BoiBondhu is a community-driven textbook exchange platform designed to help students buy, sell, and trade textbooks easily and affordably. Our mission is to make education more accessible by reducing the cost burden of textbooks through peer-to-peer sharing.
      </p>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
        Founded by passionate students and educators, BoiBondhu leverages technology to connect textbook buyers and sellers within university campuses and beyond. We believe in fostering a sustainable and collaborative learning environment where resources are shared and reused.
      </p>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
        Our platform offers a user-friendly interface with features such as book listings, wishlists, reviews, and secure messaging to facilitate smooth transactions. We prioritize user safety and trust by implementing robust authentication and verification processes.
      </p>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
        Join the BoiBondhu community today and be part of a movement that empowers students to save money, reduce waste, and support each other in their academic journeys.
      </p>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2c5aa0' }}>Our Values</h2>
      <ul style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', paddingLeft: '1.2rem' }}>
        <li><strong>Community:</strong> Building a supportive network of students and educators.</li>
        <li><strong>Accessibility:</strong> Making textbooks affordable and available to all.</li>
        <li><strong>Sustainability:</strong> Promoting reuse and reducing waste.</li>
        <li><strong>Trust:</strong> Ensuring safe and reliable transactions.</li>
        <li><strong>Innovation:</strong> Continuously improving the platform to meet user needs.</li>
      </ul>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2c5aa0' }}>Contact Us</h2>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
        For inquiries, support, or feedback, please visit our <a href="/contact" style={{ color: '#2c5aa0', textDecoration: 'underline' }}>Contact Us</a> page.
      </p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0', marginBottom: '0.5rem' }}>Our Team</h3>
          <p>Our team consists of dedicated students and developers passionate about making textbook exchange easy and accessible.</p>
        </div>
        <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0', marginBottom: '0.5rem' }}>Our Vision</h3>
          <p>To become the leading platform for textbook exchange in universities across the country, fostering a sustainable and collaborative academic community.</p>
        </div>
        <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2c5aa0', marginBottom: '0.5rem' }}>Get Involved</h3>
          <p>We welcome feedback, contributions, and partnerships to help us grow and improve the BoiBondhu community.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
