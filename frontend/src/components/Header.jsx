import React from 'react';

function Header({ isLoggedIn, onLogout, currentUser, onHomeClick, onNewPostClick }) {
  return (
    <header className="flex justify-between items-center px-10 h-[70px] bg-white/10 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-white/20 sticky top-0 z-[999] w-full shadow-[0_8px_32px_rgba(31,38,135,0.2)]">
      <div className="flex items-center gap-8">
        <h1>
          <a
            href="/"
            className="no-underline bg-gradient-to-r from-pink-300 to-red-400 bg-clip-text text-transparent text-[28px] font-black tracking-tight transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(245,87,108,0.6)]"
            style={{ textShadow: '0 0 30px rgba(240, 147, 251, 0.5)' }}
            onClick={(e) => { e.preventDefault(); onHomeClick && onHomeClick(); }}
          >
            Eun Board
          </a>
        </h1>

        {isLoggedIn && (
          <nav>
            <a
              href="/posts"
              className="no-underline text-white/90 ml-5 text-[15px] font-semibold transition-all duration-300 relative py-2 px-4 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-pink-300 before:to-red-400 before:transition-[width] before:duration-300 hover:text-white hover:-translate-y-0.5 hover:before:w-full"
              onClick={(e) => { e.preventDefault(); onHomeClick(); }}
            >
              Home
            </a>
            <a
              href="/new-post"
              className="no-underline text-white/90 ml-5 text-[15px] font-semibold transition-all duration-300 relative py-2 px-4 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-pink-300 before:to-red-400 before:transition-[width] before:duration-300 hover:text-white hover:-translate-y-0.5 hover:before:w-full"
              onClick={(e) => { e.preventDefault(); onNewPostClick(); }}
            >
              Post
            </a>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center">
            <span className="font-semibold mr-4 text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
              Welcome, {currentUser?.username || 'GenAI'}!
            </span>
            <button
              className="border-none py-2.5 px-6 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide relative overflow-hidden bg-gradient-to-r from-pink-300 to-red-400 text-white shadow-[0_4px_15px_rgba(245,87,108,0.4)] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:rounded-full before:bg-white/30 before:-translate-x-1/2 before:-translate-y-1/2 before:transition-all before:duration-600 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(245,87,108,0.6)] hover:before:w-[300px] hover:before:h-[300px]"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <span className="text-white/80 text-sm font-medium">Welcome to the Eun Board!</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;