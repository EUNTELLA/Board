
import React from 'react';

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
    <header className="flex justify-between items-center px-10 h-[70px] bg-white/10 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-white/20 sticky top-0 z-[999] w-full shadow-[0_8px_32px_rgba(31,38,135,0.2)]">
      {/* === 왼쪽 섹션: 로고 + 네비게이션 === */}
      <div className="flex items-center gap-8">
        {/* 메인 로고/타이틀 */}
        <h1>
          <a
            href="/"
            className="no-underline bg-gradient-to-r from-pink-300 to-red-400 bg-clip-text text-transparent text-[28px] font-black tracking-tight transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(245,87,108,0.6)]"
            style={{ textShadow: '0 0 30px rgba(240, 147, 251, 0.5)' }}
          >
            Eun Board
          </a>
        </h1>

        {/* 로그인 상태일 때만 네비게이션 메뉴 표시 */}
        {isLoggedIn && (
          <nav>
            <a
              href="/posts"
              className="no-underline text-white/90 ml-5 text-[15px] font-semibold transition-all duration-300 relative py-2 px-4 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-pink-300 before:to-red-400 before:transition-[width] before:duration-300 hover:text-white hover:-translate-y-0.5 hover:before:w-full"
            >
              Home
            </a>
            <a
              href="/new-post"
              className="no-underline text-white/90 ml-5 text-[15px] font-semibold transition-all duration-300 relative py-2 px-4 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-pink-300 before:to-red-400 before:transition-[width] before:duration-300 hover:text-white hover:-translate-y-0.5 hover:before:w-full"
            >
              Post
            </a>
          </nav>
        )}
      </div>

      {/* === 오른쪽 섹션: 사용자 정보 / 환영 메시지 === */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          /* 로그인 상태: 사용자 이름 + 로그아웃 버튼 표시 */
          <div className="flex items-center">
            {/* 사용자 환영 메시지 (옵셔널 체이닝으로 안전하게 접근) */}
            <span className="font-semibold mr-4 text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
              Welcome, {currentUser?.username || 'GenAI'}!
            </span>

            {/* 로그아웃 버튼 */}
            <button
              className="border-none py-2.5 px-6 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide relative overflow-hidden bg-gradient-to-r from-pink-300 to-red-400 text-white shadow-[0_4px_15px_rgba(245,87,108,0.4)] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:rounded-full before:bg-white/30 before:-translate-x-1/2 before:-translate-y-1/2 before:transition-all before:duration-600 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(245,87,108,0.6)] hover:before:w-[300px] hover:before:h-[300px]"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          /* 비로그인 상태: 환영 메시지만 표시 */
          <div>
            <span className="text-white/80 text-sm font-medium">Welcome to the Eun Board!</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;