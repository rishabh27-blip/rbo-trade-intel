import React from 'react';

const ModernLayout = () => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Your App Name</h1>
      </header>
      <div className="app-body">
        <nav className="sidebar">
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Profile</a></li>
            <li><a href="#">Settings</a></li>
            <li><a href="#">Logout</a></li>
          </ul>
        </nav>
        <main className="content-area">
          {/* Main content goes here */}
        </main>
      </div>
    </div>
  );
};

export default ModernLayout;