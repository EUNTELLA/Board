
import React from 'react';
import './Header.css';

/**
 * Header Component
 *
 * 애플리케이션 상단 네비게이션 바를 렌더링하는 컴포넌트
 * 로그인 상태에 따라 다른 UI를 표시
 *
 * @param {boolean} isLoggedIn - 사용자 로그인 여부
 * @param {Function} onLogout - 로그아웃 버튼 클릭 시 호출되는 콜백 함수
 * @param {Object} currentUser - 현재 로그인한 사용자 정보 객체
 * @param {string} currentUser.username - 사용자 이름
 * @param {string} currentUser.email - 사용자 이메일
 * @param {string} currentUser.userId - 사용자 고유 ID
 */
function Header({ isLoggedIn, onLogout, currentUser }) {
  return (
    <header className="App-header">
      {/* === 왼쪽 섹션: 로고 + 네비게이션 === */}
      <div className="header-left">
        {/* 메인 로고/타이틀 */}
        <h1 className="main-title">
          <a href="/">Eun Board</a>
        </h1>

        {/* 로그인 상태일 때만 네비게이션 메뉴 표시 */}
        {isLoggedIn && (
          <nav className="navigation">
            <a href="/posts">Home</a>
            <a href="/new-post">Post</a>
          </nav>
        )}
      </div>

      {/* === 오른쪽 섹션: 사용자 정보 / 환영 메시지 === */}
      <div className="header-right">
        {isLoggedIn ? (
          /* 로그인 상태: 사용자 이름 + 로그아웃 버튼 표시 */
          <div className="user-info">
            {/* 사용자 환영 메시지 (옵셔널 체이닝으로 안전하게 접근) */}
            <span>Welcome, {currentUser?.username || 'GenAI'}!</span>

            {/* 로그아웃 버튼 */}
            <button className="header-button logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          /* 비로그인 상태: 환영 메시지만 표시 */
          <div className="auth-buttons">
            <span className="welcome-text">Welcome to the Eun Board!</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;