

import React from 'react';
import './Header.css'; 

function Header({isLoggedIn}) {
  return (
    <header className="App-header">
      <div className="header-left">
        <h1 className="main-title">
          <a href="/">Board</a>
        </h1>
        <nav className="navigation">
          <a href="/posts">게시글</a>
          <a href="/new-post">글쓰기</a>
        </nav>
      </div>


      <div className="header-right">
        {isLoggedIn ? (
          // 로그인이 된 경우
          <div className="user-info">
            <span>환영합니다, GenAI님!</span>
            <button className="header-button logout-button">로그아웃</button>
          </div>
        ) : (
          // 로그인이 안 된 경우
          <div className="auth-buttons">
            <button className="header-button login-button">로그인</button>
            <button className="header-button signup-button">회원가입</button>
          </div>
        )}
      </div>

    </header>
  );
}

export default Header;