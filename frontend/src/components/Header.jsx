
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
            <a href="/posts">게시글</a>
            <a href="/new-post">글쓰기</a>
          </nav>
        )}
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <div className="user-info">
            <span>환영합니다, {currentUser?.username || 'GenAI'}님!</span>
            <button className="header-button logout-button" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <span className="welcome-text">게시판에 오신 것을 환영합니다!</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;