import React from 'react';

const TestApp = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1>Test App - ACM Co-Founder Platform</h1>
      <p>If you can see this, the React app is working!</p>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>Status Check:</h2>
        <ul>
          <li>✅ React is working</li>
          <li>✅ Vite is working</li>
          <li>✅ CSS is loading</li>
        </ul>
      </div>
    </div>
  );
};

export default TestApp;
