import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Board from './components/Board/Board';
import PostDetail from './components/Board/PostDetail';
import PostForm from './components/Board/PostForm';
import ChatIcon from './components/ChatBot/ChatIcon';
import ChatBot from './components/ChatBot/ChatBot';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentView, setCurrentView] = useState('list');
    const [selectedPost, setSelectedPost] = useState(null);
    const [authView, setAuthView] = useState('login'); // 'login' or 'signup'

    // --- [추가] 게시판 새로고침을 위한 상태 ---
    const [refreshKey, setRefreshKey] = useState(0);

    // 로컬 스토리지에서 로그인 상태 확인
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            setIsLoggedIn(true);
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const API_URL = 'http://localhost:3001/posts';

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
        setCurrentView('list');
    };

    const handleSignup = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
        setCurrentView('list');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setCurrentUser(null);
        setCurrentView('list');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedPost(null); // selectedPost를 null로 초기화
        setRefreshKey(prevKey => prevKey + 1); // +1을 해서 상태 변경을 알림
    };

    const handlePostSelect = (postId) => {
        setSelectedPost(postId);
        setCurrentView('detail');
    };
    const handleNewPost = () => { setSelectedPost(null); setCurrentView('form'); };
    const handleEditPost = (post) => { setSelectedPost(post); setCurrentView('form'); };

    const handleDeletePost = async (postId) => {
        if (window.confirm(`정말로 이 글을 삭제하시겠습니까?`)) {
            try {
                const response = await fetch(`${API_URL}/${postId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('삭제 실패');
                alert('게시글이 삭제되었습니다.');
                handleBackToList(); // 삭제 후 목록으로 돌아가면서 새로고침
            } catch (error) {
                console.error('삭제 오류:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleFormSubmit = async (postData) => {
        try {
            let response;
            if (selectedPost && selectedPost._id) {
                response = await fetch(`${API_URL}/${selectedPost._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData),
                });
                if (!response.ok) throw new Error('수정 실패');
                alert('게시글이 수정되었습니다.');
            } else {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData),
                });
                if (!response.ok) throw new Error('생성 실패');
                alert('새로운 게시글이 작성되었습니다.');
            }
            handleBackToList(); // 저장 후 목록으로 돌아가면서 새로고침
        } catch (error) {
            console.error('저장 오류:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    const renderMainContent = () => {
        // 로그인하지 않은 경우 로그인/회원가입 화면 표시
        if (!isLoggedIn) {
            if (authView === 'signup') {
                return <Signup onSignup={handleSignup} onSwitchToLogin={() => setAuthView('login')} />;
            }
            return <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />;
        }

        // 로그인한 경우 게시판 화면 표시
        switch (currentView) {
            case 'detail':
                return <PostDetail postId={selectedPost} onBackToList={handleBackToList} onEdit={handleEditPost} onDelete={handleDeletePost} />;
            case 'form':
                return <PostForm post={selectedPost} onSubmit={handleFormSubmit} onCancel={handleBackToList} currentUser={currentUser} />;
            default:
                return <Board onPostClick={handlePostSelect} onNewPostClick={handleNewPost} refreshKey={refreshKey} />;
        }
    };

    return (
        <div className="App">
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} />
            <main>
                {renderMainContent()}
            </main>
            {isLoggedIn && <ChatIcon onClick={toggleChat} />}
            {isLoggedIn && isChatOpen && <ChatBot />}
        </div>
    );
}

export default App;
