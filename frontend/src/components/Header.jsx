
import React from 'react';
import './Header.css';

function Header({ isLoggedIn, onLogout, currentUser }) {
  return (
    <header className="App-header">
      <div className="header-left">
        <h1 className="main-title">
          <a href="/">Board</a>
        </h1>
        {isLoggedIn && (
          <nav className="navigation">
            <a href="/posts">Home</a>
            <a href="/new-post">Post</a>
          </nav>
        )}
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <div className="user-info">
            <span>Welcome, {currentUser?.username || 'GenAI'}!</span>
            <button className="header-button logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <span className="welcome-text">Welcome to the Board!</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;