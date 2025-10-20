import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Board from './components/Board/Board';
import PostDetail from './components/Board/PostDetail';
import PostForm from './components/Board/PostForm';
import ChatIcon from './components/ChatBot/ChatIcon';
import ChatBot from './components/ChatBot/ChatBot';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // --- CRUD를 위한 상태 추가 ---
    const [currentView, setCurrentView] = useState('list');
    // [오류 해결] selectedPost 상태 변수를 선언합니다.
    const [selectedPost, setSelectedPost] = useState(null);
    // ---

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    // --- CRUD 관련 핸들러 함수들 ---
    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedPost(null);
    };

    const handlePostSelect = (postId) => {
        setSelectedPost({ id: postId });
        setCurrentView('detail');
    };

    const handleNewPost = () => {
        setSelectedPost(null);
        setCurrentView('form');
    };

    const handleEditPost = (post) => {
        setSelectedPost(post);
        setCurrentView('form');
    };

    const handleDeletePost = (postId) => {
        if (window.confirm(`정말로 ${postId}번 글을 삭제하시겠습니까?`)) {
            console.log(`${postId}번 글 삭제 API 호출`);
            alert('게시글이 삭제되었습니다.');
            handleBackToList();
        }
    };

    const handleFormSubmit = (postData) => {
        if (selectedPost && selectedPost.id) {
            console.log(`${selectedPost.id}번 글 수정 API 호출:`, postData);
            alert('게시글이 수정되었습니다.');
        } else {
            console.log('새 글 생성 API 호출:', postData);
            alert('새로운 게시글이 작성되었습니다.');
        }
        handleBackToList();
    };

    // --- 뷰 렌더링 함수 ---
    const renderMainContent = () => {
        switch (currentView) {
            case 'detail':
                return <PostDetail postId={selectedPost.id} onBackToList={handleBackToList} onEdit={handleEditPost} onDelete={handleDeletePost} />;
            case 'form':
                return <PostForm post={selectedPost} onSubmit={handleFormSubmit} onCancel={handleBackToList} />;
            default:
                return <Board onPostClick={handlePostSelect} onNewPostClick={handleNewPost} />;
        }
    };

    return (
        <div className="App">
            <Header isLoggedIn={isLoggedIn} />
            <main>
                {renderMainContent()}
            </main>
            <ChatIcon onClick={toggleChat} />
            {isChatOpen && <ChatBot />}
        </div>
    );
}

export default App;

